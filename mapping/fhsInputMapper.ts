import exampleData from '@/data/examples/demo_FHS.json';
import type { StripDefs } from './mapping.types';
import type { SchemaFhsInputSchema } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';
import { mapInfiltrationVentilationData } from './infiltrationVentilationMapper';
import { mapHeatingSystemsData } from './heatingSystemsMapper';
import { mapPvAndElectricBatteriesData } from './pvAndElectricBatteriesMapper';

export function mapFhsInputData(state: EcaasState): FhsInputSchema {
	const inputData = exampleData as FhsInputSchema;

	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const heatingSystemsData = mapHeatingSystemsData(state);
	const pvAndElectricBatteriesData = mapPvAndElectricBatteriesData(state);

	const intermediate = merge(dwellingDetailsData, merge(infiltrationVentilationData, merge(heatingSystemsData, pvAndElectricBatteriesData)));
	const final = merge(inputData, intermediate);

	console.log(final);

	return final;
}

export type FhsInputSchema = StripDefs<SchemaFhsInputSchema>;