import { arrayIncludes, objectEntries, objectFromEntries } from "ts-extras";
import {  DuctShape,       SupplyAirFlowRateControlType, SupplyAirTemperatureControlType, VentType } from "~/schema/api-schema.types";
import type { CombustionApplianceType, SchemaCombustionAppliance, SchemaInfiltrationVentilation, SchemaMechanicalVentilation, SchemaMechanicalVentilationDuctwork, SchemaVent, SchemaVentilationLeaks } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { asCubicMetresPerHour } from "~/utils/units/flowRate";

export function mapInfiltrationVentilationData(state: ResolvedState): Partial<FhsInputSchema> {
	const { dwellingHeight, dwellingEnvelopeArea, dwellingElevationalLevelAtBase, crossVentilationPossible } = mapVentilationData(state);
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
		cross_vent_factor: crossVentilationPossible,
		ventilation_zone_base_height: dwellingElevationalLevelAtBase,
		ach_max_static_calcs: 2, // suggested default
		vent_opening_ratio_init: 1, // 1 is open
		MechanicalVentilation: objectFromEntries(objectEntries(mechanicalVentilation).map(([name, mechanicalVentData]) => {
			return [
				name,
				{
					...mechanicalVentData,
					...(mechanicalVentData.vent_type === VentType.MVHR ? { ductwork: mapMvhrDuctworkData(name, state) } : {}),
				},
			];
		})),
		Vents: mapVentsData(state),
	};

	return {
		InfiltrationVentilation: infiltrationVentiliation,
	} as Pick<FhsInputSchema, "InfiltrationVentilation">;
}

export function mapMechanicalVentilationData(state: ResolvedState) {
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.map((x):[string, SchemaMechanicalVentilation] => {
		let airFlowRateInCubicMetresPerHour: number;

		if (typeof x.data.airFlowRate === "number") {
			airFlowRateInCubicMetresPerHour = x.data.airFlowRate;
		} else {
			airFlowRateInCubicMetresPerHour = asCubicMetresPerHour(x.data.airFlowRate);
		}
		
		const key = x.data.name;
		const val: Omit<SchemaMechanicalVentilation, "ductwork"> = {
			vent_type: x.data.typeOfMechanicalVentilationOptions,
			EnergySupply: defaultElectricityEnergySupplyName,
			design_outdoor_air_flow_rate: airFlowRateInCubicMetresPerHour,
			sup_air_flw_ctrl: SupplyAirFlowRateControlType.ODA,
			sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
			...(x.data.typeOfMechanicalVentilationOptions === VentType.MVHR ? { mvhr_location: x.data.mvhrLocation, mvhr_eff: x.data.mvhrEfficiency } : {}),
			measured_air_flow_rate: 37,
			measured_fan_power: 12.26,
			// (TODO: REMOVE COMMENT WHEN USING HEM 0.37) more recent schema is more explicit about logic for SFP field, but following implements what is currently implicit logic: for following vent types, provide SFP (with a canned value), otherwise don't
			...(arrayIncludes([VentType.Decentralised_continuous_MEV, VentType.Intermittent_MEV], x.data.typeOfMechanicalVentilationOptions) ? { SFP: 1.5 } : {}),
		};

		return [key, val];
	});
	return Object.fromEntries(entries);
}

function mapMvhrDuctworkData(mechanicalVentilationName: string, state: ResolvedState): SchemaMechanicalVentilationDuctwork[] {
	const mvhrductworks = state.infiltrationAndVentilation.ductwork?.filter(hasMechanicalVentilation) ?? [];

	function hasMechanicalVentilation(ductwork: EcaasForm<DuctworkData>) {
		return mechanicalVentilationName === ductwork.data.mvhrUnit;
	}

	return mvhrductworks.map((x) => {
		const val: SchemaMechanicalVentilationDuctwork = {
			cross_section_shape: x.data.ductworkCrossSectionalShape,
			duct_type: x.data.ductType,
			insulation_thermal_conductivity: x.data.thermalInsulationConductivityOfDuctwork,
			insulation_thickness_mm: x.data.insulationThickness,
			...(x.data.ductworkCrossSectionalShape === DuctShape.circular ? { internal_diameter_mm: x.data.internalDiameterOfDuctwork, external_diameter_mm: x.data.externalDiameterOfDuctwork } : {}),
			...(x.data.ductworkCrossSectionalShape === DuctShape.rectangular ? { duct_perimeter_mm: x.data.ductPerimeter } : {}),
			length: x.data.lengthOfDuctwork,
			reflective: x.data.surfaceReflectivity,
		};
		return val;
	});
}

export function mapVentsData(state: ResolvedState) {
	const entries = state.infiltrationAndVentilation.vents.map((x): [string, SchemaVent] => {
		const key = x.data.name;
		const val: SchemaVent = {
			area_cm2: x.data.effectiveVentilationArea,
			mid_height_air_flow_path: x.data.midHeightOfZone,
			orientation360: x.data.orientation,
			pitch: x.data.pitch,
			pressure_difference_ref: 20, // stock value
		};

		return [key, val];
	});

	return objectFromEntries(entries);
}

export function mapVentilationData(state: ResolvedState): { dwellingElevationalLevelAtBase: number; dwellingHeight: number; dwellingEnvelopeArea: number; crossVentilationPossible: boolean; } {
	const { dwellingElevationalLevelAtBase, ventilationZoneHeight: dwellingHeight, dwellingEnvelopeArea, crossVentilationPossible } = state.infiltrationAndVentilation.naturalVentilation;

	return {
		dwellingElevationalLevelAtBase,
		dwellingHeight,
		dwellingEnvelopeArea,
		crossVentilationPossible,
	};
}

export function mapAirPermeabilityData(state: ResolvedState): Pick<SchemaVentilationLeaks, "test_pressure" | "test_result"> {
	const { testPressure, airTightnessTestResult } = state.infiltrationAndVentilation.airPermeability;

	return {
		test_pressure: testPressure,
		test_result: airTightnessTestResult,
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