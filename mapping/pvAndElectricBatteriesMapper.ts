import type { EmptyObject } from "type-fest";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import type { SchemaElectricBattery, SchemaEnergySupplyElectricity } from "~/schema/api-schema.types";
import type { SchemaWindowShadingObject } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapPvAndElectricBatteriesData(state: ResolvedState): [
	Pick<FhsInputSchema, "OnSiteGeneration">,
	{ "ElectricBattery": SchemaElectricBattery } | EmptyObject,
	Pick<SchemaEnergySupplyElectricity, "diverter"> | EmptyObject,
	{ "ElectricBattery": SchemaElectricBattery } | { "diverter": SchemaEnergySupplyElectricity } | EmptyObject,
] {
	return [
		mapPvArrayData(state),
		mapElectricBatteryData(state),
		mapPvDiverterData(state),
		mapPvArrayEnergySupplyData(state),
	];
}

export function mapPvArrayData(state: ResolvedState): Pick<FhsInputSchema, "OnSiteGeneration"> {
	return {
		OnSiteGeneration: objectFromEntries(state.pvAndBatteries.pvArrays.map((array) => {
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
					shading: array.hasShading ? maPvArrayShadingData(array.shading) : [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: ventilationStrategy,
				},
			] as const;
		})),
	};
}
export function mapPvArrayEnergySupplyData(state: ResolvedState): { [key: string]: SchemaEnergySupplyElectricity } | EmptyObject {
	const pvArrays = state.pvAndBatteries.pvArrays;
	if (pvArrays.length === 0) {
		return {};
	}
	const EnergySupply: { [key: string]: SchemaEnergySupplyElectricity } = {};
	pvArrays.forEach((system) => {
		if (system.electricityPriority === "diverter") {
			EnergySupply[system.name] = { priority: ["diverter"], is_export_capable: system.canExportToGrid, fuel: "electricity" };
		};
		if (system.electricityPriority === "electricBattery") {
			EnergySupply[system.name] = { priority: ["ElectricBattery"], is_export_capable: system.canExportToGrid, fuel: "electricity" };
		};
	});
	return EnergySupply;
}

export function maPvArrayShadingData(shading: PvShadingData[]): SchemaWindowShadingObject[] {
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

export function mapElectricBatteryData(state: ResolvedState): { "ElectricBattery": SchemaElectricBattery } | EmptyObject {
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

export function mapPvDiverterData(state: ResolvedState): Pick<SchemaEnergySupplyElectricity, "diverter"> | EmptyObject {
	const diverter = state.pvAndBatteries.diverters[0];

	if (!diverter) {
		return {};
	}

	const hotWaterCylinder = state.domesticHotWater.waterStorage
		.filter(x => x.id === diverter?.hotWaterCylinder)[0]!;
	const dhwHeatSource = state.domesticHotWater.heatSources
		.find(x => x.id === hotWaterCylinder.dhwHeatSourceId)!;

	const heatSourceName = dhwHeatSource.isExistingHeatSource
		? state.spaceHeating.heatSource.find(x => x.id === dhwHeatSource.heatSourceId)!.name
		: dhwHeatSource.name;


	return {
		diverter: {
			"HeatSource": heatSourceName,
		},
	};
}
