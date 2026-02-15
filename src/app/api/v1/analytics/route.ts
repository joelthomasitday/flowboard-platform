
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
  const period = searchParams.get('period') || '30d';

  // Mock analytics data aggregation
  const stats = {
    period,
    tasksCompleted: await db.task.count({
      where: { 
        project: { workspaceId: apiKey.workspaceId },
        status: "DONE" 
      }
    }),
    activeProjects: await db.project.count({
         where: { workspaceId: apiKey.workspaceId }
    }),
    aiTokensUsed: 12500, // Mock, would fetch from AIUsage table
  };

  return successResponse(stats);
}
