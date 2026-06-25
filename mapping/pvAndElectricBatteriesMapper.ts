import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import type { SchemaEnergySupplyElectricity } from "~/schema/api-schema.types";
import type { SchemaWindowShadingObject } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapPvAndElectricBatteriesData(state: ResolvedState): [
	Pick<FhsInputSchema, "OnSiteGeneration">,
	Pick<SchemaEnergySupplyElectricity, "ElectricBattery">,
	Pick<SchemaEnergySupplyElectricity, "diverter">,
	{ [key: string]: Pick<SchemaEnergySupplyElectricity, "ElectricBattery"> | Pick<SchemaEnergySupplyElectricity, "diverter"> },
] {
	return [
		mapPvData(state),
		mapElectricBatteryData(state),
		mapPvDiverterData(state),
		mapDiverterEnergySupplyData(state),
	];
}

export function mapPvData(state: ResolvedState): Pick<FhsInputSchema, "OnSiteGeneration"> {
	return {
		OnSiteGeneration: objectFromEntries(state.pvAndBatteries.pvs.map((array) => {
			const { name, elevationalHeight, lengthOfPV, widthOfPV, locationOfInverter, inverterPeakPowerAC, inverterPeakPowerDC, inverterType, orientation, peakPower, pitch, ventilationStrategy } = array;
			return [
				name,
				{
					EnergySupply: defaultElectricityEnergySupplyName,
					base_height: elevationalHeight,
					height: lengthOfPV,
					width: widthOfPV,
					inverter_is_inside: locationOfInverter === "heated_space",
					inverter_peak_power_ac: inverterPeakPowerAC,
					inverter_peak_power_dc: inverterPeakPowerDC,
					inverter_type: inverterType,
					orientation360: orientation,
					peak_power: peakPower,
					pitch,
					shading: array.hasShading ? maPvShadingData(array.shading) : [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: ventilationStrategy,
				},
			] as const;
		})),
	};
}
export function mapDiverterEnergySupplyData(state: ResolvedState): { [key: string]: Pick<SchemaEnergySupplyElectricity, "ElectricBattery"> | Pick<SchemaEnergySupplyElectricity, "diverter"> } {
	const diverters = state.pvAndBatteries.diverters;

	if (diverters.length === 0) {
		return {};
	}

	const canExportToGrid = state.dwellingDetails.generalSpecifications.canExportToGrid === "yes";
	const EnergySupply: { [key: string]: SchemaEnergySupplyElectricity } = {};

	diverters.forEach((system) => {
		if (system.electricityPriority === "diverter") {
			EnergySupply[system.name] = { priority: ["diverter"], is_export_capable: canExportToGrid, fuel: "electricity" }; // TODO is_export_capable to be hooked into field in general details
		};
		if (system.electricityPriority === "electricBattery") {
			EnergySupply[system.name] = { priority: ["ElectricBattery"], is_export_capable: canExportToGrid, fuel: "electricity" }; // TODO is_export_capable to be hooked into field in general details
		};
	});
	return EnergySupply;
}

export function maPvShadingData(shading: ShadingObjectData[]): SchemaWindowShadingObject[] {
	return shading.map((shadingItem) => {
		const { typeOfShading } = shadingItem;
		switch (typeOfShading) {
			case "frame_or_reveal": {
				return {
					type: "reveal",
					distance: shadingItem.distance,
					depth: shadingItem.depth,
				};
			}
			case "obstacle": {
				return {
					type: "obstacle",
					distance: shadingItem.distance,
					height: shadingItem.height,
					transparency: shadingItem.transparency,
				};
			}
			case "overhang": {
				return {
					type: "overhang",
					distance: shadingItem.distance,
					depth: shadingItem.depth,
				};
			}
			case "left_side_fin": {
				return {
					type: "sidefinleft",
					distance: shadingItem.distance,
					depth: shadingItem.depth,
				};
			}
			case "right_side_fin": {
				return {
					type: "sidefinright",
					distance: shadingItem.distance,
					depth: shadingItem.depth,
				};
			}
			default: {
				throw new Error(`Unknown shading type: ${typeOfShading}`);
			}
		}

	});

}

export function mapElectricBatteryData(state: ResolvedState): Pick<SchemaEnergySupplyElectricity, "ElectricBattery"> {
	const electricBattery = state.pvAndBatteries.electricBattery[0];
	if (electricBattery) {
		return {
			"ElectricBattery": {
				battery_location: electricBattery.location,
				capacity: electricBattery.capacity,
				charge_discharge_efficiency_round_trip: electricBattery.chargeEfficiency,
				maximum_charge_rate_one_way_trip: electricBattery.maximumChargeRate,
				maximum_discharge_rate_one_way_trip: electricBattery.maximumDischargeRate,
				minimum_charge_rate_one_way_trip: electricBattery.minimumChargeRate,
			},
		};
	}
	return {};
}

export function mapPvDiverterData(state: ResolvedState): Pick<SchemaEnergySupplyElectricity, "diverter"> {
	const diverter = state.pvAndBatteries.diverters[0];
	const { domesticHotWater, spaceHeating } = state;
	if (!diverter) {
		return {};
	}

	const dhwHeatSource = domesticHotWater.heatSources.filter(x => x.isExistingHeatSource === false);
	const existingHeatSources = domesticHotWater.heatSources.filter(x => x.isExistingHeatSource === true).map(x => x.heatSourceId);
	const heatSourcesFromSpaceHeating = spaceHeating.heatSource.filter(x => existingHeatSources.includes(x.id));
	const both = [...dhwHeatSource, ...heatSourcesFromSpaceHeating];
	if (both.length !== 1) {
		throw new Error("Expected exactly one non-heat-network heat source for diverter, found " + both.length);
	}
	return {
		diverter: {
			"HeatSource": both[0]!.name,
		},
	};
}
