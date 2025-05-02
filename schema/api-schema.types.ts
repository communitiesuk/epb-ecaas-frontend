import type { components } from "./api-schema";

export type FhsComplianceResponse = components['schemas']['FhsComplianceResponse'];
export type FhsMeta = components['schemas']['FhsMeta'];

export interface CheckComplianceResponse {
	data: FhsComplianceResponse;
	meta: FhsMeta;
}