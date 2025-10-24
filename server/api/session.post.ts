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
		useStorage("dynamo").setItem(sessionId, body);
	} else {
		// Otherwise create new session Id
		sessionId = uuidv4();

		// Store session Id in cookie
		setCookie(event, "sessionId", sessionId, {
			maxAge: 60 * 60 * 24 * 14,
			httpOnly: true,
		});

		const timestamp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60 * 1000;
		// Save state to storage
		useStorage("dynamo").setItem(sessionId, body, { ttl: timestamp });
	}
	event.node.res.end();
});
