import exampleData from '@/data/examples/demo_FHS.json';
import type { StripDefs } from './mapping.types';
import type { SchemaFhsInputSchema } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';

export function mapFhsInputData(state: EcaasState): FhsInputSchema {
	const inputData = exampleData as FhsInputSchema;

	const dwellingDetailsData = mapDwellingDetailsData(state);

	return merge(inputData, dwellingDetailsData);
}

export type FhsInputSchema = StripDefs<SchemaFhsInputSchema>;