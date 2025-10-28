import type { H3Event } from "h3";
import { v4 as uuidv4 } from "uuid";
import type { EcaasState } from "~/stores/ecaasStore.schema";

const twoWeeksInSeconds = 14 * 24 * 60 * 60;

async function getSessionId(event: H3Event) {
	let sessionId = getCookie(event, "sessionId");
	if (!sessionId) {
		sessionId = uuidv4();

		setCookie(event, "sessionId", sessionId, {
			maxAge: twoWeeksInSeconds,
			httpOnly: true,
		});
	}
	return sessionId;
}
export default defineEventHandler(async (event) => {
	const timeToLive = Math.floor(Date.now() / 1000) + twoWeeksInSeconds;
	const body = await readBody(event);
	const sessionId = await getSessionId(event);
	const storedSession = await useStorage("dynamo").getItem<EcaasState>(sessionId);

	if (storedSession) {
		await useStorage("dynamo").setItem(sessionId, body);
	} else {
		await useStorage("dynamo").setItem(sessionId, body, { ttl: timeToLive });
	}
	event.node.res.end();
});


// we may want to do the following to limit the amount of data being sent to the server:
// Merge updated partial state with existing state
// const newState = merge(state!, body)