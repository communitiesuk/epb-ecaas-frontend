import { VentType, SupplyAirFlowRateControlType, MVHRLocation, SupplyAirTemperatureControlType, DuctShape, DuctType } from '~/schema/api-schema.types';
import { mapInfiltrationVentilationData, mapMechanicalVentilationData, mapVentsData } from './infiltrationVentilationMapper';

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
					data: mechVentMvhr
				},	
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(store);
    
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
					data: mechVentMvhr
				},
				ductwork: {
					data: ductwork
				}			
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(store);

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
					data: mechVentMvhr
				},	
			}
		});
    
		// Act
		const fhsInputData = mapInfiltrationVentilationData(store);

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
					data: mechVent
				}				
			}
		});

		// Act
		const fhsInputData = mapMechanicalVentilationData(store);
    
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
			pressureDifference: 20,
			orientation: 180,
			pitch: 45,
		}];

		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: ventData
				}				
			}
		});

		// Act
		const fhsInputData = mapVentsData(store);

		// Assert
		const vent = fhsInputData[ventName];
		expect(vent?.area_cm2).toBe(100);
		expect(vent?.mid_height_air_flow_path).toBe(1.5);
		expect(vent?.pressure_difference_ref).toBe(20);
		expect(vent?.orientation360).toBe(180);
		expect(vent?.pitch).toBe(45);
	});
});
