import type { Redis } from "ioredis"
/**
 * @param ttl in seconds, please 
*/
export const idempotency = (redis: Redis, ttl: number) => {
  const createIdempotencyKey = (...args: string[]) => args.join(":")
  return {
    createIdempotencyKey,
    save: async (key: string) => {
      await redis.set(key, "1", "EX", ttl)
    },
    exists: async (key: string) => {
      return Boolean(await redis.get(key))
    }
  }
}
