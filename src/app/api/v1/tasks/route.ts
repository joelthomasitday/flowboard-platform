
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import { successResponse, errorResponse, API_ERRORS } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) return errorResponse(API_ERRORS.UNAUTHORIZED.code, API_ERRORS.UNAUTHORIZED.message, null, 401);

  const rateLimit = checkRateLimit(apiKey.key);
  if (!rateLimit.allowed) return errorResponse(API_ERRORS.RATE_LIMITED.code, API_ERRORS.RATE_LIMITED.message, null, 429);

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const status = searchParams.get('status');

  const where: any = {
    project: { workspaceId: apiKey.workspaceId }
  };

  if (projectId) where.projectId = projectId;
  if (status) where.status = status;

  const tasks = await db.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      projectId: true,
    }
  });

  return successResponse(tasks);
}

export async function POST(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) return errorResponse(API_ERRORS.UNAUTHORIZED.code, API_ERRORS.UNAUTHORIZED.message, null, 401);

  const rateLimit = checkRateLimit(apiKey.key);
  if (!rateLimit.allowed) return errorResponse(API_ERRORS.RATE_LIMITED.code, API_ERRORS.RATE_LIMITED.message, null, 429);

  try {
    const body = await req.json();
    const { title, projectId, priority, dueDate } = body;

    if (!title || !projectId) {
      return errorResponse(API_ERRORS.VALIDATION_ERROR.code, "Title and ProjectId are required", null, 400);
    }

    // Verify project belongs to workspace
    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: apiKey.workspaceId }
    });

    if (!project) {
      return errorResponse(API_ERRORS.NOT_FOUND.code, "Project not found", null, 404);
    }

    const task = await db.task.create({
      data: {
        title,
        projectId,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    });

    return successResponse(task, {}, { status: 201 });
  } catch (error) {
    return errorResponse(API_ERRORS.INTERNAL_ERROR.code, "Failed to create task", null, 500);
  }
}
