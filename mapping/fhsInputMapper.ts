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
	const [pvData, _electricBatteries] = mapPvAndElectricBatteriesData(state);

	// TODO merge electric batteries onto energy supplies once we know the right logic

	const intermediate = merge(dwellingDetailsData, merge(infiltrationVentilationData, merge(heatingSystemsData, pvData)));
	const final = merge(inputData, intermediate);

	console.log(final);

	return final;
}

export type FhsInputSchema = StripDefs<SchemaFhsInputSchema>;