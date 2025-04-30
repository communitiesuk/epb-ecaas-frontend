import type { ParameterStoreResponse } from "../server.types";

const parameterStore = {
	getParameter: async (name: string) => {
		const response = await fetch('http://localhost:2773/systemsmanager/parameters/get', {
			headers: {
				'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN!
			},
			body: new URLSearchParams({
				name: name,
				withDecryption: 'true'
			})
		});

		return await response.json() as ParameterStoreResponse;
	}
};

export default parameterStore;