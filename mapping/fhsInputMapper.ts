import exampleData from '@/data/examples/demo_FHS.json';
import type { StripDefs } from './mapping.types';
import type { SchemaFhsInputSchema } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';
import { mapInfiltrationVentilationData } from './infiltrationVentilationMapper';
import { mapHeatingSystemsData } from './heatingSystemsMapper';
import { mapLivingSpaceFabricData } from './livingSpaceFabricMapper';
import { mapPvAndElectricBatteriesData } from './pvAndElectricBatteriesMapper';
import { mapDomesticHotWaterData } from './domesticHotWaterMapper';

export function mapFhsInputData(state: EcaasState): FhsInputSchema {
	const inputData = exampleData as FhsInputSchema;

	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const livingSpaceFabricData = mapLivingSpaceFabricData(state);
	const heatingSystemsData = mapHeatingSystemsData(state);
	const [pvData, _electricBatteries] = mapPvAndElectricBatteriesData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);

	const intermediate = merge.all([
		dwellingDetailsData,
		infiltrationVentilationData,
		livingSpaceFabricData,
		heatingSystemsData,
		domesticHotWaterData,
		pvData
	]);
	
	const final = merge(inputData, intermediate);

	console.log(final);

	return final;
}

export type FhsInputSchema = StripDefs<SchemaFhsInputSchema>;