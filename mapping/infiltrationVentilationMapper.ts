import { objectEntries, objectFromEntries } from "ts-extras";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { InfiltrationFieldsFromDwelling } from "./dwellingDetailsMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { asCubicMetresPerHour } from "~/utils/units/flowRate";
import type { SchemaInfiltrationVentilation, SchemaMechanicalVentilation, SchemaCombustionAppliance, SchemaMechanicalVentilationDuctwork, SchemaVent, SchemaVentilationLeaks } from "~/schema/aliases";
import type { SchemaMechVentCommon } from "~/schema/api-schema.types";

export function mapInfiltrationVentilationData(state: ResolvedState): Partial<FhsInputSchema> {
	const { dwellingHeight, dwellingEnvelopeArea, dwellingElevationalLevelAtBase, crossVentilationPossible } = mapVentilationData(state);
	const mechanicalVentilation = mapMechanicalVentilationData(state);

	const infiltrationVentilation: Omit<SchemaInfiltrationVentilation, InfiltrationFieldsFromDwelling> = {
		Leaks: {
			ventilation_zone_height: dwellingHeight,
			env_area: dwellingEnvelopeArea,
			...mapAirPermeabilityData(state),
		},
		CombustionAppliances: mapCombustionAppliancesData(state),
		cross_vent_possible: crossVentilationPossible,
		ventilation_zone_base_height: dwellingElevationalLevelAtBase,
		ach_max_static_calcs: 2, // suggested default
		vent_opening_ratio_init: 1, // 1 is open
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
	const entries = state.infiltrationAndVentilation.mechanicalVentilation.map((x):[string, SchemaMechanicalVentilation] => {
		let airFlowRateInCubicMetresPerHour: number;

		if (typeof x.airFlowRate === "number") {
			airFlowRateInCubicMetresPerHour = x.airFlowRate;
		} else {
			airFlowRateInCubicMetresPerHour = asCubicMetresPerHour(x.airFlowRate);
		}
		
		const key = x.name;
		
		const commonFields = {
			design_outdoor_air_flow_rate: airFlowRateInCubicMetresPerHour,
			sup_air_flw_ctrl: "ODA",
			sup_air_temp_ctrl: "CONST",
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
				};
				break;
			case "Centralised continuous MEV":
				val = {
					vent_type: "Centralised continuous MEV",
					...commonFields,
					measured_air_flow_rate: 37,
					measured_fan_power: 12.26,
				};
				break;
			case "Intermittent MEV":
				val = {
					vent_type: "Intermittent MEV",
					...commonFields,
					SFP: 1.5,
				};
				break;
			case "Decentralised continuous MEV":
				val = {
					vent_type: "Decentralised continuous MEV",
					...commonFields,
					SFP: 1.5,
				};
				break;
			default:
				ventType satisfies never;
				throw new Error(`Encountered unexpected vent type: '${ventType}'`);
		}

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
    const taggedItem = getResolvedTaggedItem(
    [dwellingSpaceWindows, dwellingSpaceExternalWall],
    x.associatedItemId
  )!;

		const val: SchemaVent = {
			area_cm2: x.effectiveVentilationArea,
			mid_height_air_flow_path: x.midHeightOfZone,
      orientation360: taggedItem.orientation!,
      pitch: extractPitch(taggedItem),
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

			let applianceInput: SchemaCombustionAppliance;

			const commonFields: Pick<SchemaCombustionAppliance, "supply_situation" | "exhaust_situation"> = {
				supply_situation: airSupplyToAppliance,
				exhaust_situation: exhaustMethodFromAppliance,
			};

			switch (key) {
				case "closed_fire":
					applianceInput = {
						...commonFields,
						fuel_type: typeOfFuel as "oil" | "coal",
						appliance_type: key,
					};
					break;
				case "closed_with_fan":
				case "open_gas_flue_balancer":
				case "open_gas_kitchen_stove":
				case "open_gas_fire":
					applianceInput = {
						...commonFields,
						fuel_type: "gas",
						appliance_type: key,
					};
					break;
				case "open_fireplace":
					applianceInput = {
						...commonFields,
						fuel_type: "wood",
						appliance_type: key,
					};
					break;
				default:
					key satisfies never;
					throw new Error(`Unknown type of combustion appliance "${key}" encountered.`);
			}

			return [name, applianceInput];
		});
	}).flat();
	return objectFromEntries(combustionApplianceEntries);
}