import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key);
    } catch (error) {
      console.error("Cache Get Error:", error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL (Time To Live) in seconds
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await redis.set(key, value, { ex: ttl });
    } catch (error) {
      console.error("Cache Set Error:", error);
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Cache Del Error:", error);
    }
  },

  /**
   * Specialized key generator for AI orchestration caching
   */
  generateAIKey(workspaceId: string, prompt: string, model: string): string {
    const hash = Buffer.from(prompt).toString("base64").substring(0, 32);
    return `ai_cache:${workspaceId}:${model}:${hash}`;
  }
};
