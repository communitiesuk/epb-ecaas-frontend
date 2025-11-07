import { objectFromEntries } from "ts-extras";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { SchemaSpaceCoolSystemDetails, SchemaSpaceHeatSystemDetails } from "~/schema/aliases";
import { defaultControlName, defaultElectricityEnergySupplyName, defaultZoneName } from "./common";

export function mapHeatingAndCoolingSystemsData(state: ResolvedState): Pick<FhsInputSchema, "SpaceHeatSystem" | "SpaceCoolSystem"> {
	return {
		...mapGeneralData(state),
		...mapHeatEmittingData(state),
		...mapSpaceCoolSystems(state),
	};
}

const heatingControlOptions: Record<string, "SeparateTempControl" | "SeparateTimeAndTempControl"> = {
	"separateTemperatureControl": "SeparateTempControl",
	"separateTimeAndTemperatureControl": "SeparateTimeAndTempControl",
};

export function mapGeneralData(state: ResolvedState): Pick<FhsInputSchema, "HeatingControlType" | "PartO_active_cooling_required"> {
	const { heatingControlType, coolingRequired } = state.heatingAndCoolingSystems.general;

	return {
		HeatingControlType: heatingControlOptions[heatingControlType]!,
		PartO_active_cooling_required: coolingRequired,
	};
}

// TODO need a mapHeatGenerationData function here, though this specifies products in the PCDB, heat pumps initially

export function mapHeatEmittingData(state: ResolvedState): Pick<FhsInputSchema, "SpaceHeatSystem"> {
	const wetDistributions = state.heatingAndCoolingSystems.heatEmitting.wetDistribution;
	const wetDistributionEntries = wetDistributions.map((distribution) => {
		const { name, heatSource, thermalMass, designTempDiffAcrossEmitters, designFlowTemp, designFlowRate, ecoDesignControllerClass, minimumFlowTemp, minOutdoorTemp, maxOutdoorTemp, typeOfSpaceHeater, convectionFractionWet } = distribution;
		const heatSourceName = state.heatingAndCoolingSystems.heatGeneration.heatPump.find(pump => pump.id === heatSource)!.name; // TODO: adapt this to work for all heat generators (not just heat pumps) once they are added

		const distributionDetails: SchemaSpaceHeatSystemDetails = {
			HeatSource: {
				name: heatSourceName,
				temp_flow_limit_upper: 65, // we've defaulted this field on our heat pump until it comes from PCDB
			},
			design_flow_temp: designFlowTemp,
			design_flow_rate: designFlowRate,
			...(typeOfSpaceHeater === "radiator" ? {
				emitters: Array(distribution.numberOfRadiators).fill({
					wet_emitter_type: typeOfSpaceHeater,
					frac_convective: convectionFractionWet,
					c: distribution.constant,
					n: distribution.exponent,
				}),
			} : {
				emitters: [{
					wet_emitter_type: typeOfSpaceHeater,
					emitter_floor_area: distribution.emitterFloorArea,
					frac_convective: convectionFractionWet,
					equivalent_specific_thermal_mass: distribution.equivalentThermalMass,
					system_performance_factor: distribution.systemPerformanceFactor,
				}],
			}),
			ecodesign_controller: {
				ecodesign_control_class: unionStringAsInt(ecoDesignControllerClass),
				min_flow_temp: minimumFlowTemp,
				min_outdoor_temp: minOutdoorTemp,
				max_outdoor_temp: maxOutdoorTemp,
			},
			temp_diff_emit_dsgn: designTempDiffAcrossEmitters,
			thermal_mass: thermalMass,
			type: "WetDistribution",
			Zone: defaultZoneName,
			Control: defaultControlName,
			variable_flow: false,
			pipework: [], // TODO: does pipework need to be added?
		};
		return [
			name,
			distributionDetails,
		] as const;
	});

	const instantElectricHeaters = state.heatingAndCoolingSystems.heatEmitting.instantElectricHeater;
	const instantElectricHeaterEntries = instantElectricHeaters.map((heater): [string, SchemaSpaceHeatSystemDetails] => [
		heater.name,
		{
			type: "InstantElecHeater",
			EnergySupply: defaultElectricityEnergySupplyName,
			rated_power: heater.ratedPower,
			convective_type: heater.convectiveType,
			Control: defaultControlName,
		},
	]);

	// NB. electric storage heaters and warm air heat pumps yet to be mapped here (PCDB dependent)

	return {
		SpaceHeatSystem: objectFromEntries([...wetDistributionEntries, ...instantElectricHeaterEntries]),
	};
}

export function mapSpaceCoolSystems(state: ResolvedState): Pick<FhsInputSchema, "SpaceCoolSystem"> {
	const spaceCoolSystems = state.heatingAndCoolingSystems.cooling.airConditioning.map((x): [string, SchemaSpaceCoolSystemDetails] => {
		const key = x.name;
		const val: SchemaSpaceCoolSystemDetails = {
			EnergySupply: defaultElectricityEnergySupplyName,
			cooling_capacity: x.coolingCapacity,
			frac_convective: x.convectionFraction,
			efficiency: x.seasonalEnergyEfficiencyRatio,
			type: "AirConditioning",
		};

		return [key, val];
	});

	return {
		SpaceCoolSystem: Object.fromEntries(spaceCoolSystems),
	};
}

type ToNumber<S> = S extends `${infer N extends number}` ? N : never;

/** Utility function to convert a string from a union type into a number in a converted union type */
function unionStringAsInt<T extends string>(value: T): ToNumber<T> {
	return parseInt(value) as ToNumber<T>;
}
