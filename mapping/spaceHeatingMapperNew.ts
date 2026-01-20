import type { ResolvedState } from "./fhsInputMapper";
import { UNKNOWN } from "./spaceHeatingMapperNew.test";
import type { HeatEmittingData } from "../stores/ecaasStore.schema";
import type {
	SchemaFancoilWithProductReference,
	SchemaHeatSourceWetBoiler,
	SchemaHeatSourceWetHeatBattery,
	SchemaHeatSourceWetHeatPump,
	SchemaRadiatorWithProductReference,
	SchemaUfhWithProductReference,
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
					EnergySupply: UNKNOWN,
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
			return [
				radiator.name,
				{
					wet_emitter_type: "radiator",
					product_reference: radiator.productReference,
					radiator_type: "standard",
					// Placeholder as length is required by schema for standard type
					length: 0,
				},
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
					wet_emitter_type: "fancoil",
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

export function mapSpaceHeating(state: ResolvedState): Record<string, SchemaHeatSourceWetDetails> {
	return {
		...mapHeatPumps(state),
		...mapBoilers(state),
		...mapHeatNetworks(state),
		...mapHeatBatteries(state),
		...mapSolarThermalSystems(state),
	};
}

export function mapHeatEmitters(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatEmitterDetails> {
	return {
		...mapRadiators(state),
		...mapUnderfloorHeating(state),
		...mapFanCoils(state),
	};
}