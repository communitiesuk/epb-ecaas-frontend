import ecaasApi from "../services/ecaasApi";

export default defineEventHandler(async event => {
	const body = await readBody(event);

	return await ecaasApi.checkCompliance(body);
});