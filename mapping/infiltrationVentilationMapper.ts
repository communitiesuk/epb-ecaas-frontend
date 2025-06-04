import { objectEntries, objectFromEntries, isEmpty } from 'ts-extras';
import { type CombustionApplianceType, DuctShape, type SchemaCombustionAppliance, type SchemaInfiltrationVentilation, type SchemaMechanicalVentilation, type SchemaMechanicalVentilationDuctwork, type SchemaVent, type SchemaVentilationLeaks, SupplyAirTemperatureControlType, VentType } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";

export function mapInfiltrationVentilationData(state: EcaasState): Partial<FhsInputSchema> {
	const { dwellingHeight, dwellingEnvelopeArea, dwellingElevationalLevelAtBase, crossVentFactor } = mapVentilationData(state);
	const mechanicalVentilation = mapMechanicalVentilationData(state);

	const infiltrationVentiliation: Omit<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		Cowls: {},
		PDUs: {},
		Leaks: {
			ventilation_zone_height: dwellingHeight,
			env_area: dwellingEnvelopeArea,
			...mapAirPermeabilityData(state),
		},
		CombustionAppliances: mapCombustionAppliancesData(state),
		cross_vent_factor: crossVentFactor,
		ventilation_zone_base_height: dwellingElevationalLevelAtBase,
		ach_max_static_calcs: 2, // suggested default
		vent_opening_ratio_init: 1, // 1 is open
		MechanicalVentilation: objectFromEntries(objectEntries(mechanicalVentilation).map(([name, mechanicalVentData]) => {
			return [
				name,
				{
					...mechanicalVentData,
					ductwork: mechanicalVentData.vent_type === VentType.MVHR ? mapMvhrDuctworkData(name, state) : undefined
				}
			];
		})),
		Vents: mapVentsData(state)
	};

	return {
		InfiltrationVentilation: infiltrationVentiliation
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}

function mapMechanicalVentilationData(state: EcaasState) {
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.data.map((x):[string, SchemaMechanicalVentilation] => {
		const key = x.name;
		const val: Omit<SchemaMechanicalVentilation, 'ductwork'> = {
			vent_type: x.typeOfMechanicalVentilationOptions,
			EnergySupply: "mains elec",
			design_outdoor_air_flow_rate: x.airFlowRate,
			sup_air_flw_ctrl: x.controlForSupplyAirflow,
			sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
			mvhr_location: x.typeOfMechanicalVentilationOptions === VentType.MVHR ? x.mvhrLocation : undefined,
			mvhr_eff: x.typeOfMechanicalVentilationOptions === VentType.MVHR ? x.mvhrEfficiency : undefined,
			measured_air_flow_rate: 37,
			measured_fan_power: 12.26,
		};

		return [key, val];
	});
	return Object.fromEntries(entries);
}

function mapMvhrDuctworkData(mechanicalVentilationName: string, state: EcaasState): SchemaMechanicalVentilationDuctwork[] {
	const mvhrductworks = state.infiltrationAndVentilation.ductwork?.data.filter(hasMechanicalVentilation);

	function hasMechanicalVentilation(ductwork: DuctworkData) {
		return mechanicalVentilationName === ductwork.mvhrUnit;
	}

	return mvhrductworks.map((x) => {
		const val: SchemaMechanicalVentilationDuctwork = {
			cross_section_shape: x.ductworkCrossSectionalShape,
			duct_type: x.ductType,
			insulation_thermal_conductivity: x.thermalInsulationConductivityOfDuctwork,
			insulation_thickness_mm: x.insulationThickness,
			internal_diameter_mm:  x.ductworkCrossSectionalShape === DuctShape.circular ? x.internalDiameterOfDuctwork : undefined,
			external_diameter_mm: x.ductworkCrossSectionalShape === DuctShape.circular ? x.externalDiameterOfDuctwork : undefined,
			duct_perimeter_mm: x.ductworkCrossSectionalShape === DuctShape.rectangular ? x.ductPerimeter : undefined,
			length: x.lengthOfDuctwork,
			reflective: x.surfaceReflectivity
		};
		return val;
	});
}

function mapVentsData(state: EcaasState) {
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

	return objectFromEntries(entries);
}

function mapVentilationData(state: EcaasState): { dwellingElevationalLevelAtBase: number; dwellingHeight: number; dwellingEnvelopeArea: number; crossVentFactor: boolean; } {
	const { dwellingElevationalLevelAtBase, dwellingHeight, dwellingEnvelopeArea, crossVentFactor } = state.infiltrationAndVentilation.ventilation.data;

	return {
		dwellingElevationalLevelAtBase,
		dwellingHeight,
		dwellingEnvelopeArea,
		crossVentFactor
	};
}

function mapAirPermeabilityData(state: EcaasState): Pick<SchemaVentilationLeaks, 'test_pressure' | 'test_result'> {
	const { testPressure, airTightnessTestResult } = state.infiltrationAndVentilation.airPermeability.data;

	return {
		test_pressure: testPressure,
		test_result: airTightnessTestResult
	};
}

function mapCombustionAppliancesData(state: EcaasState): Record<string, SchemaCombustionAppliance> {
	const combustionApplianceEntries = objectEntries(state.infiltrationAndVentilation.combustionAppliances).filter(([_key, value]) => value.complete && !isEmpty(value.data)).map(([key, value]) => {
		return value.data.map<[string, SchemaCombustionAppliance]>((appliance) => {
			const { name, airSupplyToAppliance, exhaustMethodFromAppliance, typeOfFuel } = appliance;
			const applianceInput: SchemaCombustionAppliance = {
				appliance_type: key as CombustionApplianceType,
				exhaust_situation: exhaustMethodFromAppliance,
				fuel_type: typeOfFuel,
				supply_situation: airSupplyToAppliance,
			};
			return [name, applianceInput];
		});
	}).flat();
	return objectFromEntries(combustionApplianceEntries);
}