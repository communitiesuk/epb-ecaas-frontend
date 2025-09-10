import type { SchemaSpaceCoolSystemDetails } from "~/schema/aliases";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapCoolingData(state: ResolvedState): Partial<FhsInputSchema> {
	const spaceCoolSystems = mapSpaceCoolSystems(state);
    
	return { 
		SpaceCoolSystem: spaceCoolSystems
	};
}

export function mapSpaceCoolSystems(state: ResolvedState) {
	const spaceCoolSystems = state.cooling.airConditioning.map((x):[string, SchemaSpaceCoolSystemDetails] => {
		const key = x.name;
		const val: SchemaSpaceCoolSystemDetails = {
			Control: "cooling", // token control name, but this may need to refer to a defined control
			EnergySupply: defaultElectricityEnergySupplyName,
			cooling_capacity: x.coolingCapacity,
			frac_convective: x.convectionFraction,
			efficiency: x.seasonalEnergyEfficiencyRatio,
			temp_setback: null,
			advanced_start: null,
			type: "AirConditioning",
		};

		return [key, val];
	});

	return Object.fromEntries(spaceCoolSystems);
}

