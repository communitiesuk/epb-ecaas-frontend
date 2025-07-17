import {ApiPaths} from "~/schema/api-schema.types";
import type { ApiInfoResponse, FhsComplianceResponseIncludingErrors, TokenResponse } from "../server.types";
import clientSession from "../services/clientSession";
import * as Sentry from "@sentry/nuxt";

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
			}),
			ignoreResponseError: true
		});
	},

	getInfo: async () => {
		const { accessToken } = (await clientSession.get());
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.ApiMetadata}`;
		const response = await fetch(uri, {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});

		return await response.json() as ApiInfoResponse;
	},

	checkCompliance: async (data: object) => {
		const { accessToken } = (await clientSession.get());
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.FHSCompliance}`;
		const response = await $fetch<FhsComplianceResponseIncludingErrors>(uri, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify(data),
			ignoreResponseError: true
		});

		if ('errors' in response) {
			console.log('INSIDE IF - ECaaS API returned errors.');
			Sentry.captureMessage("ECaaS API server error");
			await Sentry.flush(5000);
		};

		return response;
	}
};

export default ecaasApi;