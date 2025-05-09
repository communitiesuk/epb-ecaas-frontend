import clientSession from "../services/clientSession";
import ecaasApi from "../services/ecaasApi";

export default defineEventHandler(async event => {
	console.log("checking compliance!");

	const body = await readBody(event);

	const { accessToken } = await clientSession.get();

	return await ecaasApi.checkCompliance(body, accessToken);
});