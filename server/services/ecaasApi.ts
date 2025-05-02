import type { ApiInfoResponse, TokenResponse } from "../server.types";

const ecaasApi = {
	getToken: async (clientId: string, clientSecret: string) => {
		return await $fetch<TokenResponse>(`${process.env.ECAAS_AUTH_API_URL}/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'grant_type': 'client_credentials',
				'scope': 'ecaas-api/home-energy-model',
				'client_id': clientId,
				'client_secret': clientSecret
			})
		});
	},

	getInfo: async (accessToken: string) => {
		return await $fetch<ApiInfoResponse>(`${process.env.ECAAS_API_URL}/`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
	}
};

export default ecaasApi;