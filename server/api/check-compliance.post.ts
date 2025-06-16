import clientSession from "../services/clientSession";
import ecaasApi from "../services/ecaasApi";

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const { accessToken } = await clientSession.get();

	return await ecaasApi.checkCompliance(body, accessToken);
});