import { objectEntries, objectFromEntries } from "ts-extras";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { asCubicMetresPerHour } from "~/utils/units/flowRate";
import type { SchemaInfiltrationVentilation, SchemaMechanicalVentilation, SchemaMechanicalVentilationDuctwork, SchemaVent, SchemaVentilationLeaks } from "~/schema/aliases";
import type { SchemaMechVentCommon } from "~/schema/api-schema.types";

export function mapInfiltrationVentilationData(state: ResolvedState): Partial<FhsInputSchema> {
	const { dwellingHeight, dwellingEnvelopeArea, baseHeightOfVentilationZone } = mapVentilationData(state);
	const mechanicalVentilation = mapMechanicalVentilationData(state);

	const infiltrationVentilation: Omit<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		Leaks: {
			ventilation_zone_height: dwellingHeight,
			env_area: dwellingEnvelopeArea,
			...mapAirPermeabilityData(state),
		},
		ventilation_zone_base_height: baseHeightOfVentilationZone,
		ach_max_static_calcs: 2, // suggested default
		MechanicalVentilation: objectFromEntries(objectEntries(mechanicalVentilation).map(([name, mechanicalVentData]) => {
			return [
				name,
				{
					...mechanicalVentData,
					...(mechanicalVentData.vent_type === "MVHR" ? { ductwork: mapMvhrDuctworkData(name, state) } : {}),
				},
			];
		})),
		Vents: mapVentsData(state),
	};

	return {
		InfiltrationVentilation: infiltrationVentilation,
	} as Pick<FhsInputSchema, "InfiltrationVentilation">;
}

export function mapMechanicalVentilationData(state: ResolvedState) {
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.map((x): [string, SchemaMechanicalVentilation] => {
		let airFlowRateInCubicMetresPerHour: number;

		if (typeof x.airFlowRate === "number") {
			airFlowRateInCubicMetresPerHour = x.airFlowRate;
		} else {
			airFlowRateInCubicMetresPerHour = asCubicMetresPerHour(x.airFlowRate);
		}

		const key = x.name;
		const commonFields = {
			design_outdoor_air_flow_rate: airFlowRateInCubicMetresPerHour,
			EnergySupply: defaultElectricityEnergySupplyName,
		} as const satisfies SchemaMechVentCommon;

		let val: SchemaMechanicalVentilation;

		const ventType = x.typeOfMechanicalVentilationOptions;

		switch (ventType) {
			case "MVHR":
				val = {
					vent_type: "MVHR",
					...commonFields,
					mvhr_location: x.mvhrLocation,
					mvhr_eff: x.mvhrEfficiency,
					ductwork: [],
					measured_air_flow_rate: 37,
					measured_fan_power: 12.26,
					position_exhaust: {
						mid_height_air_flow_path: x.midHeightOfAirFlowPathForExhaust,
						orientation360: x.orientationOfExhaust,
						pitch: x.pitchOfExhaust,
					},
					position_intake: {
						mid_height_air_flow_path: x.midHeightOfAirFlowPathForIntake,
						orientation360: x.orientationOfIntake,
						pitch: x.pitchOfIntake,
					},
				} as const satisfies SchemaMechanicalVentilation;
				break;
			case "Centralised continuous MEV":
				val = {
					vent_type: "Centralised continuous MEV",
					...commonFields,
					measured_air_flow_rate: 37,
					measured_fan_power: 12.26,
					position_exhaust: {
						mid_height_air_flow_path: 2, // TODO: replace with real value
						pitch: 90, // TODO: replace with real value
						orientation360: 90, // TODO: replace with real value
					},
				} as const satisfies SchemaMechanicalVentilation;
				break;
			case "Intermittent MEV":
				val = {
					vent_type: "Intermittent MEV",
					...commonFields,
					SFP: 1.5,
					position_exhaust: {
						mid_height_air_flow_path: 2, // TODO: replace with real value
						pitch: 90, // TODO: replace with real value
						orientation360: 90, // TODO: replace with real value
					},
				} as const satisfies SchemaMechanicalVentilation;
				break;
			case "Decentralised continuous MEV":
				val = {
					vent_type: "Decentralised continuous MEV",
					...commonFields,
					SFP: 1.5,
					position_exhaust: {
						mid_height_air_flow_path: 2, // TODO: replace with real value
						pitch: 90, // TODO: replace with real value
						orientation360: 90, // TODO: replace with real value
					},
				} as const satisfies SchemaMechanicalVentilation;
				break;
			default:
				ventType satisfies never;
				throw new Error(`Encountered unexpected vent type: '${ventType}'`);
		}

		return [key, val];
	});
	return objectFromEntries(entries);
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
			internal_diameter_mm: x.internalDiameterOfDuctwork,
			external_diameter_mm: x.externalDiameterOfDuctwork,
			length: x.lengthOfDuctwork,
			reflective: x.surfaceReflectivity,
		};
		return val;
	});
}

export function mapVentsData(state: ResolvedState) {
	const { dwellingSpaceWindows } = state.dwellingFabric;
	const { dwellingSpaceExternalWall } = state.dwellingFabric.dwellingSpaceWalls;

	const entries = state.infiltrationAndVentilation.vents.map((x): [string, SchemaVent] => {
		const key = x.name;

		const taggedItem = x.associatedItemId && x.associatedItemId !== "none" ? getResolvedTaggedItem(
			[dwellingSpaceWindows, dwellingSpaceExternalWall],
			x.associatedItemId,
		) : null;

		const ventOrientation = x.hasAssociatedItem ? taggedItem?.orientation : x.orientation;
		const pitchForm = x.hasAssociatedItem ? taggedItem : x;

		const val: SchemaVent = {
			area_cm2: x.effectiveVentilationArea,
			mid_height_air_flow_path: x.midHeightOfZone,
			orientation360: ventOrientation!,
			pitch: extractPitch(pitchForm!),
		};

		return [key, val];
	});

	return objectFromEntries(entries);
}

export function mapVentilationData(state: ResolvedState): { baseHeightOfVentilationZone: number; dwellingHeight: number; dwellingEnvelopeArea: number; } {
	const { baseHeightOfVentilationZone, ventilationZoneHeight: dwellingHeight, dwellingEnvelopeArea } = state.infiltrationAndVentilation.naturalVentilation;

	return {
		baseHeightOfVentilationZone,
		dwellingHeight,
		dwellingEnvelopeArea,
	};
}

export function mapAirPermeabilityData(state: ResolvedState): Pick<SchemaVentilationLeaks, "test_pressure" | "test_result"> {
	const { testPressure, airTightnessTestResult } = state.infiltrationAndVentilation.airPermeability;

	return {
		test_pressure: testPressure,
		test_result: airTightnessTestResult,
	};
}