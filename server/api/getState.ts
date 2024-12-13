import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { EcaasState } from "~/stores/ecaasStore.types";

export default defineEventHandler(async (event) => {
	// Read session Id from cookie
	const sessionId = getCookie(event, 'sessionId');

	// If session exists, create storage and return existing state
	if (sessionId) {
		const storage = createStorage({
			driver: fsDriver({ base: './tmp' })
		});

		return await storage.getItem<EcaasState>(sessionId);
	}

	// Otherwise return null
	return null;
});