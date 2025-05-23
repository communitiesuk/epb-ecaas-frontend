import { type SchemaInfiltrationVentilation, type SchemaMechanicalVentilation, type SchemaVent, SupplyAirTemperatureControlType } from "~/schema/api-schema.types";

import type { FhsInputSchema } from "./fhsInputMapper";

export function mapInfiltrationVentilationData(state: EcaasState): Partial<FhsInputSchema> {
	const infiltrationVentilation = mapMechanicalVentilationData(state);

	return {
		...infiltrationVentilation
	};
}

function mapMechanicalVentilationData(state: EcaasState): Pick<FhsInputSchema, 'InfiltrationVentilation'> {
	// some fields are set in dwelling details
	// Cowls, PDUs
	const infiltrationVentiliation: Omit<SchemaInfiltrationVentilation, 'altitude' | 'shield_class' | 'terrain_class' > = {
		Cowls: {},
		PDUs: {},
		Leaks: {
			ventilation_zone_height: state.infiltrationAndVentilation.ventilation.data.dwellingHeight!,
			env_area: state.infiltrationAndVentilation.ventilation.data.dwellingEnvelopeArea!,
			test_pressure: state.infiltrationAndVentilation.airPermeability.data.testPressure!,
			test_result: state.infiltrationAndVentilation.airPermeability.data.airTightnessTestResult!
		},
		CombustionAppliances: {
			// TODO map this from state
		},
		cross_vent_factor: state.infiltrationAndVentilation.ventilation.data.crossVentFactor!,
		ventilation_zone_base_height: state.infiltrationAndVentilation.ventilation.data.dwellingElevationalLevelAtBase!,
		ach_max_static_calcs: 2, // suggested default
		vent_opening_ratio_init: 1, // 1 is open
		MechanicalVentilation: mapMechanicalVentilation(state),
		Vents: mapVents(state)
	};

	return {
		InfiltrationVentilation: infiltrationVentiliation
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}

function mapVents(state: EcaasState) {
	const entries = state.infiltrationAndVentilation.vents.data.map((x): [string, SchemaVent] => {
		const key = x.name;
		const val: SchemaVent = {
			area_cm2: x.effectiveVentilationArea,
			mid_height_air_flow_path: x.midHeightOfZone,
			orientation360: x.orientation,
			pitch: x.pitch,
			pressure_difference_ref: x.pressureDifference ?? 20 // default if not defined
		};

		return [key, val];
	});

	return Object.fromEntries(entries);
}

function mapMechanicalVentilation(state: EcaasState) {
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.data.map((x):[string, SchemaMechanicalVentilation] => {
		const key = x.name;
		const val: SchemaMechanicalVentilation = {
			vent_type: x.typeOfMechanicalVentilationOptions,
			EnergySupply: "mains elec", // TODO validate this is correct
			design_outdoor_air_flow_rate: x.airFlowRate,
			sup_air_flw_ctrl: x.controlForSupplyAirflow,
			sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST
		};

		return [key, val];
	});
	return Object.fromEntries(entries);
}