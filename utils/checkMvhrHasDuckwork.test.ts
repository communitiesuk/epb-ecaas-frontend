import { checkMvhrHasDuckwork } from "~/utils/checkMvhrHasDuckwork";

describe('checkMvhrHasDuckwork', () => {
	const store = useEcaasStore();
	const mechanicalVentilationData1: MechanicalVentilationData = {
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g"
	};
	const mechanicalVentilationData2: MechanicalVentilationData = {
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506h"
	};

	const mechanicalVentilationData3: MechanicalVentilationData = {
		id: "7184f2fe-a78f-4a56-ba5a-1a7751ac506d",
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: "decentralisedContinuous",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
		mvhrLocation: undefined,
		mvhrEfficiency: undefined,
	};

	const ductworkData1: DuctworkData = {
		name: "Ducktwork 1",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	const ductworkData2: DuctworkData = {
		name: "Ducktwork 2",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506h",
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	it('should return true if one mvhr has a ductwork ', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilationData1]
				},
				ductwork: {
					data: [ductworkData1]
				}
			}
		});

		expect(checkMvhrHasDuckwork()).toBe(true);
	});

	it('should return false if at least one mvhr does not have a corresponding ductwork', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilationData1, mechanicalVentilationData2]
				},
				ductwork: {
					data: [ductworkData1, ductworkData1]
				}
			}
		});

		expect(checkMvhrHasDuckwork()).toBe(false);
	});

	it('should handle multiple mechanical ventilation objects of different types', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilationData1, mechanicalVentilationData2, mechanicalVentilationData3]
				},
				ductwork: {
					data: [ductworkData1, ductworkData1, ductworkData2]
				}
			}
		});
		expect(checkMvhrHasDuckwork()).toBe(true);
	});
});