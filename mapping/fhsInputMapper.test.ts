import { BatteryLocation, BuildType, ColdWaterSourceType, DuctShape, DuctType, FloorType, FuelType, HeatingControlType, MassDistributionClass, MVHRLocation, ShadingObjectType, SpaceCoolSystemType, SpaceHeatControlType, SupplyAirFlowRateControlType, SupplyAirTemperatureControlType, TerrainClass, VentilationShieldClass, VentType } from "~/schema/api-schema.types";
import { mapFhsInputData, type FhsInputSchema } from "./fhsInputMapper";

describe("FHS input mapper", () => {
	const store = useEcaasStore();

	afterEach(() => store.$reset());

	it("maps input state with a build type of house to an FHS input request", () => {
		// Arrange
		const dwellingDetails: DwellingDetails = {
			generalSpecifications: {
				data: {
					typeOfDwelling: BuildType.house,
					storeysInDwelling: 2,
					numOfBedrooms: 7,
				}
			},
			shading: {
				data: [{
					name: "Tree",
					startAngle: 60,
					endAngle: 90,
					objectType: ShadingObjectType.obstacle,
					height: 2,
					distance: 1
				}]
			},
			externalFactors: {
				data: {
					altitude: 100,
					typeOfExposure: VentilationShieldClass.Shielded,
					terrainType: TerrainClass.Suburban,
					noiseNuisance: false,
				}
			},
		};

		const infiltrationAndVentilation: InfiltrationAndVentilation = {
			mechanicalVentilation: {
				data: [{
					id: "kitchen exhaust fan",
					name: "kitchen exhaust fan",
					typeOfMechanicalVentilationOptions: VentType.Intermittent_MEV,
					controlForSupplyAirflow: SupplyAirFlowRateControlType.LOAD,
					supplyAirTemperatureControl: "TO_BE_REMOVED",
					airFlowRate: 55,
				}]
			},
			ductwork: {
				data: [] // skipping ductwork as our mechanical ventilation isn't an MVHR
			},
			vents: {
				data: [{
					name: "only vent",
					typeOfVent: "Air brick",
					effectiveVentilationArea: 75,
					openingRatio: 0.2,
					midHeightOfZone: 1.9,
					pressureDifference: 4,
					orientation: 90,
					pitch: 180,
				}]
			},
			combustionAppliances: {
				"open_fireplace": {
					data: []
				},
				"closed_with_fan": {
					data: []
				},
				"open_gas_flue_balancer": {
					data: []
				},
				"open_gas_kitchen_stove": {
					data: []
				},
				"open_gas_fire": {
					data: []
				},
				"closed_fire": {
					data: []
				}
			},
			// skipping combustion appliances they have been removed for summer
			ventilation: {
				data: {
					dwellingHeight: 8,
					dwellingEnvelopeArea: 320,
					dwellingElevationalLevelAtBase: 3,
					crossVentFactor: false,
					maxRequiredAirChangeRate: 2.1,
				}
			},
			airPermeability: {
				data: {
					testPressure: 40,
					airTightnessTestResult: 4,
				}
			},
		};
		
		const livingSpaceFabric: LivingSpaceFabric = {
			livingSpaceZoneParameters: {
				data: {
					area: 100,
					volume: 300,
					heatingControlType: HeatingControlType.SeparateTempControl,
					spaceHeatingSystemForThisZone: [{
						name: "some-wet-distribution",
					}],
					spaceCoolingSystemForThisZone: [{
						name: "some-aircon-unit-name",
					}],
					spaceHeatControlSystemForThisZone: []
				}
			},
			livingSpaceFloors: {
				livingSpaceGroundFloor: {
					data: [{
						name: "ground-floor",
						surfaceAreaInZone: 40,
						surfaceAreaAllZones: 50,
						pitch: 0,
						uValue: 1,
						thermalResistanceOfFloorConstruction: 1,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.I,
						perimeter: 100,
						psiOfWallJunction: 1,
						typeOfGroundFloor: FloorType.Slab_no_edge_insulation,
					}]
				},
				livingSpaceInternalFloor: {
					data: []
				},
				livingSpaceExposedFloor: {
					data: []
				}
			},
			livingSpaceWalls: {},
			livingSpaceCeilingsAndRoofs: {
				livingSpaceCeilings: {
					data: []
				},
				livingSpaceRoofs: {
					data: []
				},
				livingSpaceUnheatedPitchedRoofs: {
					data: []
				}
			},
			livingSpaceDoors: {
				livingSpaceExternalUnglazedDoor: {
					data: []
				},
				livingSpaceExternalGlazedDoor: {
					data: []
				},
				livingSpaceInternalDoor: {
					data: []
				}
			},
			livingSpaceWindows: {
				data: []
			},
			livingSpaceThermalBridging: {
				livingSpaceLinearThermalBridges: {
					data: []
				},
				livingSpacePointThermalBridges: {
					data: []
				}
			}
		};

		const heatingSystems: HeatingSystems = {
			heatGeneration: {
				heatPump: {
					data: [{
						id: "some-heat-pump-id",
						name: "some-heat-pump-name"
					}]
				},
				boiler: {
					data: []
				},
				heatBattery: {
					data: []
				},
				heatInterfaceUnit: {
					data: []
				},
				heatNetwork: {
					data: []
				}
			},
			energySupply: {
				data: {
					fuelType: [FuelType.electricity], // TODO should this be an array?
					exported: true,
				}
			},
			heatEmitting: {
				wetDistribution: {
					data: [{
						name: "some-wet-distribution",
						zoneReference: "zone 1",
						heatSource: "some-heat-pump-name",
						thermalMass: 23,
						designTempDiffAcrossEmitters: 31,
						designFlowTemp: 12,
						ecoDesignControllerClass: "8",
						minimumFlowTemp: 21,
						minOutdoorTemp: 20,
						maxOutdoorTemp: 34,
						convectionFractionWet: 4,
						typeOfSpaceHeater: "radiator",
						numberOfRadiators: 2,
						exponent: 3,
						constant: 9
					}]
				},
				instantElectricHeater: {
					data: []
				},
				electricStorageHeater: {
					data: []
				},
				warmAirHeatPump: {
					data: []
				}
			}
		};

		const domesticHotWater: DomesticHotWater = {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						id: "some-hot-water-cyclinder",
						name: "hw cylinder",
						heatSource: "some-heat-pump-id",
						tankVolume: 200,
						dailyEnergyLoss: 34
					}]
				},
				immersionHeater: {
					data: []
				},
				solarThermal: {
					data: []
				},
				pointOfUse: {
					data: []
				},
				heatPump: {
					data: []
				},
				combiBoiler: {
					data: []
				},
				heatBattery: {
					data: []
				},
				smartHotWaterTank: {
					data: []
				},
				heatInterfaceUnit: {
					data: []
				},
			},
			hotWaterOutlets: {
				mixedShower: {
					data: [{
						id: "some-mixed-shower-id",
						name: "some-mixed-shower-name",
						flowRate: 14
					}]
				},
				electricShower: {
					data: []
				},
				bath: {
					data: []
				},
				otherOutlets: {
					data: []
				}
			},
			pipework: {
				primaryPipework: {
					data: []
				},
				secondaryPipework: {
					data: []
				}
			},
			wwhrs: {
				data: []
			}
		};

		const pvAndBatteries: PvAndBatteries = {
			pvSystem: {
				data: []
			},
			electricBattery: {
				data: [{
					name: "some-electric-battery-name",
					capacity: 12,
					batteryAge: 0,
					chargeEfficiency: 1,
					location: BatteryLocation.inside,
					gridChargingPossible: true,
					maximumChargeRate: 90,
					minimumChargeRate: 80,
					maximumDischargeRate: 20,
				}]
			}
		};

		const cooling: Cooling = {
			airConditioning: {
				data: [{
					name: "some-aircon-unit-name",
					coolingCapacity: 60,
					seasonalEnergyEfficiencyRatio: 4,
					convectionFraction: 0.2
				}]
			}
		};

		const state: EcaasState = {
			dwellingDetails,
			domesticHotWater,
			livingSpaceFabric,
			infiltrationAndVentilation,
			heatingSystems,
			pvAndBatteries,
			cooling
		};

		store.$state = state;

		const expectedResult: FhsInputSchema = {
			ColdWaterSource: {
				[ColdWaterSourceType.mains_water]: {
					start_day: 0,
					temperatures: [3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
					time_series_step: 1
				}
			},
			Control: {},
			EnergySupply: {
				['mains elec']: {
					fuel: FuelType.electricity,
					is_export_capable: true,
				}
			},
			Events: {},
			ExternalConditions: {
				shading_segments: [{
					end360: 90,
					number: 1,
					shading: [{
						distance: 1,
						height: 2,
						type: ShadingObjectType.obstacle
					}],
					start360: 60,
				}]
			},
			General: {
				build_type: BuildType.house,
				storeys_in_building: 2,
			},
			HeatingControlType: HeatingControlType.SeparateTempControl,
			HotWaterDemand: {
				Shower: {
					"some-mixed-shower-name": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 14,
						type: "MixerShower"
					},
				},
				Bath: {},
				Distribution: [],
				Other: {}
			},
			HotWaterSource: {
				"hw cylinder": {
					ColdWaterSource: ColdWaterSourceType.mains_water,
					HeatSource: {
						["some-heat-pump-name"]: {
							name: "some-heat-pump-name",
							EnergySupply: "mains elec",
							heater_position: 0.1,
							type: "HeatSourceWet",
							temp_flow_limit_upper: 65,
							thermostat_position: 0.33
						},
					},
					daily_losses: 34,
					volume: 200,
					type: "StorageTank"
				}
			},
			InfiltrationVentilation: {
				CombustionAppliances: {},
				Cowls: {},
				Leaks: {
					ventilation_zone_height: 8,
					env_area: 320,
					test_pressure: 40,
					test_result: 4
				},
				MechanicalVentilation: {
					"kitchen exhaust fan": {
						EnergySupply: "mains elec",
						design_outdoor_air_flow_rate: 55,
						sup_air_flw_ctrl: SupplyAirFlowRateControlType.LOAD,
						sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
						vent_type: VentType.Intermittent_MEV,
						measured_air_flow_rate: 37,
						measured_fan_power: 12.26,
					}
				},
				PDUs: {},
				Vents: {
					"only vent": {
						area_cm2: 75,
						mid_height_air_flow_path: 1.9,
						orientation360: 90,
						pitch: 180,
						pressure_difference_ref: 4
					}
				},
				ach_max_static_calcs: 2,
				altitude: 100,
				cross_vent_factor: false,
				noise_nuisance: false,
				shield_class: VentilationShieldClass.Shielded,
				terrain_class: TerrainClass.Suburban,
				vent_opening_ratio_init: 1,
				ventilation_zone_base_height: 3,
			},
			InternalGains: {},
			NumberOfBedrooms: 7,
			OnSiteGeneration: {},
			SimulationTime: {
				start: 0,
				end: 8,
				step: 1
			},
			SpaceCoolSystem: {
				"some-aircon-unit-name": {
					type: SpaceCoolSystemType.AirConditioning,
					EnergySupply: "mains elec",
					cooling_capacity: 60,
					efficiency: 4,
					frac_convective: 0.2
				}
			},
			SpaceHeatSystem: {
				"some-wet-distribution": {
					type: "WetDistribution",
					HeatSource: {
						name: "some-heat-pump-name",
					},
					Zone: "zone 1",
					design_flow_temp: 12,
					ecodesign_controller: {
						ecodesign_control_class: 8,
						max_outdoor_temp: 34,
						min_flow_temp: 21,
						min_outdoor_temp: 20
					},
					emitters: [
						{
							c: 9,
							frac_convective: 4,
							n: 3,
							wet_emitter_type: "radiator"
						},
						{
							c: 9,
							frac_convective: 4,
							n: 3,
							wet_emitter_type: "radiator"
						}
					],
					temp_diff_emit_dsgn: 31,
					thermal_mass: 23,
				}
			},
			GroundFloorArea: 50,
			Zone: {
				"zone 1": {
					BuildingElement: {
						"ground-floor": {
							type: 'BuildingElementGround',
							area: 40,
							total_area: 50,
							u_value: 1,
							thermal_resistance_floor_construction: 1,
							areal_heat_capacity: 50000,
							mass_distribution_class: MassDistributionClass.I,
							perimeter: 100,
							psi_wall_floor_junc: 1,
							floor_type: FloorType.Slab_no_edge_insulation,
							pitch: 0,
							thickness_walls: 0
						}
					},
					Lighting: {
						efficacy: 56.0,
						bulbs: {
							incandescent: {
								count: 5,
								power: 8,
								efficacy: 18
							},
							led: {
								count: 10,
								power: 3,
								efficacy: 150
							}
						}
					},
					SpaceCoolSystem: ["some-aircon-unit-name"],
					SpaceHeatControl: SpaceHeatControlType.livingroom,
					SpaceHeatSystem: ["some-wet-distribution"],
					ThermalBridging: {},
					area: 100,
					volume: 300,
				}
			},
		};

		// Act
		const fhsInputData = mapFhsInputData(store);

		// Assert
		expect(fhsInputData).toBeDefined();
		expect(fhsInputData).toEqual(expectedResult);   
	});

	it("maps input state with a build type of flat to an FHS input request", () => {
		// Arrange
		const dwellingDetails: DwellingDetails = {
			generalSpecifications: {
				data: {
					typeOfDwelling: BuildType.flat,
					storeysInDwelling: 6,
					storeyOfFlat: 3,
					numOfBedrooms: 2,
				}
			},
			shading: {
				data: []
			},
			externalFactors: {
				data: {
					altitude: 30,
					typeOfExposure: VentilationShieldClass.Normal,
					terrainType: TerrainClass.OpenField,
					noiseNuisance: true,
				}
			},
		};

		const infiltrationAndVentilation: InfiltrationAndVentilation = {
			mechanicalVentilation: {
				data: [{
					id: "mvhr vent 1 id",
					name: "mvhr vent 1 name",
					typeOfMechanicalVentilationOptions: VentType.MVHR,
					controlForSupplyAirflow: SupplyAirFlowRateControlType.ODA,
					supplyAirTemperatureControl: "TO_BE_REMOVED",
					airFlowRate: 17,
					mvhrLocation: MVHRLocation.inside,
					mvhrEfficiency: 1
				},
				{
					id: "mvhr vent 2 id",
					name: "mvhr vent 2 name",
					typeOfMechanicalVentilationOptions: VentType.MVHR,
					controlForSupplyAirflow: SupplyAirFlowRateControlType.LOAD,
					supplyAirTemperatureControl: "TO_BE_REMOVED",
					airFlowRate: 3,
					mvhrLocation: MVHRLocation.outside,
					mvhrEfficiency: 0
				},
				{
					id: "centralised MEV id",
					name: "centralised MEV name",
					typeOfMechanicalVentilationOptions: VentType.Centralised_continuous_MEV,
					controlForSupplyAirflow: SupplyAirFlowRateControlType.LOAD,
					supplyAirTemperatureControl: "TO_BE_REMOVED",
					airFlowRate: 8,
				}]
			},
			ductwork: {
				data: [{
					name: "ductwork 1",
					mvhrUnit: "mvhr vent 1 name",
					ductType: DuctType.supply,
					ductworkCrossSectionalShape: DuctShape.circular,
					internalDiameterOfDuctwork: 50,
					externalDiameterOfDuctwork: 55,
					insulationThickness: 5,
					lengthOfDuctwork: 4,
					thermalInsulationConductivityOfDuctwork: 1,
					surfaceReflectivity: true,
				}]
			},
			vents: {
				data: [{
					name: "only vent",
					typeOfVent: "Air brick",
					effectiveVentilationArea: 75,
					openingRatio: 0.2,
					midHeightOfZone: 1.9,
					pressureDifference: 4,
					orientation: 90,
					pitch: 180,
				}]
			},
			combustionAppliances: {
				"open_fireplace": {
					data: []
				},
				"closed_with_fan": {
					data: []
				},
				"open_gas_flue_balancer": {
					data: []
				},
				"open_gas_kitchen_stove": {
					data: []
				},
				"open_gas_fire": {
					data: []
				},
				"closed_fire": {
					data: []
				}
			},
			ventilation: {
				data: {
					dwellingHeight: 1,
					dwellingEnvelopeArea: 5,
					dwellingElevationalLevelAtBase: 1,
					crossVentFactor: true,
					maxRequiredAirChangeRate: 2,
				}
			},
			airPermeability: {
				data: {
					testPressure: 20,
					airTightnessTestResult: 10,
				}
			},
		};
		
		const livingSpaceFabric: LivingSpaceFabric = {
			livingSpaceZoneParameters: {
				data: {
					area: 16,
					volume: 550,
					heatingControlType: HeatingControlType.SeparateTimeAndTempControl,
					spaceHeatingSystemForThisZone: [],
					spaceCoolingSystemForThisZone: [],
					spaceHeatControlSystemForThisZone: []
				}
			},
			livingSpaceFloors: {
				livingSpaceGroundFloor: {
					data: [{
						name: "ground floor 1",
						surfaceAreaInZone: 12,
						surfaceAreaAllZones: 26,
						pitch: 0,
						uValue: 5,
						thermalResistanceOfFloorConstruction: 2,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.E,
						perimeter: 40,
						psiOfWallJunction: 0.4,
						typeOfGroundFloor: FloorType.Slab_edge_insulation,
						edgeInsulationType: "horizontal",
						edgeInsulationWidth: 7,
						edgeInsulationThermalResistance: 2.4
					},
					{
						name: "ground floor 2",
						surfaceAreaInZone: 9,
						surfaceAreaAllZones: 26,
						pitch: 0,
						uValue: 5,
						thermalResistanceOfFloorConstruction: 2,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.D,
						perimeter: 21,
						psiOfWallJunction: 0.8,
						typeOfGroundFloor: FloorType.Heated_basement,
						thicknessOfWalls: 1,
						depthOfBasementFloorBelowGround: 2,
						thermalResistanceOfBasementWalls: 3,
					}]
				},
				livingSpaceInternalFloor: {
					data: [{
						name: "internal floor 1",
						typeOfInternalFloor: InternalFloorType.unheatedSpace,
						surfaceAreaOfElement: 6,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.IE,
						thermalResistanceOfAdjacentUnheatedSpace: 1,
					}, 
					{
						name: "internal floor 2",
						typeOfInternalFloor: InternalFloorType.heatedSpace,
						surfaceAreaOfElement: 4,
						kappaValue: 110000,
						massDistributionClass: MassDistributionClass.M,
					}
					]
				},
				// TODO add more floors
				livingSpaceExposedFloor: {
					data: []
				}
			},
			livingSpaceWalls: {
				livingSpacePartyWall: {
					data: [{
						name: "party wall 1",
						pitchOption: "90",
						pitch: 90,
						orientation: 80,
						height: 3,
						length: 5,
						elevationalHeight: 1,
						surfaceArea: 15,
						solarAbsorption: 0.6,
						uValue: 1,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.E
					}]
				}

			},
			livingSpaceCeilingsAndRoofs: {
				livingSpaceCeilings: {
					data: []
				},
				livingSpaceRoofs: {
					data: []
				},
				livingSpaceUnheatedPitchedRoofs: {
					data: []
				}
			},
			livingSpaceDoors: {
				livingSpaceExternalUnglazedDoor: {
					data: []
				},
				livingSpaceExternalGlazedDoor: {
					data: []
				},
				livingSpaceInternalDoor: {
					data: []
				}
			},
			livingSpaceWindows: {
				data: []
			},
			livingSpaceThermalBridging: {
				livingSpaceLinearThermalBridges: {
					data: []
				},
				livingSpacePointThermalBridges: {
					data: []
				}
			}
		};

		const heatingSystems: HeatingSystems = {
			heatGeneration: {
				heatPump: {
					data: [{
						id: "heat pump 1 id",
						name: "heat pump 1 name"
					}]
				},
				boiler: {
					data: []
				},
				heatBattery: {
					data: []
				},
				heatInterfaceUnit: {
					data: []
				},
				heatNetwork: {
					data: []
				}
			},
			energySupply: {
				data: {
					fuelType: [FuelType.electricity],
					exported: true,
				}
			},
			heatEmitting: {
				wetDistribution: {
					data: []
				},
				instantElectricHeater: {
					data: []
				},
				electricStorageHeater: {
					data: []
				},
				warmAirHeatPump: {
					data: []
				}
			}
		};

		const domesticHotWater: DomesticHotWater = {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						id: "hw cylinder 1 id",
						name: "hw cylinder 1 name",
						heatSource: "heat pump 1 id",
						tankVolume: 80,
						dailyEnergyLoss: 10
					}]
				},
				immersionHeater: {
					data: []
				},
				solarThermal: {
					data: []
				},
				pointOfUse: {
					data: []
				},
				heatPump: {
					data: []
				},
				combiBoiler: {
					data: []
				},
				heatBattery: {
					data: []
				},
				smartHotWaterTank: {
					data: []
				},
				heatInterfaceUnit: {
					data: []
				},
			},
			hotWaterOutlets: {
				mixedShower: {
					data: [{
						id: "some-mixed-shower-id",
						name: "some-mixed-shower-name",
						flowRate: 14
					}]
				},
				electricShower: {
					data: []
				},
				bath: {
					data: []
				},
				otherOutlets: {
					data: []
				}
			},
			pipework: {
				primaryPipework: {
					data: []
				},
				secondaryPipework: {
					data: []
				}
			},
			wwhrs: {
				data: []
			}
		};

		const pvAndBatteries: PvAndBatteries = {
			pvSystem: {
				data: []
			},
			electricBattery: {
				data: [{
					name: "some-electric-battery-name",
					capacity: 12,
					batteryAge: 0,
					chargeEfficiency: 1,
					location: BatteryLocation.inside,
					gridChargingPossible: true,
					maximumChargeRate: 90,
					minimumChargeRate: 80,
					maximumDischargeRate: 20,
				}]
			}
		};

		const cooling: Cooling = {
			airConditioning: {
				data: []
			}
		};

		const state: EcaasState = {
			dwellingDetails,
			domesticHotWater,
			livingSpaceFabric,
			infiltrationAndVentilation,
			heatingSystems,
			pvAndBatteries,
			cooling
		};

		store.$state = state;

		const expectedResult: FhsInputSchema = {
			ColdWaterSource: {
				[ColdWaterSourceType.mains_water]: {
					start_day: 0,
					temperatures: [3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
					time_series_step: 1
				}
			},
			Control: {},
			EnergySupply: {
				['mains elec']: {
					fuel: FuelType.electricity,
					is_export_capable: true,
				}
			},
			Events: {},
			ExternalConditions: {
				shading_segments: []
			},
			General: {
				build_type: BuildType.flat,
				storeys_in_building: 6,
				storey_of_dwelling: 3
			},
			HeatingControlType: HeatingControlType.SeparateTimeAndTempControl,
			HotWaterDemand: {
				Shower: {
					"some-mixed-shower-name": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 14,
						type: "MixerShower"
					},
				},
				Bath: {},
				Distribution: [],
				Other: {}
			},
			HotWaterSource: {
				"hw cylinder": {
					ColdWaterSource: ColdWaterSourceType.mains_water,
					HeatSource: {
						["heat pump 1 name"]: {
							name: "heat pump 1 name",
							EnergySupply: "mains elec",
							heater_position: 0.1,
							type: "HeatSourceWet",
							temp_flow_limit_upper: 65,
							thermostat_position: 0.33
						},
					},
					daily_losses: 10,
					volume: 80,
					type: "StorageTank"
				}
			},
			InfiltrationVentilation: {
				CombustionAppliances: {},
				Cowls: {},
				Leaks: {
					ventilation_zone_height: 1,
					env_area: 5,
					test_pressure: 20,
					test_result: 10
				},
				MechanicalVentilation: {
					"mvhr vent 1 name": {
						EnergySupply: "mains elec",
						design_outdoor_air_flow_rate: 17,
						sup_air_flw_ctrl: SupplyAirFlowRateControlType.ODA,
						sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
						vent_type: VentType.MVHR,
						measured_air_flow_rate: 37,
						measured_fan_power: 12.26,
						mvhr_eff: 1,
						mvhr_location: MVHRLocation.inside,
						ductwork: [{
							cross_section_shape: DuctShape.circular,
							duct_type: DuctType.supply,
							internal_diameter_mm: 50,
							external_diameter_mm: 55,
							insulation_thermal_conductivity: 1,
							insulation_thickness_mm: 5,
							length: 4,
							reflective: true
						}]
					},
					"mvhr vent 2 name": {
						EnergySupply: "mains elec",
						design_outdoor_air_flow_rate: 3,
						sup_air_flw_ctrl: SupplyAirFlowRateControlType.LOAD,
						sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
						vent_type: VentType.MVHR,
						measured_air_flow_rate: 37,
						measured_fan_power: 12.26,
						mvhr_eff: 0,
						mvhr_location: MVHRLocation.outside,
						ductwork: []
					},
					"centralised MEV name": {
						EnergySupply: "mains elec",
						design_outdoor_air_flow_rate: 8,
						sup_air_flw_ctrl: SupplyAirFlowRateControlType.LOAD,
						sup_air_temp_ctrl: SupplyAirTemperatureControlType.CONST,
						vent_type: VentType.Centralised_continuous_MEV,
						measured_air_flow_rate: 37,
						measured_fan_power: 12.26,
					}
				},
				PDUs: {},
				Vents: {
					"only vent": {
						area_cm2: 75,
						mid_height_air_flow_path: 1.9,
						orientation360: 90,
						pitch: 180,
						pressure_difference_ref: 4
					}
				},
				ach_max_static_calcs: 2,
				altitude: 30,
				cross_vent_factor: true,
				noise_nuisance: true,
				shield_class: VentilationShieldClass.Normal,
				terrain_class: TerrainClass.OpenField,
				vent_opening_ratio_init: 1,
				ventilation_zone_base_height: 1,
			},
			InternalGains: {},
			NumberOfBedrooms: 2,
			OnSiteGeneration: {},
			SimulationTime: {
				start: 0,
				end: 8,
				step: 1
			},
			SpaceCoolSystem: {},
			SpaceHeatSystem: {},
			GroundFloorArea: 26,
			Zone: {
				"zone 1": {
					BuildingElement: {
						"ground floor 1": {
							type: 'BuildingElementGround',
							area: 12,
							total_area: 26,
							u_value: 5,
							thermal_resistance_floor_construction: 2,
							areal_heat_capacity: 50000,
							mass_distribution_class: MassDistributionClass.E,
							perimeter: 40,
							edge_insulation: [{
								edge_thermal_resistance: 2.4,
								type: "horizontal",
								width: 7
							}],
							psi_wall_floor_junc: 0.4,
							floor_type: FloorType.Slab_edge_insulation,
							pitch: 0,
							thickness_walls: 0
						},
						"ground floor 2": {
							type: 'BuildingElementGround',
							area: 9,
							total_area: 26,
							depth_basement_floor: 2,
							u_value: 5,
							thermal_resistance_floor_construction: 2,
							areal_heat_capacity: 50000,
							mass_distribution_class: MassDistributionClass.D,
							perimeter: 21,
							thermal_resist_walls_base: 3,
							psi_wall_floor_junc: 0.8,
							floor_type: FloorType.Heated_basement,
							pitch: 0,
							thickness_walls: 1
						},
						"internal floor 1": {
							type: "BuildingElementAdjacentUnconditionedSpace_Simple",
							area: 6,
							areal_heat_capacity: 50000,
							mass_distribution_class: MassDistributionClass.IE,
							thermal_resistance_unconditioned_space: 1,
							pitch: 180,
							u_value: 0.01
						},
						"internal floor 2": {
							type: "BuildingElementAdjacentConditionedSpace",
							area: 4, 
							u_value: 0.01,
							areal_heat_capacity: 110000,
							mass_distribution_class: MassDistributionClass.M,
							pitch: 180,
						},
						"party wall 1": {
							area: 15,
							areal_heat_capacity: 50000,
							base_height: 1,
							height: 3,
							is_external_door: false,
							mass_distribution_class: MassDistributionClass.E,
							orientation360: 80,
							pitch: 90,
							solar_absorption_coeff: 0.6,
							type: "BuildingElementOpaque",
							u_value: 1,
							width: 5,
						}
					},
					SpaceHeatControl: SpaceHeatControlType.livingroom,
					SpaceCoolSystem: [],
					SpaceHeatSystem: [],
					ThermalBridging: {},
					Lighting: {
						efficacy: 56.0,
						bulbs: {
							incandescent: {
								count: 5,
								power: 8,
								efficacy: 18
							},
							led: {
								count: 10,
								power: 3,
								efficacy: 150
							}
						}
					},
					area: 16,
					volume: 550,
				}
			},
		};

		// Act
		const fhsInputData = mapFhsInputData(store);

		// Assert
		expect(fhsInputData).toBeDefined();
		expect(fhsInputData).toEqual(expectedResult);   
	});

	// TODO - test with a floor of type suspended, we may be missing a property (shield_fact_location)
});
