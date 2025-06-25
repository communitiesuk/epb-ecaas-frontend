import { VentType, SupplyAirFlowRateControlType, MVHRLocation, SupplyAirTemperatureControlType, DuctShape, DuctType, FlueGasExhaustSituation, CombustionFuelType, CombustionAirSupplySituation, CombustionApplianceType } from '~/schema/api-schema.types';
import { mapAirPermeabilityData, mapCombustionAppliancesData, mapInfiltrationVentilationData, mapMechanicalVentilationData, mapVentilationData, mapVentsData } from './infiltrationVentilationMapper';

const baseForm = {
	data: [],
	complete: true,
};

describe('infiltration ventilation mapper', () => {
	const mechVentMvhr: MechanicalVentilationData[] = [{
		id: "bathroom exhaust fan",
		name: "bathroom exhaust fan",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		controlForSupplyAirflow: SupplyAirFlowRateControlType.ODA, // to be removed (EC-540)
		supplyAirTemperatureControl: "TO_BE_REMOVED", // to be removed (EC-540)
		airFlowRate: 30,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 1,
	}];

	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps mechanical ventilation of type MVHR input state to FHS input request', () => {
		// Arrange
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr,
				},
				naturalVentilation: {
					...baseForm,
					data: {}
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: 5.0,
						airTightnessTestResult: 2.2,
					}
				},
				vents: {
					...baseForm,
				}
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));
    
		// Assert
		expect(fhsInputData.InfiltrationVentilation).toBeDefined();
		expect(fhsInputData.InfiltrationVentilation?.MechanicalVentilation).toBeDefined();

		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!['bathroom exhaust fan'];
		expect(firstMechVent).toBeDefined();
		expect(firstMechVent?.EnergySupply).toBe("mains elec");
		expect(firstMechVent?.vent_type).toBe(VentType.MVHR);
		expect(firstMechVent?.design_outdoor_air_flow_rate).toBe(30);
		expect(firstMechVent?.sup_air_flw_ctrl).toBe(SupplyAirFlowRateControlType.ODA); 
		expect(firstMechVent?.sup_air_temp_ctrl).toBe(SupplyAirTemperatureControlType.CONST);
		expect(firstMechVent?.mvhr_location).toBe(MVHRLocation.inside);
		expect(firstMechVent?.mvhr_eff).toBe(1);
		expect(firstMechVent?.measured_air_flow_rate).toBe(37); // NOTE - hardcoded to sensible default for now
		expect(firstMechVent?.measured_fan_power).toBe(12.26); // NOTE - hardcoded to sensible default for now
		expect(firstMechVent?.ductwork).toBeDefined();
	});


	it('maps ductwork input state to FHS input request', () => {
		// Arrange
		
		const ductwork: DuctworkData[] = [{
			name: "ductwork 1",
			mvhrUnit: "bathroom exhaust fan",
			ductworkCrossSectionalShape: DuctShape.circular,
			internalDiameterOfDuctwork: 200,
			externalDiameterOfDuctwork: 300,
			lengthOfDuctwork: 10.0,
			thermalInsulationConductivityOfDuctwork: 0.023,
			insulationThickness: 100,
			surfaceReflectivity: false,
			ductType: DuctType.extract
		}];

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr
				},
				ductwork: {
					...baseForm,
					data: ductwork
				},
				naturalVentilation: {
					...baseForm,
					data: {}
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: 5.0,
						airTightnessTestResult: 2.2,
					}
				},
				vents: {
					...baseForm,
				}
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));

		// Assert
		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!['bathroom exhaust fan'];
		const firstDuctwork = firstMechVent!.ductwork![0];

		expect(firstDuctwork?.cross_section_shape).toBe(DuctShape.circular);
		expect(firstDuctwork?.internal_diameter_mm).toBe(200);
		expect(firstDuctwork?.external_diameter_mm).toBe(300);
		expect(firstDuctwork?.length).toBe(10);
		expect(firstDuctwork?.insulation_thermal_conductivity).toBe(0.023);
		expect(firstDuctwork?.insulation_thickness_mm).toBe(100);
		expect(firstDuctwork?.reflective).toBe(false);
		expect(firstDuctwork?.duct_type).toBe(DuctType.extract);
	});

	it('maps input state for MVHR without ductwork to FHS input request', () => {
		// Arrange

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVentMvhr,
				},
				airPermeability: {
					...baseForm,
					data: {
						testPressure: 5.0,
						airTightnessTestResult: 2.2,
					},
				},
				naturalVentilation: {
					...baseForm,
					data: {},
				},
				vents: {
					...baseForm,
				}
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(resolveState(store.$state));

		// Assert
		const firstMechVent = fhsInputData.InfiltrationVentilation!.MechanicalVentilation!['bathroom exhaust fan'];

		expect(firstMechVent!.ductwork).toStrictEqual([]);
	});



	it('maps mechanical ventilation of type intermittent MEV input state to FHS input request', () => {
		// Arrange
		const mechVent: MechanicalVentilationData[] = [{
			id: "bathroom exhaust fan",
			name: "bathroom exhaust fan",
			typeOfMechanicalVentilationOptions: VentType.Intermittent_MEV,
			controlForSupplyAirflow: SupplyAirFlowRateControlType.ODA, // to be removed (EC-540)
			supplyAirTemperatureControl: "TO_BE_REMOVED", // to be removed (EC-540)
			airFlowRate: 30,
		}];

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					...baseForm,
					data: mechVent,
				}				
			}
		});

		// Act
		const fhsInputData = mapMechanicalVentilationData(resolveState(store.$state));
    
		// Assert
		const firstMechVent = fhsInputData['bathroom exhaust fan'];
		expect(firstMechVent).toBeDefined();
		expect(firstMechVent?.EnergySupply).toBe("mains elec");
		expect(firstMechVent?.vent_type).toBe(VentType.Intermittent_MEV);
		expect(firstMechVent?.design_outdoor_air_flow_rate).toBe(30);
		expect(firstMechVent?.sup_air_flw_ctrl).toBe(SupplyAirFlowRateControlType.ODA); 
		expect(firstMechVent?.sup_air_temp_ctrl).toBe(SupplyAirTemperatureControlType.CONST);
		expect(firstMechVent?.measured_air_flow_rate).toBe(37); // NOTE - hardcoded to sensible default for now
		expect(firstMechVent?.measured_fan_power).toBe(12.26); // NOTE - hardcoded to sensible default for now
		expect(firstMechVent?.ductwork).toBeUndefined();
	});

	it('maps vents to FHS input request', async () => {
		const ventName = 'Acme'; 

		// Arrange
		const ventData: VentData[] = [{
			name: ventName,
			typeOfVent: "Air brick",
			effectiveVentilationArea: 100,
			openingRatio: 0.6,
			midHeightOfZone: 1.5,
			orientation: 180,
			pitch: 45,
		}];

		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					...baseForm,
					data: ventData,
				}				
			}
		});

		// Act
		const fhsInputData = mapVentsData(resolveState(store.$state));

		// Assert
		const vent = fhsInputData[ventName];
		expect(vent?.area_cm2).toBe(100);
		expect(vent?.mid_height_air_flow_path).toBe(1.5);
		expect(vent?.pressure_difference_ref).toBe(20);
		expect(vent?.orientation360).toBe(180);
		expect(vent?.pitch).toBe(45);
	});

	it('maps ventilation data to extract needed fields', async () => {
		// Arrange
		const ventilationData: VentilationData = {
			dwellingHeight: 10,
			dwellingEnvelopeArea: 200,
			dwellingElevationalLevelAtBase: 4,
			crossVentFactor: true,
			maxRequiredAirChangeRate: 1.5,
		};

		store.$patch({
			infiltrationAndVentilation: {
				naturalVentilation: {
					...baseForm,
					data: ventilationData,
				}
			}
		});

		// Act
		const fhsInputData = mapVentilationData(resolveState(store.$state));
		const expectedVentilationData = {
			dwellingHeight: 10,
			dwellingEnvelopeArea: 200,
			dwellingElevationalLevelAtBase: 4,
			crossVentFactor: true,
		};
		expect(fhsInputData).toEqual(expectedVentilationData);
	});

	it('maps air permeability data to extract needed fields', async () => {
		// Arrange
		const airPermeabilityData: AirPermeabilityData = {
			testPressure: 50,
			airTightnessTestResult: 5,
		};

		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					...baseForm,
					data: airPermeabilityData,
				}
			}
		});

		// Act
		const fhsInputData = mapAirPermeabilityData(resolveState(store.$state));

		// Assert
		expect(fhsInputData.test_pressure).toBe(50);
		expect(fhsInputData.test_result).toBe(5);
	});

	it('maps combustion appliances data to FHS input request', () => {
		// Arrange
		const combustionAppliances: CombustionApplianceData[] = [{
			name: "Gas Boiler",
			airSupplyToAppliance: CombustionAirSupplySituation.room_air,
			exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
			typeOfFuel: CombustionFuelType.gas
		}];

		store.$patch({
			infiltrationAndVentilation: {
				combustionAppliances: {
					[CombustionApplianceType.open_gas_fire]: {
						...baseForm,
						data: combustionAppliances,
					}
				}
			}
		});

		// Act
		const fhsInputData = mapCombustionAppliancesData(resolveState(store.$state));

		// Assert
		const gasBoiler = fhsInputData["Gas Boiler"];
		expect(gasBoiler).toBeDefined();
		expect(gasBoiler?.supply_situation).toBe(CombustionAirSupplySituation.room_air);
		expect(gasBoiler?.exhaust_situation).toBe(FlueGasExhaustSituation.into_mech_vent);
		expect(gasBoiler?.fuel_type).toBe(CombustionFuelType.gas);
		expect(gasBoiler?.appliance_type).toBe(CombustionApplianceType.open_gas_fire);
	});
});