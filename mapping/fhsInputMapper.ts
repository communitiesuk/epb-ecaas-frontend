import type { StripDefs } from "./mapping.types";
import type { SchemaEnergySupplyElectricity, SchemaFhsInputSchema, SchemaStorageTank } from "~/schema/api-schema.types";
import type { SchemaHeatSourceWetHeatPumpWithProductReference } from "~/schema/aliases";
import { mapDwellingDetailsData } from "./dwellingDetailsMapper";
import merge from "deepmerge";
import { mapInfiltrationVentilationData } from "./infiltrationVentilationMapper";
import { mapspaceHeatingData } from "./spaceHeatingMapper";
import { mapLivingSpaceFabricData as mapDwellingFabricData } from "./dwellingFabricMapper";
import { mapPvAndElectricBatteriesData } from "./pvAndElectricBatteriesMapper";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import { defaultElectricityEnergySupplyName, defaultHeatSourceWetDetails } from "~/mapping/common";
import { objectFromEntries } from "ts-extras";
import type { Simplify, SimplifyDeep } from "type-fest";
import { mapCoolingData } from "./coolingMapper";

export type ResolvedState = SimplifyDeep<Resolved<EcaasState>>;

export function mapFhsInputData(state: Resolved<EcaasState>): FhsInputSchema {
	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const dwellingFabricData = mapDwellingFabricData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);
	const coolingData = mapCoolingData(state);

	const [pvData, electricBatteries, diverter] = mapPvAndElectricBatteriesData(state);
	const heatingCooling = mapspaceHeatingData(state);
	const fuelType = dwellingDetailsData.EnergySupply;

	// specify the electricity tariff with other needed data points with default values as used in example FHS files in case it is needed (TODO: should it be necessary to pass in a tariff here?)
	const defaultTariffData: Pick<SchemaEnergySupplyElectricity, "threshold_charges" | "threshold_prices" | "tariff"> = {
		threshold_charges: [0.8, 0.8, 0.7, 0.4, 0.0, 0.0, 0.0, 0.2, 0.5, 0.7, 0.8, 0.8],
		threshold_prices: [20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0],
		tariff: "Variable Time of Day Tariff",
	};
	const spaceHeatingData = {
		...heatingCooling,
		...coolingData,
		EnergySupply: {
			[defaultElectricityEnergySupplyName]: {
				...(fuelType && fuelType[defaultElectricityEnergySupplyName]),
				...electricBatteries,
				...diverter,
				...(Object.values(electricBatteries).length > 0 ? defaultTariffData : {}),
			},
		},
	};

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
	const defaultAppliances: Pick<FhsInputSchema, "Appliances"> = {
		Appliances: {},
	};
	// Below uses default values until heat pump is set up to come from PCDB
	const { HotWaterSource } = domesticHotWaterData;
	const heatPumpName: string = Object.keys((HotWaterSource!["hw cylinder"] as SchemaStorageTank).HeatSource)[0]!;
	const heatPumps = state.spaceHeating.heatGeneration.heatPump;

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
				is_heat_network: false,
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
		spaceHeatingData,
		domesticHotWaterData,
		pvData,
		defaultColdWaterSource,
		events,
	]) as FhsInputSchema;

	console.log(fhsInput);

	return fhsInput;
}

export type FhsInputSchema = Simplify<StripDefs<SchemaFhsInputSchema>>;