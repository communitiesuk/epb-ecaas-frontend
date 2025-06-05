import { objectFromEntries } from "ts-extras";
import type { FhsInputSchema } from "./fhsInputMapper";
import { FuelType, type SchemaSpaceHeatSystemDetails } from "~/schema/api-schema.types";

export function mapHeatingSystemsData(state: EcaasState): Partial<FhsInputSchema> {
	return {
		...mapEnergySupplyData(state),
	};
}

export function mapEnergySupplyData(state: EcaasState): Pick<FhsInputSchema, 'EnergySupply'> {
	const { fuelType, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered, exported } = state.heatingSystems.energySupply.data;
	
	return {
		EnergySupply: {
			...objectFromEntries(fuelType.map((fuelType) => ([
				fuelType,
				{
					fuel: fuelType as FuelType,
					...(fuelType === FuelType.electricity ? { is_export_capable: exported } : {}),
					...(fuelType === FuelType.custom ? { factor: {
						"Emissions Factor kgCO2e/kWh": co2PerKwh!,
						"Emissions Factor kgCO2e/kWh including out-of-scope emissions": co2PerKwhIncludingOutOfScope!,
						"Primary Energy Factor kWh/kWh delivered": kwhPerKwhDelivered!
					} } : {}),
				}
			])))
		}
	};
}

// TODO need a mapHeatGenerationData function here, though this specifies products in the PCDB, heat pumps initially

export function mapHeatEmittingData(state: EcaasState): Pick<FhsInputSchema, 'SpaceHeatSystem'> {
	const wetDistributions = state.heatingSystems.heatEmitting.wetDistribution.data;
	const wetDistributionEntries = wetDistributions.map((distribution) => {
		const { name, zoneReference, heatSource, thermalMass, designTempDiffAcrossEmitters, designFlowTemp, ecoDesignControllerClass, minimumFlowTemp, minOutdoorTemp, maxOutdoorTemp, typeOfSpaceHeater, convectionFractionWet } = distribution;

		const distributionDetails: SchemaSpaceHeatSystemDetails = {
			HeatSource: {name: heatSource},
			design_flow_temp: designFlowTemp,
			...(typeOfSpaceHeater === "radiator" ? {
				emitters: Array(distribution.numberOfRadiators).fill({
					wet_emitter_type: typeOfSpaceHeater,
					frac_convective: convectionFractionWet,
					c: distribution.constant,
					n: distribution.exponent,
				})
			} : {
				emitters: [{
					wet_emitter_type: typeOfSpaceHeater,
					emitter_floor_area: distribution.emitterFloorArea,
					frac_convective: convectionFractionWet,
					equivalent_specific_thermal_mass: distribution.equivalentThermalMass,
					system_performance_factor: distribution.systemPerformanceFactor
				}]
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
			Zone: zoneReference,
		};
		return [
			name,
			distributionDetails
		] as const;
	});

	const instantElectricHeaters = state.heatingSystems.heatEmitting.instantElectricHeater.data;
	const instantElectricHeaterEntries = instantElectricHeaters.map((heater): [string, SchemaSpaceHeatSystemDetails] => [
		heater.name,
		{
			type: "InstantElecHeater",
			EnergySupply: FuelType.electricity,
			rated_power: heater.ratedPower,
			frac_convective: heater.convectionFractionInstant,
		}
	]);

	// NB. electric storage heaters and warm air heat pumps yet to be mapped here (PCDB dependent)

	return {
		SpaceHeatSystem: objectFromEntries([...wetDistributionEntries, ...instantElectricHeaterEntries])
	};
}