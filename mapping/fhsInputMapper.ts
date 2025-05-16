import exampleData from '@/data/examples/demo_FHS.json';
import type { StripDefs } from './mapping.types';
import type { SchemaFhsInputSchema } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';

export function mapFhsInputData(state: EcaasState): StripDefs<SchemaFhsInputSchema> {
	const inputData = exampleData as StripDefs<SchemaFhsInputSchema>;

	const dwellingDetailsData = mapDwellingDetailsData(state);

	return merge(inputData, dwellingDetailsData);
}