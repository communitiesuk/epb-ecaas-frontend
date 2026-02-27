import type { StripDefs } from "./mapping.types";
import type { SchemaFhsInputSchema } from "~/schema/api-schema.types";
import type { SchemaHeatSourceWetHeatPumpWithProductReference, SchemaStorageTank } from "~/schema/aliases";
import { mapDwellingDetailsData } from "./dwellingDetailsMapper";
import merge from "deepmerge";
import { mapInfiltrationVentilationData } from "./infiltrationVentilationMapper";
import { mapLivingSpaceFabricData as mapDwellingFabricData } from "./dwellingFabricMapper";
import { mapPvAndElectricBatteriesData } from "./pvAndElectricBatteriesMapper";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import { defaultElectricityEnergySupplyName, defaultHeatSourceWetDetails } from "~/mapping/common";
import { objectFromEntries } from "ts-extras";
import type { Simplify, SimplifyDeep } from "type-fest";
import { mapCoolingData } from "./coolingMapper";
import { mapSpaceHeatSystem } from "./spaceHeatingMapper";

export type ResolvedState = SimplifyDeep<Resolved<EcaasState>>;

export function mapFhsInputData(state: Resolved<EcaasState>): FhsInputSchema {
	const dwellingDetailsData = mapDwellingDetailsData(state);
	const infiltrationVentilationData = mapInfiltrationVentilationData(state);
	const dwellingFabricData = mapDwellingFabricData(state);
	const domesticHotWaterData = mapDomesticHotWaterData(state);
	const coolingData = mapCoolingData(state);
	const spaceHeatingSystemData = mapSpaceHeatSystem(state);

	const [pvData, electricBatteries, diverter, pvArrayEnergySupply] = mapPvAndElectricBatteriesData(state);

	const fuelType = dwellingDetailsData.EnergySupply;

	const spaceHeatingData = {
		...spaceHeatingSystemData,
		...coolingData,
		EnergySupply: {
			[defaultElectricityEnergySupplyName]: {
				...(fuelType && fuelType[defaultElectricityEnergySupplyName]),
				...electricBatteries,
				...diverter,
			},
			...pvArrayEnergySupply,
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
	const heatPumps = state.spaceHeating.heatSource.filter(hs => hs.typeOfHeatSource === "heatPump");

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