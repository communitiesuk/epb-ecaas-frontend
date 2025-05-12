import type { SchemaFhsComplianceResponse} from "~/schema/api-schema.types";
import {ApiPaths} from "~/schema/api-schema.types";
import type { ApiInfoResponse, TokenResponse } from "../server.types";

const ecaasApi = {
	getToken: async (clientId: string, clientSecret: string) => {
		const response = await fetch(`${process.env.ECAAS_AUTH_API_URL}/oauth2/token`, {
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

		return await response.json() as TokenResponse;
	},

	getInfo: async (accessToken: string) => {
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.ApiMetadata}`;
		const response = await fetch(uri, {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});

		return await response.json() as ApiInfoResponse;
	},

	checkCompliance: async (data: object, accessToken: string) => {
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.FHSCompliance}`;
		const response = await fetch(uri, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify(data)
		});

		return await response.json() as SchemaFhsComplianceResponse;
	}
};

export default ecaasApi;