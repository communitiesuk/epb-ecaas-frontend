import ecaasApi from "../services/ecaasApi";
import clientSession from "../services/clientSession";

export default defineEventHandler(async _ => {
	// Get token from session
	const { accessToken } = await clientSession.get();

	// Get API info
	return await ecaasApi.getInfo(accessToken);
});