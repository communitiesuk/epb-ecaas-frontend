import type { EcaasState } from "~/stores/ecaasStore.types";

export default defineEventHandler(async (event) => {
	const sessionId = getCookie(event, "sessionId");
	if (sessionId) {
		return await useStorage("cache").getItem<EcaasState>(sessionId);
	}
	return null;
});
