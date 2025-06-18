import type { EmptyObject } from "type-fest";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import { FuelType, type SchemaElectricBattery, type SchemaWindowShadingObject } from "~/schema/api-schema.types";

export function mapPvAndElectricBatteriesData(state: ResolvedState): [Pick<FhsInputSchema, 'OnSiteGeneration'>, Record<string, SchemaElectricBattery>] {
	return [
		{
			...mapPvSystemData(state),
			...mapPvDiverterData(state),
		},
		mapElectricBatteryData(state)
	];
}

export function mapPvSystemData(state: ResolvedState): Pick<FhsInputSchema, 'OnSiteGeneration'> {
	return {
		OnSiteGeneration: objectFromEntries(state.pvAndBatteries.pvSystem.map((system) => {
			const { name, elevationalHeight, lengthOfPV, widthOfPV, inverterIsInside, inverterPeakPowerAC, inverterPeakPowerDC, inverterType, orientation, peakPower, pitch, ventilationStrategy } = system;

			return [
				name,
				{
					EnergySupply: FuelType.electricity,
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
				}
			] as const;
		})),
	};
}

export function mapElectricBatteryData(state: ResolvedState): Record<string, SchemaElectricBattery> {
	return objectFromEntries(state.pvAndBatteries.electricBattery.map((battery): [string, SchemaElectricBattery] => {
		const { batteryAge, location, capacity, chargeEfficiency, gridChargingPossible, maximumChargeRate, maximumDischargeRate, minimumChargeRate } = battery;

		return [
			"ElectricBattery",
			{
				battery_age: batteryAge,
				battery_location: location,
				capacity,
				charge_discharge_efficiency_round_trip: chargeEfficiency,
				grid_charging_possible: gridChargingPossible,
				maximum_charge_rate_one_way_trip: maximumChargeRate,
				maximum_discharge_rate_one_way_trip: maximumDischargeRate,
				minimum_charge_rate_one_way_trip: minimumChargeRate
			}
		];
	}));
}

/* Function unused yet while no diverter data to map. **/
export function mapPvDiverterData(_state: ResolvedState): EmptyObject {
	return {};
}
