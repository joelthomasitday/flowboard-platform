import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const apiRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});

// Stricter limit for AI endpoints
export const aiRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/ai",
});

export async function rateLimitMiddleware(req: NextRequest) {
  // Trust proxy headers for IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
  const path = req.nextUrl.pathname;

  let limiter = apiRatelimit;
  
  if (path.includes("/api/ai")) {
    limiter = aiRatelimit;
  }

  const { success, limit, reset, remaining } = await limiter.limit(ip);

  if (!success) {
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  return null;
}
