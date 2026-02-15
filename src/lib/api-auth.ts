import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function validateApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const key = authHeader.split(" ")[1];

  const apiKey = await db.apiKey.findUnique({
    where: { key },
    include: { workspace: true },
  });

  if (!apiKey || !apiKey.isActive) {
    return null;
  }

  // Update last used (fire and forget to avoid slowing down request significantly, 
  // though in serverless this might be cut off, acceptable for MVP)
  // In a real high-throughput scenario, this would be aggregated in Redis/Metrics
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKey;
}
