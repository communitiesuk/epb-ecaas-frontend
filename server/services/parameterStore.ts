import type { ParameterStoreResponse } from "../server.types";

// This is required to be set to localhost:2773 to work when running in AWS
const parameterStoreUrl = "http://localhost:2773/systemsmanager/parameters";

const parameterStore = {
	getParameter: async (name: string) => {
		const response = await fetch(`${parameterStoreUrl}/get?name=${name}&withDecryption=true`, {
			headers: {
				"X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN!,
			},
		});

		return await response.json() as ParameterStoreResponse;
	},
};

export default parameterStore;