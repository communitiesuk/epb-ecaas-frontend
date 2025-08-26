import type { EcaasState } from "~/stores/ecaasStore.schema";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
	// Read payload from request body
	const body = await readBody(event);

	// Read session Id from cookie
	let sessionId = getCookie(event, "sessionId");

	// If session exists, read state from storage
	if (sessionId) {
		// const state = await storage.getItem<EcaasState>(sessionId);

		// Merge updated partial state with existing state
		// const newState = merge(state!, body);

		// Update storage item
		await setStateOnCache(sessionId, body);
	} else {
		// Otherwise create new session Id
		sessionId = uuidv4();

		// Store session Id in cookie
		setCookie(event, "sessionId", sessionId, {
			maxAge: 60 * 60 * 24 * 14,
			httpOnly: true,
		});

		// Save state to storage
		await setStateOnCache(sessionId, body);
	}
	event.node.res.end();
});

async function setStateOnCache(sessionId: string, body: EcaasState) {
	return useStorage("cache").setItem(sessionId, body, {
		ttl: 1209600,
	});
}