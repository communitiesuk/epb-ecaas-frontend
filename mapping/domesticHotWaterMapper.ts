import {
	ColdWaterSourceType,
	type SchemaBathDetails,
	type SchemaOtherWaterUseDetails,
	type SchemaShower,
	type SchemaWaterPipeworkSimple
} from "~/schema/api-schema.types";
import type {FhsInputSchema} from "./fhsInputMapper";

export function mapDomesticHotWaterData(state: EcaasState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);
	const distribution = mapDistributionData(state);

	return {
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
			Distribution: distribution
		}
	};
}

export function mapShowersData(state: EcaasState) {
	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.mixedShower.data.map((x):[string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
			type: "MixerShower",
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWater.hotWaterOutlets.electricShower.data.map((x):[string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
			type: "InstantElecShower",
			ColdWaterSource: ColdWaterSourceType.mains_water,
			rated_power: x.ratedPower,
			EnergySupply: "mains elec"
		};

		return [key, val];
	});

	return Object.fromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

export function mapBathsData(state: EcaasState) {
	const bathEntries = state.domesticHotWater.hotWaterOutlets.bath.data.map((x):[string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
			size: x.size
		};

		return [key, val];
	});

	return Object.fromEntries(bathEntries);
}

export function mapOthersData(state: EcaasState) {
	const otherEntries = state.domesticHotWater.hotWaterOutlets.otherOutlets.data.map((x):[string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return Object.fromEntries(otherEntries);
}

export function mapDistributionData(state: EcaasState) {
	return state.domesticHotWater.pipework.secondaryPipework.data.map((x): SchemaWaterPipeworkSimple => {
		return {
			length: x.length,
			location: x.location,
			internal_diameter_mm: x.internalDiameter
		};
	});
}