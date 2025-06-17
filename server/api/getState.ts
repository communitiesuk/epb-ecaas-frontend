import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import type { EcaasState } from "~/stores/ecaasStore.types";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, "sessionId");

  if (sessionId) {
    const storage = createStorage({
      driver: redisDriver({
        base: "{unstorage}",
        port: 6379,
        host: "elasticache-for-valkey-4oy4a5.serverless.euw2.cache.amazonaws.com",
        tls: true as any,
      }),
    });

    return await storage.getItem<EcaasState>(sessionId);
  }
  return null;
});
