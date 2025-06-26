import { BatteryLocation, FuelType, InverterType, OnSiteGenerationVentilationStrategy, type SchemaElectricBattery } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";
import { mapElectricBatteryData, mapPvSystemData } from "./pvAndElectricBatteriesMapper";

describe("PV and electric batteries mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});
    
	it("maps PV systems to the FHS input", () => {
		// Arrange
		const pvSystemData: PvSystemData[] = [
			{
				name: "Roof",
				peakPower: 50,
				pitch: 45,
				orientation: 270,
				ventilationStrategy: OnSiteGenerationVentilationStrategy.moderately_ventilated,
				elevationalHeight: 5,
				lengthOfPV: 10,
				widthOfPV: 4,
				inverterPeakPowerAC: 48,
				inverterPeakPowerDC: 60,
				inverterIsInside: false,
				inverterType: InverterType.string_inverter,
			},
			{
				name: "Garden",
				peakPower: 100,
				pitch: 45,
				orientation: 180,
				ventilationStrategy: OnSiteGenerationVentilationStrategy.rear_surface_free,
				elevationalHeight: 2,
				lengthOfPV: 3,
				widthOfPV: 15,
				inverterPeakPowerAC: 96,
				inverterPeakPowerDC: 120,
				inverterIsInside: false,
				inverterType: InverterType.optimised_inverter
			}
		];

		store.$patch({
			pvAndBatteries: {
				pvSystem: {
					data: pvSystemData,
					complete: true
				}
			}
		});

		// Act
		const result = mapPvSystemData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'OnSiteGeneration'> = {
			OnSiteGeneration: {
				"Roof": {
					EnergySupply: FuelType.electricity,
					base_height: 5,
					height: 10,
					inverter_is_inside: false,
					inverter_peak_power_ac: 48,
					inverter_peak_power_dc: 60,
					inverter_type: InverterType.string_inverter,
					orientation360: 270,
					peak_power: 50,
					pitch: 45,
					shading: [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: OnSiteGenerationVentilationStrategy.moderately_ventilated,
					width: 4,
				},
				"Garden": {
					EnergySupply: FuelType.electricity,
					base_height: 2,
					height: 3,
					inverter_is_inside: false,
					inverter_peak_power_ac: 96,
					inverter_peak_power_dc: 120,
					inverter_type: InverterType.optimised_inverter,
					orientation360: 180,
					peak_power: 100,
					pitch: 45,
					shading: [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: OnSiteGenerationVentilationStrategy.rear_surface_free,
					width: 15,
				},
			}
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps electric batteries to the correct form for FHS input", () => {
		// Arrange
		const battery: ElectricBatteryData = {
			name: "Acme Model II",
			capacity: 10,
			batteryAge: 2,
			chargeEfficiency: 0.7,
			location: BatteryLocation.inside,
			gridChargingPossible: false,
			maximumChargeRate: 6.2,
			minimumChargeRate: 4.5,
			maximumDischargeRate: 2.3,
		};

		store.$patch({
			pvAndBatteries: {
				electricBattery: {
					data: battery,
					complete: true
				}
			}
		});

		// Act
		const result = mapElectricBatteryData(resolveState(store.$state));

		// Assert
		const expectedResult: Record<string, SchemaElectricBattery> = {
			"ElectricBattery": {
				battery_age: 2,
				battery_location: BatteryLocation.inside,
				capacity: 10,
				charge_discharge_efficiency_round_trip: 0.7,
				grid_charging_possible: false,
				maximum_charge_rate_one_way_trip: 6.2,
				maximum_discharge_rate_one_way_trip: 2.3,
				minimum_charge_rate_one_way_trip: 4.5
			},
			// "ElectricBattery1": {
			// 	battery_age: 0,
			// 	battery_location: BatteryLocation.outside,
			// 	capacity: 14,
			// 	charge_discharge_efficiency_round_trip: 0.8,
			// 	grid_charging_possible: true,
			// 	maximum_charge_rate_one_way_trip: 7.4,
			// 	maximum_discharge_rate_one_way_trip: 2.9,
			// 	minimum_charge_rate_one_way_trip: 4.2
			// },
		};
		expect(result).toEqual(expectedResult);
	});
});