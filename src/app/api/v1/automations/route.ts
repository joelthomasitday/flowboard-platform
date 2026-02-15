
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

  const automations = await db.automationRule.findMany({
    where: { workspaceId: apiKey.workspaceId },
    select: {
      id: true,
      name: true,
      trigger: true,
      action: true,
      isActive: true,
    }
  });

  return successResponse(automations);
}
