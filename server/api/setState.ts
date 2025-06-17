import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import type { EcaasState } from "~/stores/ecaasStore.types";
import { v4 as uuidv4 } from "uuid";
import merge from "deepmerge";

export default defineEventHandler(async (event) => {
  // Read payload from request body
  const body = await readBody(event);

  // Ready session Id from cookie
  let sessionId = getCookie(event, "sessionId");

  // Create storage
  const storage = createStorage({
    driver: redisDriver({
      base: "{unstorage}",
      port: 6379,
      host: "elasticache-for-valkey-4oy4a5.serverless.euw2.cache.amazonaws.com",
			tls: true as any
    }),
  });
  // If session exists, read state from storage
  if (sessionId) {
    const state = await storage.getItem<EcaasState>(sessionId);

    // Merge updated partial state with existing state
    const newState = merge(state!, body);

    // Update storage item
    storage.setItem<EcaasState>(sessionId, newState);
  } else {
    // Otherwise create new session Id
    sessionId = uuidv4();

    // Store session Id in cookie
    setCookie(event, "sessionId", sessionId, {
      maxAge: 60 * 60 * 24 * 14,
      httpOnly: true,
    });

    // Save state to storage
    await storage.setItem<EcaasState>(sessionId, body, { ttl: 1209600 });
  }
  event.node.res.end();
});
