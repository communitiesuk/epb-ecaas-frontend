import { SpaceCoolSystemType  } from "~/schema/api-schema.types";
import type {SchemaSpaceCoolSystemDetails} from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";


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
			EnergySupply: "mains elec",
			cooling_capacity: x.coolingCapacity,
			frac_convective: x.convectionFraction,
			efficiency: x.seasonalEnergyEfficiencyRatio,
			type: SpaceCoolSystemType.AirConditioning,
		};

		return [key, val];
	});

	return Object.fromEntries(spaceCoolSystems);
}

