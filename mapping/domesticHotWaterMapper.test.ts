import type { BathData, DomesticHotWaterHeatSourceData, EcaasForm, HeatSourceData, WaterStorageData, WwhrsData } from "~/stores/ecaasStore.schema";
import { defaultColdWaterSourceData, mapDomesticHotWaterData, mapHotWaterSourcesData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";
import type { SchemaMixerShower } from "~/schema/api-schema.types";
import { celsius } from "~/utils/units/temperature";
import { defaultElectricityEnergySupplyName } from "./common";
import { kilowatt } from "~/utils/units/power";

const baseForm = {
	data: [],
	complete: true as const,
};

describe("domestic hot water mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});
	
	const coldWaterSourceMainsWater: Pick<FhsInputSchema, "ColdWaterSource"> = {
		ColdWaterSource: {
			["mains water"]: defaultColdWaterSourceData,
		},
	};

	const coldWaterSourceHeaderTank: Pick<FhsInputSchema, "ColdWaterSource"> = {
		ColdWaterSource: {
			["header tank"]: defaultColdWaterSourceData,
		},
	};

	const heatSourceId = "efa1b2c3-d4e5-6789-0123-456789abcdef";
	const heatSourceIdInSH = "efa1b2c3-d4e5-6789-0123-456789abcd12";

	const heatNetwork: EcaasForm<HeatNetworkData> = {
		data: {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
			name: "Heat Network",
			productReference: "42",
			typeOfHeatNetwork: "communalHeatNetwork",
		},
		complete: true,
	};
	// water storage

	const storageTank = {
		data: {
			typeOfWaterStorage: "hotWaterCylinder",
			name: "Hot Water Cylinder",
			id: "efa1b2c3-d4e5-6789-0123-456789abcd11",
			storageCylinderVolume: { amount: 30, unit: "litres" },
			dailyEnergyLoss: 40,
			heaterPosition: 0.2,
			thermostatPosition: 0.8,
		},
		complete: true,
	} as const satisfies EcaasForm<WaterStorageData>;

	const storageTankWithHeatEx = {
		data: {
			...storageTank.data,
			areaOfHeatExchanger: 42,
		},
		complete: true,
	} as const satisfies EcaasForm<WaterStorageData>;

	const smartHotWaterTank = {
		data: {
			typeOfWaterStorage: "smartHotWaterTank",
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
			maxFlowTemp: unitValue(17, celsius),
			isConnectedToHeatNetwork: false,
			energySupply: "electricity",
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const heatPumpHWOnly = {
		data: {
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			name: "DHW HW Only Heat Pump",
			typeOfHeatSource: "heatPump",
			coldWaterSource: "headerTank",
			isExistingHeatSource: false,
			productReference: "HP-12346",
			typeOfHeatPump: "hotWaterOnly",
			isConnectedToHeatNetwork: false,
			energySupply: "mains_gas",
			maxFlowTemp: unitValue(17, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const heatInterfaceUnit = {
		data: {
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			name: "DHW HIU HW Only",
			typeOfHeatSource: "heatInterfaceUnit",
			coldWaterSource: "headerTank",
			isExistingHeatSource: false,
			productReference: "HIU-12346",
			associatedHeatNetworkId: heatNetwork.data.id,
			buildingLevelLosses: unitValue(0.5, kilowatt),
			maxFlowTemp: unitValue(17, celsius),
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
			maxFlowTemp: unitValue(32, celsius),
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const combiBoiler = {
		data: {
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW boiler",
			coldWaterSource: "mainsWater",
			productReference: "BOIL-12345",
			maxFlowTemp: unitValue(32, celsius),
			needsSpecifiedLocation: false,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const regularBoiler = {
		data: {
			typeOfHeatSource: "boiler",
			typeOfBoiler: "regularBoiler",
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			isExistingHeatSource: false,
			name: "DHW boiler",
			coldWaterSource: "mainsWater",
			productReference: "BOIL-12345",
			maxFlowTemp: unitValue(32, celsius),
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
			heaterEfficiency: 0.88,
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const wwhrs: EcaasForm<WwhrsData> = {
		...baseForm,
		data: {
			id: "7947d8c7-5379-4d38-9138-27bf86da3001",
			name: "WWHRS",
			coldWaterSource: "mainsWater",
			productReference: "1000",
		},
	};

	describe("water storage and heat sources", () => {

		/**
		These are the permutations that we need to consider, in the format:
		[heat source, water storage]
	
		a * indicates that permutation is being explicitly tested
	
		if no * is present, each component of that permutation should be 
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
		
		// TODO HIUs
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
		
		// TODO HIUs
	*	[heatInterfaceUnitInSH, storageTank],
		[heatInterfaceUnitInSH, smartHotWaterTank],
	*	[heatInterfaceUnitInSH, null],
		 */

		describe("heat source defined in DHW", () => {
			it.each(
				[
					{
						heatSource: heatPump, waterStorage: storageTank,
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
											temp_flow_limit_upper: heatPump.data.maxFlowTemp.amount,
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
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: heatPumpHWOnly, waterStorage: storageTankWithHeatEx,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "header tank",
									volume: storageTankWithHeatEx.data.storageCylinderVolume.amount,
									daily_losses: storageTankWithHeatEx.data.dailyEnergyLoss,
									heat_exchanger_surface_area: storageTankWithHeatEx.data.areaOfHeatExchanger,
									HeatSource: {
										[heatPumpHWOnly.data.name]: {
											type: "HeatPump_HWOnly",
											heater_position: storageTankWithHeatEx.data.heaterPosition,
											thermostat_position: storageTankWithHeatEx.data.thermostatPosition,
											product_reference: heatPumpHWOnly.data.productReference,
										},
									},
								},
							},
							ColdWaterSource: coldWaterSourceHeaderTank.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: immersionHeater, waterStorage: smartHotWaterTank,
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
									ColdWaterSource: "mains water",
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: solarThermal, waterStorage: storageTank,
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
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: heatBattery, waterStorage: smartHotWaterTank,
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
											temp_flow_limit_upper: heatBattery.data.maxFlowTemp.amount,
										},
									},
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
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: combiBoiler, waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "mains water",
									volume: storageTank.data.storageCylinderVolume.amount,
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[combiBoiler.data.name]: {
											type: "HeatSourceWet",
											name: combiBoiler.data.name,
											heater_position: storageTank.data.heaterPosition,
											thermostat_position: storageTank.data.thermostatPosition,
											temp_flow_limit_upper: combiBoiler.data.maxFlowTemp.amount,
										},
									},
								},
							},
							HeatSourceWet: {
								[combiBoiler.data.name]: {
									type: "Boiler",
									is_heat_network: false,
									product_reference: combiBoiler.data.productReference,
									EnergySupply: "mains elec",
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: heatInterfaceUnit, waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "SmartHotWaterTank",
									EnergySupply_pump: "mains elec",
									product_reference: smartHotWaterTank.data.productReference,
									HeatSource: {
										[heatInterfaceUnit.data.name]: {
											type: "HeatSourceWet",
											heater_position: smartHotWaterTank.data.heaterPosition,
											temp_flow_limit_upper: heatInterfaceUnit.data.maxFlowTemp.amount,
											name: heatInterfaceUnit.data.name,
										},
									},
									ColdWaterSource: "mains water",
								},
							},
							HeatSourceWet: {
								[heatInterfaceUnit.data.name]: {
									type: "HIU",
									is_heat_network: true,
									product_reference: heatInterfaceUnit.data.productReference,
									heat_network_reference: heatNetwork.data.name,
									EnergySupply: defaultElectricityEnergySupplyName,
									building_level_distribution_losses: heatInterfaceUnit.data.buildingLevelLosses.amount,
									heat_network_type: "communal",
									sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: heatInterfaceUnit, waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "header tank",
									volume: storageTankWithHeatEx.data.storageCylinderVolume.amount,
									daily_losses: storageTankWithHeatEx.data.dailyEnergyLoss,
									HeatSource: {
										[heatInterfaceUnit.data.name]: {
											type: "HeatSourceWet",
											name: heatInterfaceUnit.data.name,
											heater_position: storageTankWithHeatEx.data.heaterPosition,
											temp_flow_limit_upper: heatInterfaceUnit.data.maxFlowTemp.amount,
											thermostat_position: storageTankWithHeatEx.data.thermostatPosition,
										},
									},
								},
							},
							HeatSourceWet: {
								[heatInterfaceUnit.data.name]: {
									type: "HIU",
									is_heat_network: true,
									product_reference: heatInterfaceUnit.data.productReference,
									heat_network_reference: heatNetwork.data.name,
									sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
									EnergySupply: defaultElectricityEnergySupplyName,
									building_level_distribution_losses: heatInterfaceUnit.data.buildingLevelLosses.amount,
									heat_network_type: "communal",
								},
							},
							ColdWaterSource: coldWaterSourceHeaderTank.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: heatInterfaceUnit, waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "SmartHotWaterTank",
									EnergySupply_pump: "mains elec",
									product_reference: smartHotWaterTank.data.productReference,
									HeatSource: {
										[heatInterfaceUnit.data.name]: {
											type: "HeatSourceWet",
											heater_position: smartHotWaterTank.data.heaterPosition,
											temp_flow_limit_upper: heatInterfaceUnit.data.maxFlowTemp.amount,
											name: heatInterfaceUnit.data.name,
										},
									},
									ColdWaterSource: "mains water",
								},
							},
							HeatSourceWet: {
								[heatInterfaceUnit.data.name]: {
									type: "HIU",
									is_heat_network: true,
									product_reference: heatInterfaceUnit.data.productReference,
									heat_network_reference: heatNetwork.data.name,
									sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
									EnergySupply: defaultElectricityEnergySupplyName,
									building_level_distribution_losses: heatInterfaceUnit.data.buildingLevelLosses.amount,
									heat_network_type: "communal",
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
				],
			)("maps a $heatSource.data.typeOfHeatSource heat source attached to a $waterStorage.data.typeOfWaterStorage water storage",
				async ({ heatSource, waterStorage, expected }) => {
					store.$patch({
						spaceHeating: {
							heatNetworks: {
								data: [heatNetwork],
								complete: true,
							},
						},
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
					heatSource: combiBoiler, expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "CombiBoiler",
								HeatSourceWet: combiBoiler.data.name,
								ColdWaterSource: "mains water",
							},
						},
						HeatSourceWet: {
							[combiBoiler.data.name]: {
								type: "Boiler",
								is_heat_network: false,
								product_reference: combiBoiler.data.productReference,
								EnergySupply: "mains elec",
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{
					heatSource: pointOfUse, expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "PointOfUse",
								ColdWaterSource: "mains water",
								efficiency: pointOfUse.data.heaterEfficiency,
								EnergySupply: defaultElectricityEnergySupplyName,
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{
					heatSource: heatInterfaceUnit, expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "HIU",
								HeatSourceWet: heatInterfaceUnit.data.name,
								ColdWaterSource: "header tank",
							},
						},
						HeatSourceWet: {
							[heatInterfaceUnit.data.name]: {
								type: "HIU",
								is_heat_network: true,
								product_reference: heatInterfaceUnit.data.productReference,
								heat_network_reference: heatNetwork.data.name,
								EnergySupply: defaultElectricityEnergySupplyName,
								building_level_distribution_losses: heatInterfaceUnit.data.buildingLevelLosses.amount,
								heat_network_type: "communal",
								sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
			])("maps a $heatSource.data.typeOfHeatSource dhw heat source attached to no water storage",
				async ({ heatSource, expected }) => {
					store.$patch({
						spaceHeating: {
							heatNetworks: {
								data: [heatNetwork],
								complete: true,
							},
						},
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

			it.each([
				{
					name: "regular boiler",
					heatSource: regularBoiler,
				},
				{
					name: "heat pump",
					heatSource: heatPump,
				},
				{
					name: "solar thermal system",
					heatSource: solarThermal,
				},
				{
					name: "immersion heater",
					heatSource: immersionHeater,
				},
			])("throws an error when given a $name without any water storage",
				async ({ heatSource }) => {
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

					expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
						.toThrow("Selected hot water heat source requires water storage - no water storage present");
				},
			);

			it("throws an error when given a point of use heat source with water storage",
				async () => {
					store.$patch({
						domesticHotWater: {
							heatSources: {
								data: [pointOfUse],
								complete: true,
							},
							waterStorage: {
								data: [storageTank],
								complete: true,
							},
							pipework: {
								data: [],
								complete: true,
							},
						},
					});

					expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
						.toThrow("Cannot have a point of use heat source heating a hot water cylinder or smart hot water tank");
				},
			);

			it("throws an error when given a hot water only heat pump and a hw cylinder with no heat exchanger area",
				async () => {
					store.$patch({
						domesticHotWater: {
							heatSources: {
								data: [heatPumpHWOnly],
								complete: true,
							},
							waterStorage: {
								data: [storageTank],
								complete: true,
							},
							pipework: {
								data: [],
								complete: true,
							},
						},
					});

					expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
						.toThrow("Area of heat exchanger must be provided when using a hot water only heat pump");
				},
			);
		});

		describe("heat source defined in SH", () => {
			const existingHeatPump = {
				data: {
					id: heatSourceIdInSH,
					name: "Heat pump space",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP-LARGE",
					maxFlowTemp: unitValue(1, celsius),
					isConnectedToHeatNetwork: false,
					energySupply: "electricity",
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const dhwWithExistingHeatPump = {
				data: {
					id: heatSourceId,
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingHeatPump.data.id,
					maxFlowTemp: unitValue(50, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			const existingCombiBoiler = {
				data: {
					id: heatSourceIdInSH,
					name: "Boiler space",
					typeOfHeatSource: "boiler",
					typeOfBoiler: "combiBoiler",
					productReference: "174",
					needsSpecifiedLocation: false,
					maxFlowTemp: unitValue(5, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const existingRegularBoiler = {
				data: {
					id: heatSourceIdInSH,
					name: "Regular ol' boiler",
					typeOfHeatSource: "boiler",
					typeOfBoiler: "regularBoiler",
					productReference: "189",
					needsSpecifiedLocation: false,
					maxFlowTemp: unitValue(72, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;

			const dhwWithExistingBoiler = {
				data: {
					id: heatSourceId,
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingCombiBoiler.data.id,
					maxFlowTemp: unitValue(40, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			const existingBattery = {
				data: {
					id: heatSourceIdInSH,
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
					id: heatSourceId,
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: existingBattery.data.id,
					maxFlowTemp: unitValue(31, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;
			const heatInterfaceUnitInSH = {
				data: {
					id: "heat-interface-unit-123",
					typeOfHeatSource: "heatInterfaceUnit",
					name: "Heat Interface Unit 123",
					associatedHeatNetworkId: "heat-network-123",
					productReference: "HIU-12345",
					buildingLevelLosses: unitValue(0.5, kilowatt),
					maxFlowTemp: unitValue(17, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;
			const dhwWithExistingHIU = {
				data: {
					id: heatSourceId,
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: heatInterfaceUnitInSH.data.id,
					maxFlowTemp: unitValue(31, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;
			it.each(
				[
					{
						heatSource: existingHeatPump,
						dhwHeatSource: dhwWithExistingHeatPump,
						waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									EnergySupply_pump: defaultElectricityEnergySupplyName,
									HeatSource: {
										[existingHeatPump.data.name]: {
											heater_position: smartHotWaterTank.data.heaterPosition,
											name: existingHeatPump.data.name,
											type: "HeatSourceWet",
											temp_flow_limit_upper: dhwWithExistingHeatPump.data.maxFlowTemp.amount,
										},
									},
									ColdWaterSource: "mains water",
									product_reference: smartHotWaterTank.data.productReference,
									type: "SmartHotWaterTank",
								},
							},
							HeatSourceWet: {
								[existingHeatPump.data.name]: {
									EnergySupply: defaultElectricityEnergySupplyName,
									is_heat_network: false,
									product_reference: existingHeatPump.data.productReference,
									type: "HeatPump",
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: existingBattery,
						dhwHeatSource: dhwWithExistingBattery,
						waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									ColdWaterSource: "mains water",
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[existingBattery.data.name]: {
											heater_position: storageTank.data.heaterPosition,
											name: existingBattery.data.name,
											type: "HeatSourceWet",
											thermostat_position: storageTank.data.thermostatPosition,
											temp_flow_limit_upper: dhwWithExistingBattery.data.maxFlowTemp.amount,
										},
									},
									type: "StorageTank",
									volume: storageTank.data.storageCylinderVolume.amount,
								},
							},
							HeatSourceWet: {
								[existingBattery.data.name]: {
									EnergySupply: defaultElectricityEnergySupplyName,
									is_heat_network: false,
									product_reference: existingBattery.data.productReference,
									type: "HeatBattery",
									battery_type: "pcm",
									number_of_units: existingBattery.data.numberOfUnits,
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					{
						heatSource: existingCombiBoiler,
						dhwHeatSource: dhwWithExistingBoiler,
						waterStorage: smartHotWaterTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									EnergySupply_pump: defaultElectricityEnergySupplyName,
									HeatSource: {
										[existingCombiBoiler.data.name]: {
											heater_position: smartHotWaterTank.data.heaterPosition,
											name: existingCombiBoiler.data.name,
											type: "HeatSourceWet",
											temp_flow_limit_upper: dhwWithExistingBoiler.data.maxFlowTemp.amount,
										},
									},
									ColdWaterSource: "mains water",
									product_reference: smartHotWaterTank.data.productReference,
									type: "SmartHotWaterTank",
								},
							},
							HeatSourceWet: {
								[existingCombiBoiler.data.name]: {
									EnergySupply: defaultElectricityEnergySupplyName,
									is_heat_network: false,
									product_reference: existingCombiBoiler.data.productReference,
									type: "Boiler",
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
					// HIU in SH
					{
						heatSource: heatInterfaceUnitInSH,
						dhwHeatSource: dhwWithExistingHIU,
						waterStorage: storageTank,
						expected: {
							HotWaterSource: {
								"hw cylinder": {
									type: "StorageTank",
									ColdWaterSource: "mains water",
									volume: storageTank.data.storageCylinderVolume.amount,
									daily_losses: storageTank.data.dailyEnergyLoss,
									HeatSource: {
										[heatInterfaceUnitInSH.data.name]: {
											type: "HeatSourceWet",
											heater_position: storageTank.data.heaterPosition,
											thermostat_position: storageTank.data.thermostatPosition,
											name: heatInterfaceUnitInSH.data.name,
											temp_flow_limit_upper: dhwWithExistingHIU.data.maxFlowTemp.amount,
										},
									},
								},
							},
							HeatSourceWet: {
								[heatInterfaceUnitInSH.data.name]: {
									type: "HIU",
									is_heat_network: true,
									product_reference: heatInterfaceUnitInSH.data.productReference,
									heat_network_reference: heatNetwork.data.name,
									EnergySupply: defaultElectricityEnergySupplyName,
									building_level_distribution_losses: heatInterfaceUnitInSH.data.buildingLevelLosses.amount,
									heat_network_type: "communal",
									sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
								},
							},
							ColdWaterSource: coldWaterSourceMainsWater.ColdWaterSource,
						} as const satisfies Partial<FhsInputSchema>,
					},
				],
			)("maps a $heatSource.data.typeOfHeatSource dhw heat source attached to a $waterStorage.data.typeOfWaterStorage water storage",
				async ({ heatSource, dhwHeatSource, waterStorage, expected }) => {
					store.$patch({
						spaceHeating: {
							heatNetworks: {
								data: [heatNetwork],
								complete: true,
							},
							heatSource: {
								data: [heatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							heatSources: {
								data: [dhwHeatSource],
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

					const result = mapHotWaterSourcesData(resolveState(store.$state));

					expect(result).toEqual(expected);
				},
			);

			it("throws an explicit error when there is no non-heat-network DHW reference heat source", async () => {
				store.$patch({
					spaceHeating: {
						heatNetworks: {
							data: [heatNetwork],
							complete: true,
						},
						heatSource: {
							data: [existingHeatPump],
							complete: true,
						},
					},
					domesticHotWater: {
						waterStorage: {
							data: [storageTank],
							complete: true,
						},
						pipework: {
							data: [],
							complete: true,
						},
					},
				});

				expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
					.toThrow("Expected exactly one non-heat-network heat source, found 0");
			});

			it("throws an explicit error when more than one non-heat-network DHW reference heat source exists", async () => {
				store.$patch({
					domesticHotWater: {
						heatSources: {
							data: [heatPump, heatBattery],
							complete: true,
						},
						waterStorage: {
							data: [storageTank],
							complete: true,
						},
						pipework: {
							data: [],
							complete: true,
						},
					},
				});

				expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
					.toThrow("Expected exactly one non-heat-network heat source, found 2");
			});

			it.each([
				{
					heatSource: existingBattery, dhwHeatSource: dhwWithExistingBattery,
					expected: {
						HotWaterSource: {
							"hw cylinder": {
								ColdWaterSource: "mains water",
								HeatSourceWet: existingBattery.data.name,
								type: "HeatBattery",
							},
						},
						HeatSourceWet: {
							[existingBattery.data.name]: {
								EnergySupply: defaultElectricityEnergySupplyName,
								battery_type: "pcm",
								is_heat_network: false,
								number_of_units: existingBattery.data.numberOfUnits,
								product_reference: existingBattery.data.productReference,
								type: "HeatBattery",
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{
					heatSource: existingCombiBoiler, dhwHeatSource: dhwWithExistingBoiler,
					expected: {
						HotWaterSource: {
							"hw cylinder": {
								ColdWaterSource: "mains water",
								HeatSourceWet: existingCombiBoiler.data.name,
								type: "CombiBoiler",
							},
						},
						HeatSourceWet: {
							[existingCombiBoiler.data.name]: {
								EnergySupply: defaultElectricityEnergySupplyName,
								is_heat_network: false,
								product_reference: existingCombiBoiler.data.productReference,
								type: "Boiler",
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
				{
					heatSource: heatInterfaceUnitInSH, dhwHeatSource: dhwWithExistingHIU,
					expected: {
						HotWaterSource: {
							"hw cylinder": {
								type: "HIU",
								HeatSourceWet: heatInterfaceUnitInSH.data.name,
								ColdWaterSource: "mains water",
							},
						},
						HeatSourceWet: {
							[heatInterfaceUnitInSH.data.name]: {
								type: "HIU",
								is_heat_network: true,
								product_reference: heatInterfaceUnitInSH.data.productReference,
								heat_network_reference: heatNetwork.data.name,
								building_level_distribution_losses: heatInterfaceUnitInSH.data.buildingLevelLosses.amount,
								EnergySupply: defaultElectricityEnergySupplyName,
								heat_network_type: "communal",
								sub_heat_network_name: heatNetwork.data.subHeatNetworkName,
							},
						},
					} as const satisfies Partial<FhsInputSchema>,
				},
			])("maps a $heatSource.data.typeOfHeatSource dhw heat source attached to no water storage",
				async ({ heatSource, dhwHeatSource, expected }) => {
					store.$patch({
						spaceHeating: {
							heatNetworks: {
								data: [heatNetwork],
								complete: true,
							},
							heatSource: {
								data: [heatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							heatSources: {
								data: [dhwHeatSource],
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

					const result = mapHotWaterSourcesData(resolveState(store.$state));

					expect(result).toEqual(expected);
				},
			);

			it.each([
				{
					name: "regular boiler",
					heatSource: existingRegularBoiler,
					dhwHeatSource: dhwWithExistingBoiler,
				},
				{
					name: "heat pump",
					heatSource: existingHeatPump,
					dhwHeatSource: dhwWithExistingHeatPump,
				},
			])("throws an error when given a $name without any water storage",
				async ({ heatSource, dhwHeatSource }) => {
					store.$patch({
						spaceHeating: {
							heatSource: {
								data: [heatSource],
								complete: true,
							},
						},
						domesticHotWater: {
							heatSources: {
								data: [dhwHeatSource],
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

					expect(() => mapHotWaterSourcesData(resolveState(store.$state)))
						.toThrow("Selected hot water heat source requires water storage - no water storage present");
				},
			);
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
					typeOfHotWaterOutlet: "mixedShower",
					coldWaterSource: "mainsWater",
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
					coldWaterSource: "mainsWater",
				},
			};

			const bath: EcaasForm<BathData> = {
				...baseForm,
				data: {
					id: "bath1",
					name: "bath1",
					size: 70,
					typeOfHotWaterOutlet: "bath",
					coldWaterSource: "mainsWater",
				},
			};

			const other: EcaasForm<OtherHotWaterOutletData> = {
				...baseForm,
				data: {
					id: "other1",
					name: "other1",
					flowRate: 4,
					typeOfHotWaterOutlet: "otherHotWaterOutlet",
					coldWaterSource: "mainsWater",
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
							HotWaterSource: "hw cylinder",
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
			it("maps WWHRS name", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-a",
						name: "shower-wwhrs-a",
						flowRate: 8,
						wwhrs: true,
						associatedWwhrs: wwhrs.data.id,
						typeOfHotWaterOutlet: "mixedShower",
						coldWaterSource: "mainsWater",
						isAirPressureShower: false,
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						wwhrs: { data: [wwhrs], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [combiBoiler], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));
				const expectedShower: SchemaMixerShower = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					allow_low_flowrate: false,
					HotWaterSource: "hw cylinder",
					WWHRS: wwhrs.data.name,
				};
			
				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-a"]).toEqual(expectedShower);
				expect(result.WWHRS?.[wwhrs.data.name]).toEqual({
					product_reference: "1000",
					ColdWaterSource: "mains water",
				});
			});

			it("maps mixed shower with air pump", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-air-pump",
						name: "shower-air-pump",
						wwhrs: false,
						typeOfHotWaterOutlet: "mixedShower",
						coldWaterSource: "mainsWater",
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
					HotWaterSource: "hw cylinder",
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
						typeOfHotWaterOutlet: "mixedShower",
						coldWaterSource: "mainsWater",
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
					HotWaterSource: "hw cylinder",
				} as const satisfies SchemaMixerShower;
				expect(shower).toEqual(expectedShowerNoWwhrs);
				expect(shower).not.toHaveProperty("WWHRS");
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
						associatedWwhrs: wwhrs.data.id,
						typeOfHotWaterOutlet: "mixedShower",
						coldWaterSource: "mainsWater",
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
						typeOfHotWaterOutlet: "mixedShower",
						coldWaterSource: "mainsWater",
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
						coldWaterSource: "mainsWater",
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
						isConnectedToHeatNetwork: false,
						energySupply: "electricity",
						maxFlowTemp: unitValue(30, celsius),
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: {
							data: [mixedShowerWithWwhrs, mixedShowerNoWwhrs, electricShower],
							complete: true,
						},
						wwhrs: { data: [wwhrs], complete: true },
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
					HotWaterSource: "hw cylinder",
					WWHRS: wwhrs.data.name,
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower1"]).toEqual(expectedShower1);
				expect(result.WWHRS?.[wwhrs.data.name]).toEqual({
					product_reference: "1000",
					ColdWaterSource: "mains water",
				});

				const expectedShower2 = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 6,
					allow_low_flowrate: false,
					HotWaterSource: "hw cylinder",
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