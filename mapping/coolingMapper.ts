import { SpaceCoolSystemType, type SchemaSpaceCoolSystemDetails } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";


export function mapCoolingData(state: EcaasState): Partial<FhsInputSchema> {
	const spaceCoolSystems = mapSpaceCoolSystems(state);
    
	return { 
		SpaceCoolSystem: spaceCoolSystems
	};
}

function mapSpaceCoolSystems(state: EcaasState) {
	const spaceCoolSystems = state.cooling.airConditioning.data.map((x):[string, SchemaSpaceCoolSystemDetails] => {
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

