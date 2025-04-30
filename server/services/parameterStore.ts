import type { ParameterStoreResponse } from "../server.types";

const parameterStore = {
	getParameter: async (name: string) => {
		const response = await fetch(`http://localhost:2773/systemsmanager/parameters/get?name=${name}&withDecryption=true`, {
			headers: {
				'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN!
			}
		});

		return await response.json() as ParameterStoreResponse;
	}
};

export default parameterStore;