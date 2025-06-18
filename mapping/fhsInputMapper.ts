import type { StripDefs } from './mapping.types';
import { ColdWaterSourceType, type SchemaFhsInputSchema } from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';
import { mapInfiltrationVentilationData } from './infiltrationVentilationMapper';
import { mapHeatingSystemsData } from './heatingSystemsMapper';
import { mapLivingSpaceFabricData } from './livingSpaceFabricMapper';
import { mapPvAndElectricBatteriesData } from './pvAndElectricBatteriesMapper';
import { mapDomesticHotWaterData } from './domesticHotWaterMapper';
import { mapCoolingData } from './coolingMapper';

export type ResolvedState = Resolved<EcaasState>;

export function mapFhsInputData(state: Resolved<EcaasState>): FhsInputSchema {
	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const livingSpaceFabricData = mapLivingSpaceFabricData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);
	const coolingData = mapCoolingData(state);

	const [pvData, electricBatteries] = mapPvAndElectricBatteriesData(state);
	const { EnergySupply, SpaceHeatSystem } = mapHeatingSystemsData(state);
	const fuelType = "mains elec";
	const heatingSystemsData = {
		SpaceHeatSystem,
		EnergySupply: {
			[fuelType]: {...EnergySupply[fuelType], ...electricBatteries}
		}
	};

	const control: Partial<FhsInputSchema> = {Control: {}};
	const events: Partial<FhsInputSchema> = {Events: {}};
	const internalGains: Partial<FhsInputSchema> = {InternalGains: {}};
	
	const defaultColdWaterSource: Partial<FhsInputSchema> = { 
		ColdWaterSource: {
			[ColdWaterSourceType.mains_water]: {
				start_day: 0,
				temperatures: [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
				time_series_step: 1
			}
		}
	};
	const defaultSimulationTime: Partial<FhsInputSchema> = {
		SimulationTime: {
			start: 0,
			end: 8,
			step: 1
		}
	};

	const fhsInput = merge.all([
		dwellingDetailsData,
		infiltrationVentilationData,
		livingSpaceFabricData,
		heatingSystemsData,
		domesticHotWaterData,
		pvData,
		coolingData,
		defaultColdWaterSource,
		control,
		events,
		internalGains,
		defaultSimulationTime
	]) as FhsInputSchema;

	console.log(fhsInput);

	return fhsInput;
}

export type FhsInputSchema = StripDefs<SchemaFhsInputSchema>;