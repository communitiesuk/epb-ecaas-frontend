import { BatteryLocation, BuildType, FloorType, FuelType, MassDistributionClass, ShadingObjectType, SupplyAirFlowRateControlType, SupplyAirTemperatureControlType, TerrainClass, VentilationShieldClass, VentType, ZoneTemperatureControlBasis } from "~/schema/api-schema.types";
import { mapFhsInputData } from "./fhsInputMapper";

describe("FHS input mapper", () => {
	const store = useEcaasStore();

	afterEach(() => store.$reset());

	it("maps input state to an FHS input request", () => {
		// Arrange
		const dwellingDetails: DwellingDetails = {
			generalSpecifications: {
				data: {
					typeOfDwelling: BuildType.house,
					storeysInDwelling: 2,
					numOfBedrooms: 7,
					partGCompliance: true,
					coolingRequired: true
				}
			},
			appliances: {
				data: {
					appliances: [] // skipping appliance data as it will be removed for summer
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
					heatingControlType: "Separate temperature control",
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
						surfaceAreaAllZones: 40,
						pitch: 0,
						uValue: 1,
						thermalResistanceOfFloorConstruction: 1,
						kappaValue: 50000,
						massDistributionClass: MassDistributionClass.I,
						perimeter: 100,
						psiOfWallJunction: 1,
						typeOfGroundFloor: FloorType.Suspended_floor
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
					fuelType: [FuelType.electricity] // TODO should this be an array?
				}
			},
			heatEmitting: {
				wetDistribution: {
					data: [{
						name: "some-wet-distribution",
						zoneReference: "zone1",
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
						heatSource: "some-heat-pump-name",
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
			},
			pvDiverter: {
				data: []
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

		// Act
		const fhsInputData = mapFhsInputData(store);

		// Assert
		expect(fhsInputData).toBeDefined();     
	});
});
