import { objectFromEntries } from "ts-extras";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import type { SchemaSpaceHeatSystemDetails } from "~/schema/aliases";
import { defaultControlName, defaultElectricityEnergySupplyName, defaultZoneName } from "./common";

export function mapheatingAndCoolingSystemsData(state: ResolvedState): Pick<FhsInputSchema, "EnergySupply" | "SpaceHeatSystem"> {
	return {
		...mapEnergySupplyData(state),
		...mapHeatEmittingData(state),
	};
}

export function mapEnergySupplyData(state: ResolvedState): Pick<FhsInputSchema, "EnergySupply"> {
	const { fuelType, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered, exported } = state.heatingAndCoolingSystems.energySupply;

	return {
		EnergySupply: {
			...objectFromEntries(fuelType ? fuelType.map((fuelType) => ([
				fuelType === "electricity" ? defaultElectricityEnergySupplyName : fuelType,
				{
					fuel: fuelType,
					...(fuelType === "electricity" ? { is_export_capable: exported ?? false } : {}),
					...(fuelType === "custom" ? {
						factor: {
							"Emissions Factor kgCO2e/kWh": co2PerKwh!,
							"Emissions Factor kgCO2e/kWh including out-of-scope emissions": co2PerKwhIncludingOutOfScope!,
							"Primary Energy Factor kWh/kWh delivered": kwhPerKwhDelivered!,
							"is_export_capable": exported ?? false,
						},
					} : {}),
				},
			])) : []),
		},
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

type ToNumber<S> = S extends `${infer N extends number}` ? N : never;

/** Utility function to convert a string from a union type into a number in a converted union type */
function unionStringAsInt<T extends string>(value: T): ToNumber<T> {
	return parseInt(value) as ToNumber<T>;
}
