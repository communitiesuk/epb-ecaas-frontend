import { ColdWaterSourceType, WaterPipeContentsType, WaterPipeworkLocation  } from "~/schema/api-schema.types";
import type {SchemaHotWaterDemand} from "~/schema/api-schema.types";
import { mapDistributionData, mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";

describe('domestic hot water mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps hot water cylinder input state to FHS input request', () => {
		// Arrange
		const heatPumpName = "heat pump";

		const hotWaterCylinder: HotWaterCylinderData = {
			id: "hot water cylinder",
			name: "hot water cylinder",
			heatSource: heatPumpName,
			tankVolume: 10,
			dailyEnergyLoss: 3,
		};

		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [hotWaterCylinder],
						complete: true,
					}
				},
				hotWaterOutlets: {
					mixedShower: {
						data: [],
						complete: true,
					},
					electricShower: {
						data: [],
						complete: true,
					},
					bath: {
						data: [],
						complete: true,
					},
					otherOutlets: {
						data: [],
						complete: true,
					}
				},
				pipework: {
					primaryPipework: {
						data: [],
						complete: true,
					},
					secondaryPipework: {
						data: [],
						complete: true,
					}
				},
			},
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{name: heatPumpName, id: heatPumpName}],
						complete: true,
					}
				}
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(resolveState(store.$state));
		const expectedResult: Pick<FhsInputSchema, 'HotWaterSource'> = {
			HotWaterSource: {
				"hw cylinder": {
					ColdWaterSource: ColdWaterSourceType.mains_water,
					HeatSource: {
						[heatPumpName]: {
							EnergySupply: "mains elec",
							heater_position: 0.1,
							type: "HeatSourceWet",
							name: heatPumpName,
							temp_flow_limit_upper: 65,
							thermostat_position: 0.33
						}
					},
					daily_losses: 3,
					volume: 10,
					type: "StorageTank",
				}
			}
		};

		// Assert
		expect(result["HotWaterSource"]).toEqual(expectedResult["HotWaterSource"]);
	});

	it('maps hot water cylinder with primary pipework input state to FHS input request', () => {
		// Arrange
		const heatPumpName = "heatPump1";
		const heatPumpId = "heatPump1Id";
		const hotWaterCylinder: HotWaterCylinderData = {
			id: "hotWaterCylinderId",
			name: "hotWaterCylinderName",
			heatSource: heatPumpId,
			tankVolume: 10,
			dailyEnergyLoss: 3,
		};

		const primaryPipework: PrimaryPipeworkData = {
			name: "primaryPipework1",
			location: WaterPipeworkLocation.internal,
			internalDiameter: 24,
			externalDiameter: 26,
			length: 10.0,
			thermalConductivity: 0.040,
			insulationThickness: 40,
			surfaceReflectivity: false,
			pipeContents: WaterPipeContentsType.water,
			hotWaterCylinder: hotWaterCylinder.id
		};

		const pipework: Pipework = {
			primaryPipework: {
				data: [primaryPipework, primaryPipework],
				complete: true,
			},
			secondaryPipework: {
				data: [],
				complete: true,
			},
		};

		store.$patch({
			domesticHotWater: {
				pipework,
				waterHeating: {
					hotWaterCylinder: {
						data: [hotWaterCylinder],
						complete: true,
					}
				},
				hotWaterOutlets: {
					mixedShower: {
						data: [],
						complete: true,
					},
					electricShower: {
						data: [],
						complete: true,
					},
					bath: {
						data: [],
						complete: true,
					},
					otherOutlets: {
						data: [],
						complete: true,
					}
				}
			},
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{name: heatPumpName, id: heatPumpId}],
						complete: true,
					}
				}
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(resolveState(store.$state));

		const expectedResult: Pick<FhsInputSchema, 'HotWaterSource'> = {
			HotWaterSource: {
				"hw cylinder": {
					ColdWaterSource: ColdWaterSourceType.mains_water,
					HeatSource: {
						[heatPumpName]: {
							EnergySupply: "mains elec",
							heater_position: 0.1,
							type: "HeatSourceWet",
							name: heatPumpName,
							temp_flow_limit_upper: 65,
							thermostat_position: 0.33
						}
					},
					daily_losses: 3,
					volume: 10,
					type: "StorageTank",
					primary_pipework: [
						{
							location: WaterPipeworkLocation.internal,
							internal_diameter_mm: 24,
							external_diameter_mm: 26,
							length: 10.0,
							insulation_thermal_conductivity: 0.040,
							insulation_thickness_mm: 40,
							surface_reflectivity: false,
							pipe_contents: WaterPipeContentsType.water
						},
						{
							location: WaterPipeworkLocation.internal,
							internal_diameter_mm: 24,
							external_diameter_mm: 26,
							length: 10.0,
							insulation_thermal_conductivity: 0.040,
							insulation_thickness_mm: 40,
							surface_reflectivity: false,
							pipe_contents: WaterPipeContentsType.water
						},
					]
				}
			}
		};

		// Assert
		expect(result["HotWaterSource"]).toEqual(expectedResult["HotWaterSource"]);
	});

	it('maps hot water outlets input state to FHS input request', () => {
		// Arrange
		const mixedShower: MixedShowerData = {
			id: "shower1",
			name: "shower1",
			flowRate: 3
		};

		const electricShower: ElectricShowerData = {
			id: "shower2",
			name: "shower2",
			ratedPower: 10,
		};

		const bath: BathData = {
			id: "bath1",
			name: "bath1",
			size: 70,
			flowRate: 1,
		};

		const other: OtherHotWaterOutletData = {
			id: "other1",
			name: "other1",
			flowRate: 4,
		};

		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixedShower],
						complete: true,
					},
					electricShower: {
						data: [electricShower],
						complete: true,
					},
					bath: {
						data: [bath],
						complete: true,
					},
					otherOutlets: {
						data: [other],
						complete: true,
					}
				},
				pipework: {
					secondaryPipework: {
						data: [],
						complete: true,
					}
				},
				waterHeating: {
					hotWaterCylinder: {
						data: [],
						complete: true,
					}
				}
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(resolveState(store.$state));
		
		// Assert
		const expectedResult: Pick<FhsInputSchema, 'HotWaterDemand'> = {
			HotWaterDemand: {
				Shower: {
					"shower1": {
						type: "MixerShower",
						flowrate: 3,
						ColdWaterSource: ColdWaterSourceType.mains_water
					},
					"shower2": {
						type: "InstantElecShower",
						rated_power: 10,
						ColdWaterSource: ColdWaterSourceType.mains_water,
						EnergySupply: "mains elec"
					}
				},
				Bath: {
					"bath1": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 1,
						size: 70,
					}
				},
				Other: {
					"other1": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 4,
					}
				},
				Distribution: []
			}
		};
		
		expect(result["HotWaterDemand"]).toEqual(expectedResult["HotWaterDemand"]);
	});

	it('maps secondary pipework input state to FHS input request', () => {
		// Arrange
		const pipework: Pipework = {
			primaryPipework: {
				data: []
			},
			secondaryPipework: {
				data: [{
					name: "secondaryPipework1",
					length: 111, 
					location: WaterPipeworkLocation.internal,
					internalDiameter: 6
				}],
				complete: true,
			}
		};

		store.$patch({
			domesticHotWater: {
				pipework
			}
		});

		// Acts
		const result = mapDistributionData(resolveState(store.$state));
		const expectedResult: SchemaHotWaterDemand['Distribution'] = [{
			internal_diameter_mm: 6,
			length: 111,
			location: WaterPipeworkLocation.internal
		}];

		// Assert
		expect(result).toEqual(expectedResult);
	});
});