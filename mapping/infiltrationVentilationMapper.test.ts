import { VentType, SupplyAirFlowRateControlType, MVHRLocation, SupplyAirTemperatureControlType } from '~/schema/api-schema.types';
import { mapInfiltrationVentilationData } from './infiltrationVentilationMapper';

describe('infiltration ventilation mapper', () => {

	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps mechanical ventilation input state to FHS input request', () => {
		// Arrange
		const state: MechanicalVentilationData[] = [{
			id: "bathroom exhaust fan",
			name: "bathroom exhaust fan",
			typeOfMechanicalVentilationOptions: VentType.MVHR,
			controlForSupplyAirflow: SupplyAirFlowRateControlType.ODA, // to be removed (EC-540)
			supplyAirTemperatureControl: "TO_BE_REMOVED", // to be removed (EC-540)
			airFlowRate: 30,
			mvhrLocation: MVHRLocation.inside,
			mvhrEfficiency: 1,
		}];

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: state
				}				
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
	});
});
