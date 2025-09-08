import { ApiPaths } from "~/schema/api-schema.types";
import type { ApiInfoResponse, FhsComplianceResponseIncludingErrors, TokenResponse } from "../server.types";
import clientSession from "../services/clientSession";
import { ajv, humanReadable } from "~/schema/validator";
import * as Sentry from "@sentry/nuxt";
import type { CorrectedJsonApiError } from "~/stores/ecaasStore.schema";
import type { ErrorObject } from "ajv";

const ecaasApi = {
	getToken: async (clientId: string, clientSecret: string) => {
		return await $fetch<TokenResponse>(`${process.env.ECAAS_AUTH_API_URL}/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				"grant_type": "client_credentials",
				"scope": "ecaas-api/home-energy-model",
				"client_id": clientId,
				"client_secret": clientSecret
			}),
			ignoreResponseError: true
		});
	},

	getInfo: async () => {
		const { accessToken } = (await clientSession.get());
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.ApiMetadata}`;
		const response = await fetch(uri, {
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		});

		return await response.json() as ApiInfoResponse;
	},

	checkCompliance: async function checkCompliance(data: object) {
		// first, perform validation against the schema
		const validate = ajv.getSchema("fhs")!;
		const isValid = validate(data);
		if (!isValid) {
			const validationErrors = validate.errors!;
			reportErrors(data, humanReadable(validationErrors, data), "Schema validation error");
			return responseForValidationErrors(validate.errors!, data);
		}

		// second, send to ECaaS API
		const { accessToken } = (await clientSession.get());
		const uri = `${process.env.ECAAS_API_URL}${ApiPaths.FHSCompliance}`;
		const response = await $fetch<FhsComplianceResponseIncludingErrors>(uri, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify(data),
			ignoreResponseError: true
		});

		if ("errors" in response) {
			const errorMessage = response.errors?.[0]?.detail ?? "Unknown error";

			reportErrors(data, response.errors, errorMessage);
		};

		return response;
	}
};

function reportErrors(requestData: object, responseErrors: CorrectedJsonApiError[] | string, errorMessage: string): void {
	let requestBodyWithoutExternalConditions: object;

	if ("ExternalConditions" in requestData) {
		const { ExternalConditions, ...rest } = requestData;
		requestBodyWithoutExternalConditions = rest;
	}
			
	Sentry.withScope(scope => {
		scope.setExtra("responseErrors", responseErrors);
		scope.setExtra("requestBody", JSON.stringify(requestData));
		scope.setExtra("requestBody without External Conditions", JSON.stringify(requestBodyWithoutExternalConditions || requestData));
		scope.setFingerprint([errorMessage]);
		Sentry.captureException(new Error(errorMessage));
	});
}

function responseForValidationErrors(errors: ErrorObject[], data: object): Promise<FhsComplianceResponseIncludingErrors> {
	const errorPart = validationErrorsAsApiErrors(errors, data);

	return Promise.resolve(
		{
			errors: errorPart,
		}
	);
}

function validationErrorsAsApiErrors(errors: ErrorObject[], data: object): CorrectedJsonApiError[] {
	return [{
		status: "422",
		title: "JSON Schema validation error",
		detail: humanReadable(errors, data),
	}];
}

export default ecaasApi;