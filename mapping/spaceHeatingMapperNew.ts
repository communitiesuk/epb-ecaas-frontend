import type { ResolvedState } from "./fhsInputMapper";
import type { HeatEmittingData } from "../stores/ecaasStore.schema";
import type {
	SchemaElecStorageHeaterWithProductReference,
	SchemaFancoilWithProductReference,
	SchemaHeatSourceWetBoiler,
	SchemaHeatSourceWetHeatBattery,
	SchemaHeatSourceWetHeatPump,
	SchemaInstantElecHeater,
	SchemaRadiatorWithProductReference,
	SchemaUfhWithProductReference,
	SchemaWarmAir,
	SchemaWetDistribution,
	SchemaEcoDesignControllerNoWeatherCompensator,
} from "../schema/api-schema.types";
import type { SchemaHeatSourceWetDetails, SchemaSpaceHeatSystem } from "~/schema/aliases";
import { defaultConvectiveType, defaultElectricityEnergySupplyName, defaultZoneName, maxOutdoorTemp, minOutdoorTemp } from "./common";

export function mapHeatPumps(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatPump> {
	const heatsources = state.spaceHeatingNew.heatSource;
	const heatPumps = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatPump",
	);

	return Object.fromEntries(
		heatPumps.map((heatPump) => {
			return [
				heatPump.name,
				{
					type: "HeatPump",
					product_reference: heatPump.productReference,
					EnergySupply: "",
				},
			];
		}),
	);
}

export function mapBoilers(state: ResolvedState): Record<string, SchemaHeatSourceWetBoiler> {
	const heatsources = state.spaceHeatingNew.heatSource;
	const boilers = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "boiler",
	);
	// @ts-expect-error Missing properties on type
	return Object.fromEntries(
		boilers.map((boiler) => {
			return [
				boiler.name,
				{
					type: "Boiler",
					product_reference: boiler.productReference,
					boiler_location:
						boiler.locationOfBoiler === "heatedSpace"
							? "internal"
							: "external",
				},
			];
		}),
	);
}

export function mapHeatBatteries(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatBattery> {
	const heatsources = state.spaceHeatingNew.heatSource;
	const heatBatteries = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatBattery",
	);
	// @ts-expect-error Missing properties on type
	return Object.fromEntries(
		heatBatteries.map((heatBattery) => {
			return [
				heatBattery.name,
				{
					type: "HeatBattery",
					battery_type: heatBattery.typeOfHeatBattery === "pcm" ? "pcm" : "dry_core",
					number_of_units: heatBattery.numberOfUnits,
					product_reference: heatBattery.productReference,
					...(heatBattery.typeOfHeatBattery === "dryCore" && { EnergySupply: { "type": heatBattery.energySupply } }),
				},
			];
		}),
	);
}

export function mapHeatNetworks(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatBattery> {
	const heatsources = state.spaceHeatingNew.heatSource;
	const _heatNetworks = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatNetwork",
	);

	return {};
}

export function mapSolarThermalSystems(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatBattery> {
	const heatsources = state.spaceHeatingNew.heatSource;
	const _solarThermals = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "solarThermalSystem",
	);

	return {};
}

export function mapRadiators(state: ResolvedState): Record<string, SchemaWetDistribution> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};
	if (!heatEmitters) {
		return {};
	}
	const radiators = heatEmitters.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "radiator" }> => emitter.typeOfHeatEmitter === "radiator",
	);
	return Object.fromEntries(
		radiators.map((radiator) => {
			const emitter: SchemaRadiatorWithProductReference = radiator.typeOfRadiator === "standard" ? {
				wet_emitter_type: "radiator",
				product_reference: radiator.productReference,
				radiator_type: "standard",
				length: radiator.length,
			} : {
				wet_emitter_type: "radiator",
				product_reference: radiator.productReference,
				radiator_type: "towel",
			};
			const common = {
				emitters: Array(radiator.numOfRadiators).fill(emitter),
				EnergySupply: defaultElectricityEnergySupplyName,
				temp_diff_emit_dsgn: radiator.designTempDiffAcrossEmitters,
				Zone: defaultZoneName,
				type: "WetDistribution" as const,
				design_flow_temp: radiator.designFlowTemp,
				HeatSource: { name: getHeatSourceNameForEmitter(state, radiator) },
				ecodesign_controller: {
					ecodesign_control_class: parseInt(radiator.ecoDesignControllerClass),
					min_flow_temp: radiator.minFlowTemp,
					min_outdoor_temp: minOutdoorTemp,
					max_outdoor_temp: maxOutdoorTemp,
				} as SchemaEcoDesignControllerNoWeatherCompensator,
			};
			const data: SchemaWetDistribution = radiator.hasVariableFlowRate
				? { ...common, variable_flow: true, min_flow_rate: radiator.minFlowRate, max_flow_rate: radiator.maxFlowRate }
				: { ...common, variable_flow: false, design_flow_rate: radiator.designFlowRate };
			return [
				radiator.name,
				data,
			];
		}),
	);
}

export function mapUnderfloorHeating(state: ResolvedState): Record<string, SchemaWetDistribution> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};
	if (!heatEmitters) {
		return {};
	}

	const ufh = heatEmitters.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "underfloorHeating" }> => emitter.typeOfHeatEmitter === "underfloorHeating",
	);

	return Object.fromEntries(
		ufh.map((heating) => {
			const emitter: SchemaUfhWithProductReference = {
				product_reference: heating.productReference,
				wet_emitter_type: "ufh" as unknown as "fancoil",
				// needs fixing in api-schema.types.ts
			};
			const common = {
				emitters: [emitter],
				EnergySupply: defaultElectricityEnergySupplyName,
				temp_diff_emit_dsgn: heating.designTempDiffAcrossEmitters,
				Zone: defaultZoneName,
				type: "WetDistribution" as const,
				design_flow_temp: heating.designFlowTemp,
				HeatSource: { name: getHeatSourceNameForEmitter(state, heating) },
				ecodesign_controller: {
					ecodesign_control_class: parseInt(heating.ecoDesignControllerClass),
					min_flow_temp: heating.minFlowTemp,
					min_outdoor_temp: minOutdoorTemp,
					max_outdoor_temp: maxOutdoorTemp,
				} as SchemaEcoDesignControllerNoWeatherCompensator,
			};
			const data: SchemaWetDistribution = heating.hasVariableFlowRate
				? { ...common, variable_flow: true, min_flow_rate: heating.minFlowRate, max_flow_rate: heating.maxFlowRate }
				: { ...common, variable_flow: false, design_flow_rate: heating.designFlowRate };
			return [
				heating.name,
				data,
			];
		}),
	);
}

export function mapFanCoils(state: ResolvedState): Record<string, SchemaWetDistribution> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};
	if (!heatEmitters) {
		return {};
	}

	const fancoils = heatEmitters.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "fanCoil" }> => emitter.typeOfHeatEmitter === "fanCoil",
	);

	return Object.fromEntries(
		fancoils.map((fancoil) => {
			const emitter: SchemaFancoilWithProductReference = {
				product_reference: fancoil.productReference,
				wet_emitter_type: "fancoil",
			};
			const common = {
				emitters: Array(fancoil.numOfFanCoils).fill(emitter),
				EnergySupply: defaultElectricityEnergySupplyName,
				temp_diff_emit_dsgn: fancoil.designTempDiffAcrossEmitters,
				Zone: defaultZoneName,
				type: "WetDistribution" as const,
				design_flow_temp: fancoil.designFlowTemp,
				HeatSource: { name: getHeatSourceNameForEmitter(state, fancoil) },
				ecodesign_controller: {
					ecodesign_control_class: parseInt(fancoil.ecoDesignControllerClass),
					min_flow_temp: fancoil.minFlowTemp,
					min_outdoor_temp: minOutdoorTemp,
					max_outdoor_temp: maxOutdoorTemp,
				} as SchemaEcoDesignControllerNoWeatherCompensator,
			};
			const data: SchemaWetDistribution = fancoil.hasVariableFlowRate
				? { ...common, variable_flow: true, min_flow_rate: fancoil.minFlowRate, max_flow_rate: fancoil.maxFlowRate }
				: { ...common, variable_flow: false, design_flow_rate: fancoil.designFlowRate };
			return [
				fancoil.name,
				data,
			];
		}),
	);
}

export function mapElectricStorageHeaters(state: ResolvedState): Record<string, SchemaElecStorageHeaterWithProductReference> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {

		return {};
	}
	const electricStorageHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "electricStorageHeater" }> => emitter.typeOfHeatEmitter === "electricStorageHeater",
	);
	return Object.fromEntries(
		electricStorageHeaters.map((emitter) => {
			return [
				emitter.name,
				{
					type: "ElecStorageHeater",
					product_reference: emitter.productReference,
					n_units: emitter.numOfStorageHeaters,
				},
			];
		}),
	);
}
export function mapWarmAirHeater(state: ResolvedState): Record<string, SchemaWarmAir> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {
		return {};
	}
	const warmAirHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "warmAirHeater" }> => emitter.typeOfHeatEmitter === "warmAirHeater",
	);


	return Object.fromEntries(
		warmAirHeaters.map((emitter) => {
			return [
				emitter.name,
				{
					type: "WarmAir",
					temp_diff_emit_dsgn: emitter.designTempDiffAcrossEmitters,
					frac_convective: emitter.convectionFraction,
					HeatSource: {
						name: getHeatSourceNameForEmitter(state, emitter),
					},
				},
			];
		}),
	);
}

function getHeatSourceNameForEmitter(state: ResolvedState, emitter: HeatEmittingData): string {
	const heatSources = state.spaceHeatingNew.heatSource;
	const heatSourceName = heatSources.find(
		(heatsource) => {
			if ("heatSource" in emitter) {
				return heatsource.id === emitter.heatSource;
			}
			return false;
		},
	)?.name ?? "";
	return heatSourceName;
}

export function mapInstantElectricHeaters(state: ResolvedState): Record<string, SchemaInstantElecHeater> {
	const { heatEmitters } = state.spaceHeatingNew as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {
		return {};
	}
	const instantElecHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "instantElectricHeater" }> => emitter.typeOfHeatEmitter === "instantElectricHeater",
	);

	return Object.fromEntries(
		instantElecHeaters.map((emitter) => {
			return [
				emitter.name,
				{
					type: "InstantElecHeater",
					rated_power: emitter.ratedPower,
					convective_type: defaultConvectiveType,
					EnergySupply: defaultElectricityEnergySupplyName,
				} as SchemaInstantElecHeater,
			];
		}),
	);
}

export function mapSpaceHeating(state: ResolvedState): Record<string, SchemaHeatSourceWetDetails> {
	return {
		...mapHeatPumps(state),
		...mapBoilers(state),
		...mapHeatNetworks(state),
		...mapHeatBatteries(state),
		...mapSolarThermalSystems(state),
	};
}


export function mapWetDistributions(state: ResolvedState): Record<string, SchemaWetDistribution> {
	return {
		...mapRadiators(state),
		...mapUnderfloorHeating(state),
		...mapFanCoils(state),
	};
}

export function mapSpaceHeatSystem(state: ResolvedState): SchemaSpaceHeatSystem {
	return {
		...mapWetDistributions(state),
		...mapElectricStorageHeaters(state),
		...mapWarmAirHeater(state),
		...mapInstantElectricHeaters(state),
	};
}

