import type { ResolvedState } from "./fhsInputMapper";

export function mapHeatPumps(state: ResolvedState) {
	const heatsources = state.spaceHeatingNew.heatSource;
	const heatPumps = heatsources.filter(
		(heatsource) => heatsource.typeOfHeatSource === "heatPump",
	);

	return Object.fromEntries(
		heatPumps.map((heatPump) => {
			return [
				heatPump.name,
				{ type: "HeatPump", product_reference: heatPump.productReference },
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
