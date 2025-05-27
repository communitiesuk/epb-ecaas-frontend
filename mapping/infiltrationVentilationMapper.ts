import { objectEntries, objectFromEntries } from 'ts-extras';
import { type CombustionApplianceType, DuctShape, type SchemaCombustionAppliance, type SchemaInfiltrationVentilation, type SchemaMechanicalVentilation, type SchemaMechanicalVentilationDuctwork, type SchemaVent, type SchemaVentilationLeaks, SupplyAirTemperatureControlType, VentType } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";

export function mapInfiltrationVentilationData(state: ResolvedState): Partial<FhsInputSchema> {
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
					...(mechanicalVentData.vent_type === VentType.MVHR ? {ductwork: mapMvhrDuctworkData(name, state)} : {})
				}
			];
		})),
		Vents: mapVentsData(state)
	};

	return {
		InfiltrationVentilation: infiltrationVentiliation
	} as Pick<FhsInputSchema, 'InfiltrationVentilation'>;
}

export function mapMechanicalVentilationData(state: ResolvedState) {
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.map((x):[string, SchemaMechanicalVentilation] => {
		const key = x.name;
		const val: Omit<SchemaMechanicalVentilation, 'ductwork'> = {
			vent_type: x.typeOfMechanicalVentilationOptions,
			EnergySupply: "mains elec",
			design_outdoor_air_flow_rate: x.airFlowRate,
			sup_air_flw_ctrl: x.controlForSupplyAirflow,
			sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
			...(x.typeOfMechanicalVentilationOptions === VentType.MVHR ? {mvhr_location: x.mvhrLocation, mvhr_eff: x.mvhrEfficiency} : {}),
			measured_air_flow_rate: 37,
			measured_fan_power: 12.26,
		};

		return [key, val];
	});
	return Object.fromEntries(entries);
}

function mapMvhrDuctworkData(mechanicalVentilationName: string, state: ResolvedState): SchemaMechanicalVentilationDuctwork[] {
	const mvhrductworks = state.infiltrationAndVentilation.ductwork?.filter(hasMechanicalVentilation) ?? [];

	function hasMechanicalVentilation(ductwork: DuctworkData) {
		return mechanicalVentilationName === ductwork.mvhrUnit;
	}

	return mvhrductworks.map((x) => {
		const val: SchemaMechanicalVentilationDuctwork = {
			cross_section_shape: x.ductworkCrossSectionalShape,
			duct_type: x.ductType,
			insulation_thermal_conductivity: x.thermalInsulationConductivityOfDuctwork,
			insulation_thickness_mm: x.insulationThickness,
			...(x.ductworkCrossSectionalShape === DuctShape.circular ? {internal_diameter_mm: x.internalDiameterOfDuctwork, external_diameter_mm: x.externalDiameterOfDuctwork} : {}),
			...(x.ductworkCrossSectionalShape === DuctShape.rectangular ? {duct_perimeter_mm: x.ductPerimeter} : {}),
			length: x.lengthOfDuctwork,
			reflective: x.surfaceReflectivity
		};
		return val;
	});
}

export function mapVentsData(state: ResolvedState) {
	const entries = state.infiltrationAndVentilation.vents.map((x): [string, SchemaVent] => {
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

export function mapVentilationData(state: ResolvedState): { dwellingElevationalLevelAtBase: number; dwellingHeight: number; dwellingEnvelopeArea: number; crossVentFactor: boolean; } {
	const { dwellingElevationalLevelAtBase, dwellingHeight, dwellingEnvelopeArea, crossVentFactor } = state.infiltrationAndVentilation.ventilation;

	return {
		dwellingElevationalLevelAtBase,
		dwellingHeight,
		dwellingEnvelopeArea,
		crossVentFactor
	};
}

export function mapAirPermeabilityData(state: ResolvedState): Pick<SchemaVentilationLeaks, 'test_pressure' | 'test_result'> {
	const { testPressure, airTightnessTestResult } = state.infiltrationAndVentilation.airPermeability;

	return {
		test_pressure: testPressure,
		test_result: airTightnessTestResult
	};
}

export function mapCombustionAppliancesData(state: ResolvedState): Record<string, SchemaCombustionAppliance> {
	const combustionApplianceEntries = objectEntries(state.infiltrationAndVentilation.combustionAppliances).map(([key, value]) => {
		return value.map<[string, SchemaCombustionAppliance]>((appliance) => {
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