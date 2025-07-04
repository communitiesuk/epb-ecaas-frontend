import type { SchemaFhsComplianceResponse, SchemaFhsMeta } from "~/schema/api-schema.types";
import type { CorrectedJsonApiError } from "~/stores/ecaasStore.types";

export interface TokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface ClientSession {
	accessToken: string;
	expires: number;
}

export interface ParameterStoreResponse {
	Parameter: ParameterData;
}

export interface ParameterData {
	Name: string;
	Type: string;
	Value: string;
}

export interface ApiInfoResponse {
	links: {
		describedBy: string;
	};
	title: string;
	version: string;
}

export type FhsComplianceResponseIncludingErrors = {
	data: SchemaFhsComplianceResponse,
	meta: SchemaFhsMeta,
} | {
	errors: CorrectedJsonApiError[],
	meta: SchemaFhsMeta,
};