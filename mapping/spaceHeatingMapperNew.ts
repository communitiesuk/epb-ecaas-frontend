import type { ResolvedState } from "./fhsInputMapper";
import { UNKNOWN } from "./spaceHeatingMapperNew.test";

export function mapHeatPumps(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const heatPumps = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatPump",
	);

	return Object.fromEntries(
		heatPumps.map((heatPump) => {
			return [
				heatPump.name,
				{ type: "HeatPump", product_reference: heatPump.productReference, EnergySupply: UNKNOWN },
			];
		}),
	);
}

export function mapBoilers(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const boilers = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "boiler",
	);

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

export function mapHeatBatteries(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const heatBatteries = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatBattery",
	);

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

export function mapHeatNetworks(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const _heatNetworks = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatNetwork",
	);

	return {};
}
export function mapSolarThermalSystems(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const _solarThermals = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "solarThermalSystem",
	);

	return {};
}

export function mapSpaceHeating(state: ResolvedState) {
	return {
		...mapHeatPumps(state),
		...mapBoilers(state),
		...mapHeatNetworks(state),
		...mapHeatBatteries(state),
		...mapSolarThermalSystems(state),
	};
}
