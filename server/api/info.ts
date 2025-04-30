import ecaasApi from "../services/ecaasApi";
import session from "../services/session";

export default defineEventHandler(async _ => {
	// Get token from session
	const { access_token } = await session.get();

	// Get API info
	return await ecaasApi.getInfo(access_token);
});