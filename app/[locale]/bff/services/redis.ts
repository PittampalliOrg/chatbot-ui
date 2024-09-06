import { createClient } from "redis"
import "server-only"
import { redisUrl } from "../serverConfig"

export const redisClient = createClient(
  redisUrl ? { url: redisUrl } : undefined
)

redisClient.on("error", (err: any) => console.log("Redis Client Error", err))
