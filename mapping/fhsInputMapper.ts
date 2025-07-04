import type { StripDefs } from './mapping.types';
import { ColdWaterSourceType   } from '~/schema/api-schema.types';
import type {SchemaFhsInputSchema, SchemaStorageTank} from '~/schema/api-schema.types';
import { mapDwellingDetailsData } from './dwellingDetailsMapper';
import merge from 'deepmerge';
import { mapInfiltrationVentilationData } from './infiltrationVentilationMapper';
import { mapHeatingSystemsData } from './heatingSystemsMapper';
import { mapLivingSpaceFabricData as mapDwellingFabricData } from './dwellingFabricMapper';
import { mapPvAndElectricBatteriesData } from './pvAndElectricBatteriesMapper';
import { mapDomesticHotWaterData } from './domesticHotWaterMapper';
import { defaultHeatSourceWetDetails } from "~/mapping/common";

export type ResolvedState = Resolved<EcaasState>;

export function mapFhsInputData(state: Resolved<EcaasState>): FhsInputSchema {
	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const dwellingFabricData = mapDwellingFabricData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);
	// const coolingData = mapCoolingData(state);

	const [pvData, electricBatteries] = mapPvAndElectricBatteriesData(state);
	const { EnergySupply, SpaceHeatSystem } = mapHeatingSystemsData(state);
	const fuelType = "mains elec";
	const heatingSystemsData = {
		SpaceHeatSystem,
		EnergySupply: {
			[fuelType]: {...EnergySupply[fuelType], ...electricBatteries}
		}
	};

	const control: Pick<FhsInputSchema, 'Control'> = {Control: {}};
	const events: Pick<FhsInputSchema, 'Events'> = {Events: {}};
	const internalGains: Pick<FhsInputSchema, 'InternalGains'> = {InternalGains: {}};
	
	const defaultColdWaterSource: Pick<FhsInputSchema, 'ColdWaterSource'> = { 
		ColdWaterSource: {
			[ColdWaterSourceType.mains_water]: {
				start_day: 0,
				temperatures: [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
				time_series_step: 1
			}
		}
	};
	const defaultSimulationTime: Pick<FhsInputSchema, 'SimulationTime'> = {
		SimulationTime: {
			start: 0,
			end: 8,
			step: 1
		}
	};
	// Below uses default values until heat pump is set up to come from PCDB
	const { HotWaterSource } = domesticHotWaterData;
	const heatPumpName: string = Object.keys((HotWaterSource!['hw cylinder'] as SchemaStorageTank).HeatSource)[0]!;
	const defaultHeatSourceWetData = {"HeatSourceWet": {[heatPumpName]: defaultHeatSourceWetDetails}};

	const fhsInput = merge.all([
		dwellingDetailsData,
		infiltrationVentilationData,
		dwellingFabricData,
		defaultHeatSourceWetData,
		heatingSystemsData,
		domesticHotWaterData,
		pvData,
		// coolingData,
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