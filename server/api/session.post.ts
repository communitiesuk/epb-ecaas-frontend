import { v4 as uuidv4 } from "uuid";
import type { EcaasState } from "~/stores/ecaasStore.schema";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const twoWeeksInSeconds = 14 * 24 * 60 * 60;
	const timeToLive = Math.floor(Date.now() / 1000) + twoWeeksInSeconds;
  let sessionId = getCookie(event, "sessionId");
	
  if (sessionId) {
    const storedSession = await useStorage("dynamo").getItem<EcaasState>(sessionId);
   
		if(storedSession){
			await useStorage("dynamo").setItem(sessionId, body)
		} else{
			await setSessionWithTtl(sessionId, body, timeToLive);
		}
 
    // we may want to do the following to limit the amout of data being sent to the server:
     // Merge updated partial state with existing state
    // const newState = merge(state!, body);
  } else {
    sessionId = uuidv4();

    setCookie(event, "sessionId", sessionId, {
      maxAge: twoWeeksInSeconds,
      httpOnly: true,
    });

    await setSessionWithTtl(sessionId, body, timeToLive);
  }
  event.node.res.end();
});

async function setSessionWithTtl(sessionId: string, body: EcaasState, timeToLive: number) {
	await useStorage("dynamo").setItem(sessionId, body, { ttl: timeToLive });
}