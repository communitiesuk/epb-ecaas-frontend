import type { EmptyObject } from "type-fest";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import type { SchemaElectricBattery, SchemaEnergySupplyElectricity } from "~/schema/api-schema.types";
import type { SchemaWindowShadingObject } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapPvAndElectricBatteriesData(state: ResolvedState): [Pick<FhsInputSchema, "OnSiteGeneration">, { "ElectricBattery": SchemaElectricBattery } | EmptyObject, Pick<SchemaEnergySupplyElectricity, "diverter"> | EmptyObject] {
	return [
		mapPvSystemData(state),
		mapElectricBatteryData(state),
		mapPvDiverterData(state),
	];
}

export function mapPvSystemData(state: ResolvedState): Pick<FhsInputSchema, "OnSiteGeneration"> {
	return {
		OnSiteGeneration: objectFromEntries(state.pvAndBatteries.pvSystems.map((system) => {
			const { name, elevationalHeight, lengthOfPV, widthOfPV, inverterIsInside, inverterPeakPowerAC, inverterPeakPowerDC, inverterType, orientation, peakPower, pitch, ventilationStrategy } = system;

			return [
				name,
				{
					EnergySupply: defaultElectricityEnergySupplyName,
					base_height: elevationalHeight,
					height: lengthOfPV,
					width: widthOfPV,
					inverter_is_inside: inverterIsInside,
					inverter_peak_power_ac: inverterPeakPowerAC,
					inverter_peak_power_dc: inverterPeakPowerDC,
					inverter_type: inverterType,
					orientation360: orientation,
					peak_power: peakPower,
					pitch,
					shading: [] as SchemaWindowShadingObject[], // not included yet
					type: "PhotovoltaicSystem",
					ventilation_strategy: ventilationStrategy,
				},
			] as const;
		})),
	};
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
