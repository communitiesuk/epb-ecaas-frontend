import { ColdWaterSourceType, type SchemaBathDetails, type SchemaShower } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";

export function mapDomesticHotWaterData(state: EcaasState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);
	const baths = mapBathsData(state);

	return {
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
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