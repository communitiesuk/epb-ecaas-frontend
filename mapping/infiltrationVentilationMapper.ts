import { objectEntries, objectFromEntries } from 'ts-extras';
import { type CombustionApplianceType, type SchemaCombustionAppliance, type SchemaInfiltrationVentilation, type SchemaMechanicalVentilation, type SchemaVent, SupplyAirTemperatureControlType } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";

export function mapInfiltrationVentilationData(state: EcaasState): Partial<FhsInputSchema> {
	const infiltrationVentilation = mapMechanicalVentilationData(state);

	return {
		...infiltrationVentilation
	};
}

function mapMechanicalVentilationData(state: EcaasState): Pick<FhsInputSchema, 'InfiltrationVentilation'> {
	const infiltrationVentilationData = state.infiltrationAndVentilation.ventilation.data;
	const airPermeabilityData = state.infiltrationAndVentilation.airPermeability.data;
	const combustionApplianceEntries = objectEntries(state.infiltrationAndVentilation.combustionAppliances).filter(([_key, value]) => value.complete && !isEmpty(value.data)).map(([key, value]) => {
		return value.data.flatMap<[string, SchemaCombustionAppliance]>((appliance) => {
			const { name, airSupplyToAppliance, exhaustMethodFromAppliance, typeOfFuel } = appliance;
			const applianceInput: SchemaCombustionAppliance = {
				appliance_type: key as CombustionApplianceType,
				exhaust_situation: exhaustMethodFromAppliance,
				fuel_type: typeOfFuel,
				supply_situation: airSupplyToAppliance,
			};
			return [[name, applianceInput]];
		});
	}).flat();
	const combustionAppliances: Record<string, SchemaCombustionAppliance> = objectFromEntries(combustionApplianceEntries);

	const infiltrationVentiliation: Omit<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		Cowls: {},
		PDUs: {},
		Leaks: {
			ventilation_zone_height: infiltrationVentilationData.dwellingHeight!,
			env_area: infiltrationVentilationData.dwellingEnvelopeArea!,
			test_pressure: airPermeabilityData.testPressure!,
			test_result: airPermeabilityData.airTightnessTestResult!
		},
		CombustionAppliances: combustionAppliances,
		cross_vent_factor: infiltrationVentilationData.crossVentFactor!,
		ventilation_zone_base_height: infiltrationVentilationData.dwellingElevationalLevelAtBase!,
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