import type { EmptyObject } from "type-fest";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import type { SchemaElectricBattery } from "~/schema/api-schema.types";
import type { SchemaWindowShadingObject } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName } from "./common";

export function mapPvAndElectricBatteriesData(state: ResolvedState): [Pick<FhsInputSchema, "OnSiteGeneration">, { "ElectricBattery": SchemaElectricBattery } | EmptyObject] {
	return [
		{
			...mapPvSystemData(state),
			...mapPvDiverterData(state),
		},
		mapElectricBatteryData(state),
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
			"ElectricBattery":
				{
					battery_age: electricBattery.batteryAge,
					battery_location: electricBattery.location,
					capacity: electricBattery.capacity,
					charge_discharge_efficiency_round_trip: electricBattery.chargeEfficiency,
					grid_charging_possible: electricBattery.gridChargingPossible,
					maximum_charge_rate_one_way_trip: electricBattery.maximumChargeRate,
					maximum_discharge_rate_one_way_trip: electricBattery.maximumDischargeRate,
					minimum_charge_rate_one_way_trip: electricBattery.minimumChargeRate,
				},
		};
	}
	return {}; 
}

/* Function unused yet while no diverter data to map. **/
export function mapPvDiverterData(_state: ResolvedState): EmptyObject {
	return {};
}
