import type { EcaasState } from "~/stores/ecaasStore.types";

export default defineEventHandler(async (event) => {
	const sessionId = getCookie(event, "sessionId");
	console.log(sessionId, "sessionId");
	if (sessionId) {
		const res = await useStorage("cache").getItem<EcaasState>(sessionId);
		console.log(res, "data from cache");

		return res;
	}
	return null;
});
