import type { StripDefs } from "./mapping.types";
import type { SchemaEnergySupplyElectricity, SchemaFhsInputSchema, SchemaStorageTank } from "~/schema/api-schema.types";
import type { SchemaHeatSourceWetHeatPumpWithProductReference, SchemaSimulationTime } from "~/schema/aliases";
import { mapDwellingDetailsData } from "./dwellingDetailsMapper";
import merge from "deepmerge";
import { mapInfiltrationVentilationData } from "./infiltrationVentilationMapper";
import { mapHeatingAndCoolingSystemsData } from "./heatingAndCoolingSystemsMapper";
import { mapLivingSpaceFabricData as mapDwellingFabricData } from "./dwellingFabricMapper";
import { mapPvAndElectricBatteriesData } from "./pvAndElectricBatteriesMapper";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import { defaultElectricityEnergySupplyName, defaultHeatSourceWetDetails } from "~/mapping/common";
import { objectFromEntries } from "ts-extras";
import type { Simplify, SimplifyDeep } from "type-fest";

export type ResolvedState = SimplifyDeep<Resolved<EcaasState>>;

export function mapFhsInputData(state: Resolved<EcaasState>): FhsInputSchema {
	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const dwellingFabricData = mapDwellingFabricData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);

	const [pvData, electricBatteries, diverter] = mapPvAndElectricBatteriesData(state);
	const heatingCooling = mapHeatingAndCoolingSystemsData(state);
	const fuelType = dwellingDetailsData.EnergySupply;

	// specify the electricity tariff with other needed data points with default values as used in example FHS files in case it is needed (TODO: should it be necessary to pass in a tariff here?)
	const defaultTariffData: Pick<SchemaEnergySupplyElectricity, "threshold_charges" | "threshold_prices" | "tariff"> = {
		threshold_charges: [0.8, 0.8, 0.7, 0.4, 0.0, 0.0, 0.0, 0.2, 0.5, 0.7, 0.8, 0.8],
		threshold_prices: [20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0],
		tariff: "Variable Time of Day Tariff",
	};
	const heatingAndCoolingSystemsData = {
		...heatingCooling,
		EnergySupply: {
			[defaultElectricityEnergySupplyName]: {
				...(fuelType && fuelType[defaultElectricityEnergySupplyName]),
				...electricBatteries,
				...diverter,
				...(Object.values(electricBatteries).length > 0 ? defaultTariffData : {}),
			},
		},
	};

	const control: Pick<FhsInputSchema, "Control"> = { Control: {} };
	const events: Pick<FhsInputSchema, "Events"> = { Events: {} };

	const defaultColdWaterSource: Pick<FhsInputSchema, "ColdWaterSource"> = {
		ColdWaterSource: {
			"mains water": {
				start_day: 0,
				temperatures: [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
				time_series_step: 1,
			},
		},
	};
	const defaultSimulationTime: Pick<FhsInputSchema, "SimulationTime"> = {
		SimulationTime: {
			start: 0,
			end: 8,
			step: 1,
		},
	};
	const defaultAppliances: Pick<FhsInputSchema, "Appliances"> = {
		Appliances: {},
	}; 
	// Below uses default values until heat pump is set up to come from PCDB
	const { HotWaterSource } = domesticHotWaterData;
	const heatPumpName: string = Object.keys((HotWaterSource!["hw cylinder"] as SchemaStorageTank).HeatSource)[0]!;
	const heatPumps = state.heatingAndCoolingSystems.heatGeneration.heatPump;

	// use the picked heat pump if one is picked, otherwise fall back to the default
	// TODO: correct this at point other heat sources are being added
	const heatSourceWetData: Pick<FhsInputSchema, "HeatSourceWet"> = {
		"HeatSourceWet": heatPumps.length === 0 ? {
			[heatPumpName]: defaultHeatSourceWetDetails,
		} : objectFromEntries(heatPumps.map(heatPump => {
			const heatPumpWithProductReference: SchemaHeatSourceWetHeatPumpWithProductReference = {
				product_reference: heatPump.productReference,
				type: "HeatPump",
				EnergySupply: defaultElectricityEnergySupplyName,
			};
			return [
				heatPump.name,
				heatPumpWithProductReference,
			] as const;
		})),
	};

	const fhsInput = merge.all([
		defaultAppliances,
		dwellingDetailsData,
		infiltrationVentilationData,
		dwellingFabricData,
		heatSourceWetData,
		heatingAndCoolingSystemsData,
		domesticHotWaterData,
		pvData,
		defaultColdWaterSource,
		control,
		events,
		defaultSimulationTime,
	]) as FhsInputSchema;

	console.log(fhsInput);

	return fhsInput;
}

// override the SimulationTime field for now as this is incompletely defined in the schema (NB. it will be removed in a coming version)
export type FhsInputSchema = Simplify<Omit<StripDefs<SchemaFhsInputSchema>, "SimulationTime"> & { SimulationTime: SchemaSimulationTime }>;