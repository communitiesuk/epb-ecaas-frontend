
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { SchemaSpaceCoolSystemDetails } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapCoolingData(state: ResolvedState): Pick<FhsInputSchema, "SpaceCoolSystem"> {
	return {
		...mapSpaceCoolSystems(state),
	};
}

export function mapSpaceCoolSystems(state: ResolvedState): Pick<FhsInputSchema, "SpaceCoolSystem"> {
	const spaceCoolSystems = state.cooling.airConditioning.map((x): [string, SchemaSpaceCoolSystemDetails] => {
		const key = x.name;
		const val: SchemaSpaceCoolSystemDetails = {
			EnergySupply: defaultElectricityEnergySupplyName,
			cooling_capacity: x.coolingCapacity,
			frac_convective: x.convectionFraction,
			efficiency: x.seasonalEnergyEfficiencyRatio,
			type: "AirConditioning",
		};

		return [key, val];
	});

	return {
		SpaceCoolSystem: Object.fromEntries(spaceCoolSystems),
	};
}