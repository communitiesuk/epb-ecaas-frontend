import exampleData from '@/data/examples/demo_FHS.json';
import type { StripDefs } from './mapping.types';
import type { SchemaFhsInputSchema } from '~/schema/api-schema.types';

export function mapFhsInputData(_: EcaasState): StripDefs<SchemaFhsInputSchema> {
	const inputData = exampleData as StripDefs<SchemaFhsInputSchema>;

	// TODO: Create mapped data (of type Partial<StripDefs<SchemaFhsInputSchema>>) to merge with returned object

	return {
		...inputData
	};
}