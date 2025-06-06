import { ColdWaterSourceType, type SchemaShower } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";

export function mapDomesticHotWaterData(state: EcaasState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);

	return {
		HotWaterDemand: {
			Shower: showers
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