
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import { successResponse, errorResponse, API_ERRORS } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  // 1. Auth & Rate Limit
  const apiKey = await validateApiKey(req);
  if (!apiKey) return errorResponse(API_ERRORS.UNAUTHORIZED.code, API_ERRORS.UNAUTHORIZED.message, null, 401);

  const rateLimit = checkRateLimit(apiKey.key);
  if (!rateLimit.allowed) return errorResponse(API_ERRORS.RATE_LIMITED.code, API_ERRORS.RATE_LIMITED.message, null, 429);

  // 2. Fetch Data
  const projects = await db.project.findMany({
    where: { workspaceId: apiKey.workspaceId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return successResponse(projects);
}

export async function POST(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) return errorResponse(API_ERRORS.UNAUTHORIZED.code, API_ERRORS.UNAUTHORIZED.message, null, 401);

  const rateLimit = checkRateLimit(apiKey.key);
  if (!rateLimit.allowed) return errorResponse(API_ERRORS.RATE_LIMITED.code, API_ERRORS.RATE_LIMITED.message, null, 429);

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) return errorResponse(API_ERRORS.VALIDATION_ERROR.code, "Name is required", null, 400);

    const project = await db.project.create({
      data: {
        name,
        description,
        workspaceId: apiKey.workspaceId,
      }
    });

    return successResponse(project, {}, { status: 201 });
  } catch (error) {
    return errorResponse(API_ERRORS.INTERNAL_ERROR.code, "Failed to create project", null, 500);
  }
}
