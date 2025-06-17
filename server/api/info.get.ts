import ecaasApi from "../services/ecaasApi";

export default defineEventHandler(async _ => {
	// Get API info
	return await ecaasApi.getInfo();
});