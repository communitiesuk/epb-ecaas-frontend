import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import type { EcaasState } from "~/stores/ecaasStore.types";

// export default defineEventHandler(async (event) => {
// Read session Id from cookie
// const sessionId = getCookie(event, "sessionId");

// If session exists, create storage and return existing state
// if (sessionId) {
// const storage = createStorage({
//   driver: redisDriver({
//     base: "{unstorage}",
//     cluster: [
//       {
//         port: 6379,
//         host: "elasticache-for-valkey-4oy4a5.serverless.euw2.cache.amazonaws.com",
//       },
//     ],
//   }),
// });

// return await storage.getItem<EcaasState>(sessionId);
// }

// Otherwise return null
//   return null;
// });


export default defineEventHandler(async (event) => {

	const sessionId = getCookie(event, "sessionId");

	if(sessionId){

		const storage = createStorage({
			driver: redisDriver({
				base: "{unstorage}",
				port: 6379,
				host: "localhost",
			}),
		});
  
		return await storage.getItem<EcaasState>(sessionId);
	}
	return null;
});