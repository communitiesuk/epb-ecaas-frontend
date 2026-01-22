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
} from "../schema/api-schema.types";
import type { SchemaHeatSourceWetDetails, SchemaHeatSourceWetHeatEmitterDetails } from "~/schema/aliases";

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
					battery_type: heatBattery.typeOfHeatBattery === "heatBatteryPcm" ? "pcm" : "dry_core",
					number_of_units: heatBattery.numberOfUnits,
					product_reference: heatBattery.productReference,
					...(heatBattery.typeOfHeatBattery === "heatBatteryDryCore" && { EnergySupply: { "type": heatBattery.energySupply } }),
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

export function mapRadiators(state: ResolvedState): Record<string, SchemaRadiatorWithProductReference> {
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
			const data: SchemaRadiatorWithProductReference = radiator.typeOfRadiator === "standard" ? {
				wet_emitter_type: "radiator",
				product_reference: radiator.productReference,
				radiator_type: "standard",
				length: radiator.length,
			} : {
				wet_emitter_type: "radiator",
				product_reference: radiator.productReference,
				radiator_type: "towel",
			};
			return [
				radiator.name,
				data,
			];
		}),
	);
}

export function mapUnderfloorHeating(state: ResolvedState): Record<string, SchemaUfhWithProductReference> {
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
		ufh.map((emitter) => {
			return [
				emitter.name,
				{
					wet_emitter_type: "ufh",
					product_reference: emitter.productReference,
				},
			];
		}),
	);
}

export function mapFanCoils(state: ResolvedState): Record<string, SchemaFancoilWithProductReference> {
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
		fancoils.map((emitter) => {
			return [
				emitter.name,
				{
					wet_emitter_type: "fancoil",
					product_reference: emitter.productReference,
				},
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
	const heatSources = state.spaceHeatingNew.heatSource;


	return Object.fromEntries(
		warmAirHeaters.map((emitter) => {
			const heatSourceName = heatSources.find(
				(heatsource) => heatsource.id === emitter.heatSource,
			)?.name ?? "";
			return [
				emitter.name,
				{
					type: "WarmAir",
					temp_diff_emit_dsgn: emitter.designTempDiffAcrossEmitters,
					frac_convective: emitter.convectionFraction,
					HeatSource: {
						name: heatSourceName,
					},
				},
			];
		}),
	);
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
					// placeholders
					convective_type: "Air heating (convectors, fan coils etc.)",
					EnergySupply: "",
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
// NOTE: this output type needs looking at and aliasing in schema/aliases.ts
export function mapHeatEmitters(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatEmitterDetails | SchemaInstantElecHeater | SchemaWarmAir | SchemaElecStorageHeaterWithProductReference> {
	return {
		...mapRadiators(state),
		...mapUnderfloorHeating(state),
		...mapFanCoils(state),
		...mapElectricStorageHeaters(state),
		...mapWarmAirHeater(state),
		...mapInstantElectricHeaters(state),
	};
}