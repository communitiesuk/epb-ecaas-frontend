import type { BathData, DomesticHotWaterHeatSourceData, EcaasForm, HeatSourceData, WaterStorageData } from "~/stores/ecaasStore.schema";
import { mapDomesticHotWaterData, mapHotWaterSourcesData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";
import { litre } from "~/utils/units/volume";
import type { SchemaMixerShower } from "~/schema/api-schema.types";
import { celsius } from "~/utils/units/temperature";
import { defaultElectricityEnergySupplyName } from "./common";

const baseForm = {
	data: [],
	complete: true as const,
};

describe("domestic hot water mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	const heatSourceId = "efa1b2c3-d4e5-6789-0123-456789abcdef";
	const heatSourceIdInSH = "efa1b2c3-d4e5-6789-0123-456789abcd12";

	// water storage

	const storageTank = {
		data: {
			typeOfWaterStorage: "hotWaterCylinder",
			dhwHeatSourceId: heatSourceId,
			name: "Hot Water Cylinder",
			id: "efa1b2c3-d4e5-6789-0123-456789abcd11",
			storageCylinderVolume: { amount: 30, unit: "litres" },
			dailyEnergyLoss: 40,
			heaterPosition: 0.2,
			thermostatPosition: 0.8,
		},
		complete: true,
	} as const satisfies EcaasForm<WaterStorageData>;

	const smartHotWaterTank = {
		data: {
			typeOfWaterStorage: "smartHotWaterTank",
			dhwHeatSourceId: heatSourceId,
			name: "Smart Hot Water Tank",
			id: "efa1b2c3-d4e5-6789-0123-456789abcd12",
			heaterPosition: 0.2,
			productReference: "BLOOP-DOOP-123",
		},
		complete: true,
	} as const satisfies EcaasForm<WaterStorageData>;

	// heat sources inputted in DHW

	const heatPump = {
		data: {
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			name: "DHW heatPump",
			typeOfHeatSource: "heatPump",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			productReference: "HP-12345",
			typeOfHeatPump: "airSource",
			//maxFlowTemp: unitValue(17, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const heatBattery = {
		data: {
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			energySupply: "electricity",
			name: "DHW heatBattery",
			typeOfHeatSource: "heatBattery",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			productReference: "HB-12345",
			typeOfHeatBattery: "heatBatteryDryCore",
			numberOfUnits: 1,
			//maxFlowTemp: unitValue(32, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const boiler = {
		data: {
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW boiler",
			coldWaterSource: "mainsWater",
			productReference: "BOIL-12345",
			//maxFlowTemp: unitValue(32, celsius),
			needsSpecifiedLocation: false,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const immersionHeater = {
		data: {
			typeOfHeatSource: "immersionHeater",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW immersion",
			coldWaterSource: "mainsWater",
			//maxFlowTemp: unitValue(32, celsius),
			power: 49,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const solarThermal = {
		data: {
			typeOfHeatSource: "solarThermalSystem",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW immersion",
			coldWaterSource: "mainsWater",
			// maxFlowTemp: unitValue(32, celsius),
			locationOfCollectorLoopPiping: "heatedSpace",
			collectorModuleArea: 24,
			numberOfCollectorModules: 3,
			peakCollectorEfficiency: 0.99,
			incidenceAngleModifier: 42,
			firstOrderHeatLossCoefficient: 0.2,
			secondOrderHeatLossCoefficient: 0.33,
			heatLossCoefficientOfSolarLoopPipe: 0.6,
			collectorMassFlowRate: 29,
			powerOfCollectorPump: { amount: 39, unit: "kilowatt" },
			powerOfCollectorPumpController: { amount: 2, unit: "kilowatt" },
			pitch: 19,
			orientation: 11,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const pointOfUse = {
		data: {
			typeOfHeatSource: "pointOfUse",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW POU",
			coldWaterSource: "mainsWater",
			//maxFlowTemp: unitValue(32, celsius),
			heaterEfficiency: 0.88,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	// heat sources referenced from space heating

	// this can be used to reference any of the heat sources in SH
	const heatSourceReferencingSH = {
		data: {
			id: heatSourceId,
			isExistingHeatSource: true,
			heatSourceId: heatSourceIdInSH,
			coldWaterSource: "mainsWater",
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const heatPumpInSH = {
		data: {
			id: heatSourceIdInSH,
			name: "DHW heatPump",
			typeOfHeatSource: "heatPump",
			productReference: "HP-12345",
			typeOfHeatPump: "airSource",
			//maxFlowTemp: unitValue(17, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<HeatSourceData>;

	const heatBatteryInSH = {
		data: {
			id: heatSourceIdInSH,
			energySupply: "electricity",
			name: "DHW heatBattery",
			typeOfHeatSource: "heatBattery",
			productReference: "HB-12345",
			typeOfHeatBattery: "heatBatteryDryCore",
			numberOfUnits: 1,
			// maxFlowTemp: unitValue(32, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<HeatSourceData>;

	const boilerInSH = {
		data: {
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			id: heatSourceIdInSH,
			name: "DHW boiler",
			productReference: "BOIL-12345",
			// maxFlowTemp: unitValue(32, celsius),
			needsSpecifiedLocation: false,
		},
		complete: true,
	} as const satisfies EcaasForm<HeatSourceData>;

	describe("water storage and heat sources", () => {

		/**
		These are the permutations that we need to consider, in the format:
		[heat source, water storage]

		a * indicates that permutation is being explicitly tested

		if no * is present, all components of that permutation should be 
		included in some other test

		null water storage cases should always be tested because they get 
		mapped differently
		 
		--- heat source defined in DHW ---

	*	[heatPump, storageTank],
		[heatPump, smartHotWaterTank],
		
		[immersionHeater, storageTank],
	*	[immersionHeater, smartHotWaterTank],
		
	*	[solarThermal, storageTank],
		[solarThermal, smartHotWaterTank],
		
		[heatBattery, storageTank],
	*	[heatBattery, smartHotWaterTank],
	*	[heatBattery, null],
		
	*	[boiler, storageTank],
		[boiler, smartHotWaterTank],
	*	[boiler, null],
		
		// TODO
		[heatInterfaceUnit, storageTank],
	*	[heatInterfaceUnit, smartHotWaterTank],
	*	[heatInterfaceUnit, null],

	*	[pointOfUse, null],

		--- heat source defined in SH ---
		
		[heatPumpInSH, storageTank],
	*	[heatPumpInSH, smartHotWaterTank],
		
	*	[heatBatteryInSH, storageTank],
		[heatBatteryInSH, smartHotWaterTank],
	*	[heatBatteryInSH, null],
		
		[boilerInSH, storageTank],
	*	[boilerInSH, smartHotWaterTank],
	*	[boilerInSH, null],
		
		// TODO
	*	[heatInterfaceUnitInSH, storageTank],
		[heatInterfaceUnitInSH, smartHotWaterTank],
	*	[heatInterfaceUnitInSH, null],
		 */

		describe("heat source defined in DHW", () => {
			it.each(
				[
					{ heatSource: heatPump, waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "mains water",
									volume: storageTank.data.storageCylinderVolume.amount,
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[heatPump.data.name]: {
											type: "HeatSourceWet",
											name: heatPump.data.name,
											heater_position: storageTank.data.heaterPosition,
											thermostat_position: storageTank.data.thermostatPosition,
										},
									},
								},
							},
							HeatSourceWet: {
								[heatPump.data.name]: {
									type: "HeatPump",
									is_heat_network: false,
									product_reference: heatPump.data.productReference,
									EnergySupply: "mains elec",
								},
							},
						} as const satisfies Partial<FhsInputSchema>,  
					},		
					{ heatSource: immersionHeater, waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "SmartHotWaterTank",
									EnergySupply_pump: "mains elec",
									product_reference: smartHotWaterTank.data.productReference,
									HeatSource: {
										[immersionHeater.data.name]: {
											type: "ImmersionHeater",
											power: immersionHeater.data.power,
											EnergySupply: "mains elec",
											heater_position: smartHotWaterTank.data.heaterPosition,
										},
									},
								},
							},
						} as const satisfies Partial<FhsInputSchema>,
					},
					{ heatSource: solarThermal, waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "mains water",
									volume: storageTank.data.storageCylinderVolume.amount,
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[solarThermal.data.name]: {
											type: "SolarThermalSystem",
											heater_position: storageTank.data.heaterPosition,
											thermostat_position: storageTank.data.thermostatPosition,
											sol_loc: "HS",
											area_module: solarThermal.data.collectorModuleArea,
											modules: solarThermal.data.numberOfCollectorModules,
											peak_collector_efficiency: solarThermal.data.peakCollectorEfficiency,
											incidence_angle_modifier: solarThermal.data.incidenceAngleModifier,
											first_order_hlc: solarThermal.data.firstOrderHeatLossCoefficient,
											second_order_hlc: solarThermal.data.secondOrderHeatLossCoefficient,
											collector_mass_flow_rate: solarThermal.data.collectorMassFlowRate,
											power_pump: solarThermal.data.powerOfCollectorPump.amount,
											power_pump_control: solarThermal.data.powerOfCollectorPumpController.amount,
											EnergySupply: defaultElectricityEnergySupplyName,
											tilt: solarThermal.data.pitch,
											orientation360: solarThermal.data.orientation,
											solar_loop_piping_hlc: solarThermal.data.heatLossCoefficientOfSolarLoopPipe,
										},
									},
								},
							},
						} as const satisfies Partial<FhsInputSchema>,
					},
					{ heatSource: heatBattery, waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "SmartHotWaterTank",
									EnergySupply_pump: "mains elec",
									product_reference: smartHotWaterTank.data.productReference,
									HeatSource: {
										[heatBattery.data.name]: {
											type: "HeatSourceWet",
											name: heatBattery.data.name,
											heater_position: storageTank.data.heaterPosition,
										},
									},
								},
							},
							HeatSourceWet: {
								[heatBattery.data.name]: {
									type: "HeatBattery",
									is_heat_network: false,
									product_reference: heatBattery.data.productReference,
									EnergySupply: "mains elec",
									battery_type: "dry_core",
									number_of_units: heatBattery.data.numberOfUnits,
								},
							},
						} as const satisfies Partial<FhsInputSchema>, 
					},
					{ heatSource: boiler, waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "mains water",
									volume: storageTank.data.storageCylinderVolume.amount,
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[boiler.data.name]: {
											type: "HeatSourceWet",
											name: boiler.data.name,
											heater_position: storageTank.data.heaterPosition,
											thermostat_position: storageTank.data.thermostatPosition,
										},
									},
								},
							},
							HeatSourceWet: {
								[boiler.data.name]: {
									type: "Boiler",
									is_heat_network: false,
									product_reference: boiler.data.productReference,
									EnergySupply: "mains elec",
								},
							},
						} as const satisfies Partial<FhsInputSchema>,
					},
				// TODO { heatSource: heatInterfaceUnit, waterStorage: smartHotWaterTank },
				],
			)("maps a $heatSource.data.name heat source attached to a $waterStorage.data.name water storage",
				async ({ heatSource, waterStorage, expected }) => {
					store.$patch({
						domesticHotWater: {
							heatSources: {
								data: [heatSource],
								complete: true,
							},
							waterStorage: {
								data: [waterStorage],
								complete: true,
							},
							pipework: {
								data: [],
								complete: true,
							},
						},
					});

					expect(mapHotWaterSourcesData(resolveState(store.$state))).toEqual(expected);
				},
			);

			it.each([
				{ 
					heatSource: heatBattery, expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "HeatBattery",
								HeatSourceWet: heatBattery.data.name,
								ColdWaterSource: "mains water",
							},
						},
						HeatSourceWet: {
							[heatBattery.data.name]: {
								type: "HeatBattery",
								is_heat_network: false,
								product_reference: heatBattery.data.productReference,
								EnergySupply: "mains elec",
								battery_type: "dry_core",
								number_of_units: heatBattery.data.numberOfUnits,
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{ 
					heatSource: boiler, expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "CombiBoiler",
								HeatSourceWet: boiler.data.name,
								ColdWaterSource: "mains water",
							},
						},
						HeatSourceWet: {
							[boiler.data.name]: {
								type: "Boiler",
								is_heat_network: false,
								product_reference: boiler.data.productReference,
								EnergySupply: "mains elec",
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{ heatSource: pointOfUse, expected: {
					HotWaterSource: {
						"hw cylinder": {
							type: "PointOfUse",
							ColdWaterSource: "mains water",
							efficiency: pointOfUse.data.heaterEfficiency,
							EnergySupply: defaultElectricityEnergySupplyName,
						},
					},
				} as const satisfies Partial<FhsInputSchema> },
			// TODO { heatSource: heatInterfaceUnit },
			])("maps a $heatSource.data.name dhw heat source attached to no water storage",
				async ({ heatSource, expected }) => {
					store.$patch({
						domesticHotWater: {
							heatSources: {
								data: [heatSource],
								complete: true,
							},
							waterStorage: {
								data: [],
								complete: true,
							},
							pipework: {
								data: [],
								complete: true,
							},
						},
					});

					expect(mapHotWaterSourcesData(resolveState(store.$state))).toEqual(expected);
				},
			);
		});

		describe.skip("heat source defined in SH", () => {
			it.each(
				[
					{ heatSource: heatPumpInSH, waterStorage: smartHotWaterTank },
					{ heatSource: heatBatteryInSH, waterStorage: storageTank },
					{ heatSource: boilerInSH, waterStorage: smartHotWaterTank },
					// TODO { heatSource: heatInterfaceUnitInSH, waterStorage: storageTank },
				],
			)("maps a $heatSource.data.name dhw heat source attached to a $waterStorage.data.name water storage",
				async ({ heatSource, waterStorage }) => {
					store.$patch({
						spaceHeating: {
							heatSource: {
								data: [heatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							heatSources: {
								data: [heatSourceReferencingSH],
								complete: true,
							},
							waterStorage: {
								data: [waterStorage],
								complete: true,
							},
						},
					});
				},
			);

			it.each([
				{ heatSource: heatBatteryInSH },
				{ heatSource: boilerInSH },
				// TODO { heatSource: heatInterfaceUnitInSH },
			])("maps a $heatSource.data.name dhw heat source attached to no water storage",
				async ({ heatSource }) => {
					store.$patch({
						spaceHeating: {
							heatSource: {
								data: [heatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							heatSources: {
								data: [heatSourceReferencingSH],
								complete: true,
							},
						},
					});
				},
			);
		});

		it.skip("maps hot water cylinder input state with max flow temp to FHS input request", () => {
			// Arrange
			const hotWaterCylinder: EcaasForm<WaterStorageData> = {
				...baseForm,
				data: {
					id: "hot water cylinder",
					typeOfWaterStorage: "hotWaterCylinder",
					name: "hot water cylinder",
					storageCylinderVolume: unitValue(90, litre),
					dailyEnergyLoss: 5,
					dhwHeatSourceId: heatSourceId,
					areaOfHeatExchanger: 2,
					heaterPosition: 0.3,
					thermostatPosition: 0.5,
				},
			};

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [hotWaterCylinder],
						complete: true,
					},
					heatSources: {
						data: [heatBattery],
						complete: true,
					},
					pipework: {
						data: [],
						complete: true,
					},
				},
			});

			// Acts
			const result = mapHotWaterSourcesData(resolveState(store.$state)).HotWaterSource["hw cylinder"];
			const expectedResult: Partial<FhsInputSchema["HotWaterSource"]["hw cylinder"]> = {
				ColdWaterSource: "mains water",
				HeatSource: {
					[heatBattery.data.name]: {
						heater_position: 0.3,
						type: "HeatSourceWet",
						name: heatBattery.data.name,
						thermostat_position: 0.5,
						temp_flow_limit_upper: 32,
					},
				},
				daily_losses: 5,
				volume: 90,
				type: "StorageTank",
				init_temp: 60,
			};

			// Assert
			expect(result).toEqual(expectedResult);
		});

		describe.skip("using a previously added heat source", () => {
			const existingHeatPump = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
					name: "Heat pump space",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP-LARGE",
					maxFlowTemp: unitValue(1, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const dhwWithExistingHeatPump = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c62",
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingHeatPump.data.id,
					maxFlowTemp: unitValue(50, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			const existingBoiler = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c37",
					name: "Boiler space",
					typeOfHeatSource: "boiler",
					typeOfBoiler: "combiBoiler",
					productReference: "174",
					needsSpecifiedLocation: true,
					maxFlowTemp: unitValue(5, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const dhwWithExistingBoiler = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c68",
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingBoiler.data.id,
					maxFlowTemp: unitValue(40, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			const existingBattery = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c44",
					name: "Heat battery space",
					typeOfHeatSource: "heatBattery",
					typeOfHeatBattery: "heatBatteryPcm",
					productReference: "179",
					numberOfUnits: 1,
					energySupply: "electricity",
					maxFlowTemp: unitValue(11, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const dhwWithExistingBattery = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c46",
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingBattery.data.id,
					maxFlowTemp: unitValue(31, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			it.each([[existingHeatPump, dhwWithExistingHeatPump], [existingBoiler, dhwWithExistingBoiler], [existingBattery, dhwWithExistingBattery]]) (
				"maps hot water cylinder input state to FHS input request with correct max flow temp", async (existingHeatSource, dhwWithExistingHeatSource) => {
					const hotWaterCylinder: EcaasForm<WaterStorageData> = {
						...baseForm,
						data: {
							id: "hot water cylinder",
							typeOfWaterStorage: "hotWaterCylinder",
							name: "hot water cylinder",
							storageCylinderVolume: unitValue(90, litre),
							dailyEnergyLoss: 5,
							dhwHeatSourceId: dhwWithExistingHeatSource.data.id,
							areaOfHeatExchanger: 2,
							heaterPosition: 0.3,
							thermostatPosition: 0.5,
						},
					};

					store.$patch({
						spaceHeating: {
							heatSource: {
								data: [existingHeatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							waterStorage: {
								data: [hotWaterCylinder],
								complete: true,
							},
							heatSources: {
								data: [dhwWithExistingHeatSource],
								complete: true,
							},
							pipework: {
								data: [],
								complete: true,
							},
						},
					});

					const result = mapHotWaterSourcesData(resolveState(store.$state)).HotWaterSource["hw cylinder"];
					const expectedResult: Partial<FhsInputSchema["HotWaterSource"]["hw cylinder"]> = {
						ColdWaterSource: "mains water",
						HeatSource: {
							[existingHeatSource.data.name]: {
								heater_position: 0.3,
								type: "HeatSourceWet",
								name: existingHeatSource.data.name,
								thermostat_position: 0.5,
								temp_flow_limit_upper: dhwWithExistingHeatSource.data.maxFlowTemp.amount,
							},
						},
						daily_losses: 5,
						volume: 90,
						type: "StorageTank",
						init_temp: 60,
					};

					expect(result).toEqual(expectedResult);
				});
		});
	});

	describe("outlets", () => {
		it("maps hot water outlets input state to FHS input request", () => {
			// Arrange
			const mixedShower: EcaasForm<MixedShowerData> = {
				...baseForm,
				data: {
					id: "shower1",
					name: "shower1",
					flowRate: 3,
					dhwHeatSourceId: heatSourceId,
					typeOfHotWaterOutlet: "mixedShower",
					wwhrs: false,
					isAirPressureShower: false,
				},
			};

			const electricShower: EcaasForm<ElectricShowerData> = {
				...baseForm,
				data: {
					id: "shower2",
					name: "shower2",
					ratedPower: 10,
					typeOfHotWaterOutlet: "electricShower",
				},
			};

			const bath: EcaasForm<BathData> = {
				...baseForm,
				data: {
					id: "bath1",
					name: "bath1",
					size: 70,
					typeOfHotWaterOutlet: "bath",

				},
			};

			const other: EcaasForm<OtherHotWaterOutletData> = {
				...baseForm,
				data: {
					id: "other1",
					name: "other1",
					flowRate: 4,
					typeOfHotWaterOutlet: "otherHotWaterOutlet",
				},
			};

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [storageTank],
						complete: true,
					},
					hotWaterOutlets: { data: [mixedShower, electricShower, bath, other], complete: true },
					pipework: {
						data: [],
						complete: true,
					},
					heatSources: {
						data: [heatPump],
						complete: true,
					},
				},
			});

			// Acts
			const result = mapDomesticHotWaterData(resolveState(store.$state));

			// Assert
			const expectedResult: Pick<FhsInputSchema, "HotWaterDemand"> = {
				HotWaterDemand: {
					Shower: {
						"shower1": {
							type: "MixerShower",
							flowrate: 3,
							allow_low_flowrate: false,
							ColdWaterSource: "mains water",
							HotWaterSource: heatPump.data.name,
						},
						"shower2": {
							type: "InstantElecShower",
							rated_power: 10,
							ColdWaterSource: "mains water",
							EnergySupply: "mains elec",
						},
					},
					Bath: {
						"bath1": {
							ColdWaterSource: "mains water",
							size: 70,
						},
					},
					Other: {
						"other1": {
							ColdWaterSource: "mains water",
							flowrate: 4,
						},
					},
				},
			};

			expect(result["HotWaterDemand"]).toEqual(expectedResult["HotWaterDemand"]);
		});

		describe("mixed showers with WWHRS", () => {
			it("maps WWHRS configuration type A", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-a",
						name: "shower-wwhrs-a",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW-A-123",
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [boiler], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShower: SchemaMixerShower = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					allow_low_flowrate: false,
					HotWaterSource: boiler.data.name,
					WWHRS: "WW-A-123",
					WWHRS_configuration: "A",
				};

				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-a"]).toEqual(expectedShower);
			});

			it("maps WWHRS configuration type B", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-b",
						name: "shower-wwhrs-b",
						flowRate: 9,
						wwhrs: true,
						wwhrsType: "instantaneousSystemB",
						wwhrsProductReference: "WW-B-456",
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [heatBattery], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShowerWwhrsB = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 9,
					allow_low_flowrate: false,
					HotWaterSource: heatBattery.data.name,
					WWHRS: "WW-B-456",
					WWHRS_configuration: "B",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-b"]).toEqual(expectedShowerWwhrsB);
			});

			it("maps WWHRS configuration type C", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-c",
						name: "shower-wwhrs-c",
						flowRate: 10,
						wwhrs: true,
						wwhrsType: "instantaneousSystemC",
						wwhrsProductReference: "WW-C-789",
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [boiler], complete: true },
						waterStorage: { data: [storageTank], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShowerWwhrsC = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 10,
					allow_low_flowrate: false,
					HotWaterSource: boiler.data.name,
					WWHRS: "WW-C-789",
					WWHRS_configuration: "C",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-c"]).toEqual(expectedShowerWwhrsC);
			});

			it("maps mixed shower with air pump", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-air-pump",
						name: "shower-air-pump",
						wwhrs: false,
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: true,
						airPressureShowerProductReference: "AIR-PUMP-123",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [heatPump], complete: true },
						waterStorage: { data: [storageTank], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShowerAirPump = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					allow_low_flowrate: true,
					HotWaterSource: heatPump.data.name,
					product_reference: "AIR-PUMP-123",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower-air-pump"]).toEqual(expectedShowerAirPump);
			});

		});

		describe("mixed showers without WWHRS", () => {
			it("maps mixed shower with hotWaterSource but no WWHRS", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-no-wwhrs",
						name: "shower-no-wwhrs",
						flowRate: 7,
						wwhrs: false,
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [heatPump], complete: true },
						waterStorage: { data: [storageTank], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const shower = result.HotWaterDemand?.Shower?.["shower-no-wwhrs"];
				const expectedShowerNoWwhrs = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 7,
					allow_low_flowrate: false,
					HotWaterSource: heatPump.data.name,
				} as const satisfies SchemaMixerShower;
				expect(shower).toEqual(expectedShowerNoWwhrs);
				expect(shower).not.toHaveProperty("WWHRS");
				expect(shower).not.toHaveProperty("WWHRS_configuration");
			});
		});



		describe("edge cases", () => {
			//not sure it should handle empty arrays actually - maybe just throw?
			it("handles empty outlet arrays", () => {
				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [heatPump], complete: true },
						waterStorage: { data: [storageTank], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower).toEqual({});
				expect(result.HotWaterDemand?.Bath).toEqual({});
				expect(result.HotWaterDemand?.Other).toEqual({});
			});

			it("handles multiple outlets with varied configurations", () => {
				const mixedShowerWithWwhrs: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower1",
						name: "shower1",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW123",
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				const mixedShowerNoWwhrs: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower2",
						name: "shower2",
						flowRate: 6,
						wwhrs: false,
						dhwHeatSourceId: heatSourceId,
						typeOfHotWaterOutlet: "mixedShower",
						isAirPressureShower: false,
					},
				};

				const electricShower: EcaasForm<ElectricShowerData> = {
					...baseForm,
					data: {
						id: "elec1",
						name: "elec1",
						ratedPower: 9.5,
						typeOfHotWaterOutlet: "electricShower",
					},
				};

				// const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
				// 	...baseForm,
				// 	data: {
				// 		id: "dhwsource1",
				// 		isExistingHeatSource: true,
				// 		heatSourceId: "source1",
				// 		coldWaterSource: "mainsWater",
				// 	},
				// };

				const hwSource2: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: heatSourceId,
						isExistingHeatSource: false,
						heatSourceId: "NEW_HEAT_SOURCE",
						coldWaterSource: "mainsWater",
						typeOfHeatSource: "heatPump",
						name: "source2",
						productReference: "HP-67890",
						typeOfHeatPump: "groundSource",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: {
							data: [mixedShowerWithWwhrs, mixedShowerNoWwhrs, electricShower],
							complete: true,
						},
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource2], complete: true },
						waterStorage: { data: [storageTank], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShower1 = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					allow_low_flowrate: false,
					HotWaterSource: "source2",
					WWHRS: "WW123",
					WWHRS_configuration: "A",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower1"]).toEqual(expectedShower1);

				const expectedShower2 = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 6,
					allow_low_flowrate: false,
					HotWaterSource: "source2",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower2"]).toEqual(expectedShower2);

				expect(result.HotWaterDemand?.Shower?.["elec1"]).toEqual({
					type: "InstantElecShower",
					ColdWaterSource: "mains water",
					rated_power: 9.5,
					EnergySupply: "mains elec",
				});
			});
		});
	});
});