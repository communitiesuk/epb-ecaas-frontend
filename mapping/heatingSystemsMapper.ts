import { objectFromEntries } from "ts-extras";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { FuelType  } from "~/schema/api-schema.types";
import type { SchemaSpaceHeatSystemDetails } from "~/schema/api-schema.types";
import { defaultElectricityEnergySupplyName, defaultZoneName } from "./common";

export function mapHeatingSystemsData(state: ResolvedState): Pick<FhsInputSchema, "EnergySupply" | "SpaceHeatSystem"> {
	return {
		...mapEnergySupplyData(state),
		...mapHeatEmittingData(state),
	};
}

export function mapEnergySupplyData(state: ResolvedState): Pick<FhsInputSchema, "EnergySupply"> {
	const { fuelType, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered, exported } = state.heatingSystems.energySupply;
	
	return {
		EnergySupply: {
			...objectFromEntries(fuelType ? fuelType.map((fuelType) => ([
				fuelType === FuelType.electricity ? defaultElectricityEnergySupplyName : fuelType,
				{
					fuel: fuelType as FuelType,
					...(fuelType === FuelType.electricity ? { is_export_capable: exported } : {}),
					...(fuelType === FuelType.custom ? { factor: {
						"Emissions Factor kgCO2e/kWh": co2PerKwh!,
						"Emissions Factor kgCO2e/kWh including out-of-scope emissions": co2PerKwhIncludingOutOfScope!,
						"Primary Energy Factor kWh/kWh delivered": kwhPerKwhDelivered!,
					} } : {}),
				},
			])) : []),
		},
	};
}

// TODO need a mapHeatGenerationData function here, though this specifies products in the PCDB, heat pumps initially

export function mapHeatEmittingData(state: ResolvedState): Pick<FhsInputSchema, "SpaceHeatSystem"> {
	const wetDistributions = state.heatingSystems.heatEmitting.wetDistribution;
	const wetDistributionEntries = wetDistributions.map((distribution) => {
		const { name, heatSource, thermalMass, designTempDiffAcrossEmitters, designFlowTemp, designFlowRate, ecoDesignControllerClass, minimumFlowTemp, minOutdoorTemp, maxOutdoorTemp, typeOfSpaceHeater, convectionFractionWet } = distribution.data;
		const heatSourceName = state.heatingSystems.heatGeneration.heatPump.find(pump => pump.data.id === heatSource)!.data.name; // TODO: adapt this to work for all heat generators (not just heat pumps) once they are added

		const distributionDetails: SchemaSpaceHeatSystemDetails = {
			HeatSource: {
				name: heatSourceName,
				temp_flow_limit_upper: 65, // we've defaulted this field on our heat pump until it comes from PCDB
			},
			design_flow_temp: designFlowTemp,
			design_flow_rate: designFlowRate,
			...(typeOfSpaceHeater === "radiator" ? {
				emitters: Array(distribution.data.numberOfRadiators).fill({
					wet_emitter_type: typeOfSpaceHeater,
					frac_convective: convectionFractionWet,
					c: distribution.data.constant,
					n: distribution.data.exponent,
				}),
			} : {
				emitters: [{
					wet_emitter_type: typeOfSpaceHeater,
					emitter_floor_area: distribution.data.emitterFloorArea,
					frac_convective: convectionFractionWet,
					equivalent_specific_thermal_mass: distribution.data.equivalentThermalMass,
					system_performance_factor: distribution.data.systemPerformanceFactor,
				}],
			}),
			ecodesign_controller: {
				ecodesign_control_class: parseInt(ecoDesignControllerClass),
				min_flow_temp: minimumFlowTemp,
				min_outdoor_temp: minOutdoorTemp,
				max_outdoor_temp: maxOutdoorTemp,
			},
			temp_diff_emit_dsgn: designTempDiffAcrossEmitters,
			thermal_mass: thermalMass,
			type: "WetDistribution",
			Zone: defaultZoneName,
		};
		return [
			name,
			distributionDetails,
		] as const;
	});

	const instantElectricHeaters = state.heatingSystems.heatEmitting.instantElectricHeater;
	const instantElectricHeaterEntries = instantElectricHeaters.map((heater): [string, SchemaSpaceHeatSystemDetails] => [
		heater.data.name,
		{
			type: "InstantElecHeater",
			EnergySupply: defaultElectricityEnergySupplyName,
			rated_power: heater.data.ratedPower,
			frac_convective: heater.data.convectionFractionInstant,
		},
	]);

	// NB. electric storage heaters and warm air heat pumps yet to be mapped here (PCDB dependent)

	return {
		SpaceHeatSystem: objectFromEntries([...wetDistributionEntries, ...instantElectricHeaterEntries]),
	};
}