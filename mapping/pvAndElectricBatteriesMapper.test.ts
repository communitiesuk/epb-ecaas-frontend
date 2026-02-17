import type { SchemaElectricBattery, SchemaEnergySupplyElectricity } from "~/schema/api-schema.types";
import type { FhsInputSchema } from "./fhsInputMapper";
import { mapElectricBatteryData, mapPvDiverterData, mapPvSystemData } from "./pvAndElectricBatteriesMapper";

const baseForm = {
	data: [],
	complete: true,
};

describe("PV and electric batteries mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps PV systems to the FHS input", () => {
		// Arrange
		const pvSystem1: EcaasForm<PvArrayData> = {
			data: {
				name: "Roof",
				peakPower: 50,
				pitch: 45,
				orientation: 270,
				ventilationStrategy: "moderately_ventilated",
				elevationalHeight: 5,
				lengthOfPV: 10,
				widthOfPV: 4,
				inverterPeakPowerAC: 48,
				inverterPeakPowerDC: 60,
				inverterIsInside: false,
				inverterType: "string_inverter",
			},
			complete: true,
		};

		const pvSystem2: EcaasForm<PvArrayData> = {
			data: {
				name: "Garden",
				peakPower: 100,
				pitch: 45,
				orientation: 180,
				ventilationStrategy: "rear_surface_free",
				elevationalHeight: 2,
				lengthOfPV: 3,
				widthOfPV: 15,
				inverterPeakPowerAC: 96,
				inverterPeakPowerDC: 120,
				inverterIsInside: false,
				inverterType: "optimised_inverter",
			},
			complete: true,
		};

		store.$patch({
			pvAndBatteries: {
				pvArrays: {
					...baseForm,
					data: [pvSystem1, pvSystem2],
				},
			},
		});

		// Act
		const result = mapPvSystemData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "OnSiteGeneration"> = {
			OnSiteGeneration: {
				"Roof": {
					EnergySupply: "mains elec",
					base_height: 5,
					height: 10,
					inverter_is_inside: false,
					inverter_peak_power_ac: 48,
					inverter_peak_power_dc: 60,
					inverter_type: "string_inverter",
					orientation360: 270,
					peak_power: 50,
					pitch: 45,
					shading: [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: "moderately_ventilated",
					width: 4,
				},
				"Garden": {
					EnergySupply: "mains elec",
					base_height: 2,
					height: 3,
					inverter_is_inside: false,
					inverter_peak_power_ac: 96,
					inverter_peak_power_dc: 120,
					inverter_type: "optimised_inverter",
					orientation360: 180,
					peak_power: 100,
					pitch: 45,
					shading: [],
					type: "PhotovoltaicSystem",
					ventilation_strategy: "rear_surface_free",
					width: 15,
				},
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps electric batteries to the correct form for FHS input", () => {
		// Arrange
		const battery: EcaasForm<ElectricBatteryData> = {
			data: {
				name: "Acme Model II",
				capacity: 10,
				chargeEfficiency: 0.7,
				location: "inside",
				maximumChargeRate: 6.2,
				minimumChargeRate: 4.5,
				maximumDischargeRate: 2.3,
			},
			complete: true,
		};

		store.$patch({
			pvAndBatteries: {
				electricBattery: {
					data: [battery],
					complete: true,
				},
			},
		});

		// Act
		const result = mapElectricBatteryData(resolveState(store.$state));

		// Assert
		const expectedResult: Record<string, SchemaElectricBattery> = {
			"ElectricBattery": {
				battery_location: "inside",
				capacity: 10,
				charge_discharge_efficiency_round_trip: 0.7,
				maximum_charge_rate_one_way_trip: 6.2,
				maximum_discharge_rate_one_way_trip: 2.3,
				minimum_charge_rate_one_way_trip: 4.5,
			},
			// "ElectricBattery1": {
			// 	battery_age: 0,
			// 	battery_location: "outside",
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

	it("maps diverters to the correct for for FHS input", () => {
		const hotWaterCylinderId = "88ea3f45-6f2a-40e2-9117-0541bd8a97f3";
		const heatPumpId = "56ddc6ce-7a91-4263-b051-96c7216bb01e";
		const dhwHeatPumpId = "56ddc6ce-7a91-4263-b051-96c7216b1234";

		const diverter1: EcaasForm<PvDiverterData> = {
			data: {
				name: "Diverter 1",
				hotWaterCylinder: hotWaterCylinderId,
			},
			complete: true,
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{
						data: {
							name: "HP1",
							id: heatPumpId,
							productReference: "HEATPUMP-SMALL",
						},
						complete: true,
					}],
					complete: true,
				},

			},
			domesticHotWater: {
				heatSources: {
					data: [{
						data: {
							id: dhwHeatPumpId,
							isExistingHeatSource: true,
							heatSourceId: heatPumpId,
							coldWaterSource: "mainsWater",
						},
						complete: true,
					}],
					complete: true,
				},
				waterStorage: {
					data: [{
						data: {
							name: "HWC1",
							id: hotWaterCylinderId,
							dhwHeatSourceId: dhwHeatPumpId,
							storageCylinderVolume: {
								amount: 1,
								unit: "litres",
							},
							dailyEnergyLoss: 1,
							typeOfWaterStorage: "hotWaterCylinder",
							areaOfHeatExchanger: 1,
							initialTemperature: 20,
						},
						complete: true,
					}],
					complete: true,
				},
			},
			pvAndBatteries: {
				diverters: {
					data: [diverter1],
					complete: true,
				},
			},
		});

		const result = mapPvDiverterData(resolveState(store.$state));

		const expectedResult: Pick<SchemaEnergySupplyElectricity, "diverter"> = {
			diverter: {
				HeatSource: "HP1",
			},
		};

		expect(result).toEqual(expectedResult);
	});
});