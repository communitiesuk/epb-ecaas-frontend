import type { SchemaBathDetails, SchemaOtherWaterUseDetails } from "~/schema/aliases";
import type { SchemaInstantElecShower, SchemaMixerShower } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";


export function mapDomesticHotWaterData(state: ResolvedState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);

	return {
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
		},
	};
}

function mapShowersData(state: ResolvedState) {
	const mixedShowerEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "mixedShower").map((x): [string, SchemaMixerShower] => {
		const key = x.name;
		const WWHRS_configuration = {
			instantaneousSystemA: "A",
			instantaneousSystemB: "B",
			instantaneousSystemC: "C",
		} as const;
		const val: SchemaMixerShower = {
			type: "MixerShower",
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
			HotWaterSource: x.hotWaterSource,
		};
		if (x.wwhrs) {
			val.WWHRS = x.wwhrsProductReference;
			val.WWHRS_configuration = WWHRS_configuration[x.wwhrsType];
		}



		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "electricShower").map((x): [string, SchemaInstantElecShower] => {
		const key = x.name;
		const val: SchemaInstantElecShower = {
			type: "InstantElecShower",
			ColdWaterSource: "mains water",
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};


		return [key, val];
	});

	return Object.fromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "bath").map((x): [string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: "mains water",
			size: x.size,
		};

		return [key, val];
	});

	return Object.fromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "otherHotWaterOutlet").map((x): [string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return Object.fromEntries(otherEntries);
}
