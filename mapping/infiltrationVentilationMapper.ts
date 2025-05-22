import type { SchemaMechanicalVentilation, SupplyAirTemperatureControlType } from "~/schema/api-schema.types";

import type { FhsInputSchema } from "./fhsInputMapper";

export function mapInfiltrationVentilationData(state: EcaasState): Partial<FhsInputSchema> {
	const infiltrationVentilation = mapMechanicalVentilationData(state);

	return {
		...infiltrationVentilation
	};
}

function mapMechanicalVentilationData(state: EcaasState): Pick<FhsInputSchema, 'InfiltrationVentilation'> {

	const mechnicalVentilationEntries = state.infiltrationAndVentilation.mechanicalVentilation.data.map(x => {
		const key = x.name;
		const val: SchemaMechanicalVentilation = {
			vent_type: x.typeOfMechanicalVentilationOptions,
			EnergySupply: "mains elec", // TODO validate this is correct
			design_outdoor_air_flow_rate: x.airFlowRate,
			sup_air_flw_ctrl: x.controlForSupplyAirflow,
			sup_air_temp_ctrl: x.supplyAirTemperatureControl as SupplyAirTemperatureControlType
		};

		return [key, val];
	});

	return {
		InfiltrationVentilation: {
			MechanicalVentilation: Object.fromEntries(mechnicalVentilationEntries)
		}
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}
