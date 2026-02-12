import { checkMvhrHasDuctwork } from "~/utils/checkMvhrHasDuctwork";

describe("checkMvhrHasDuctwork", () => {
	const store = useEcaasStore();
	const mechanicalVentilationData1: MechanicalVentilationData = {
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "MVHR",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
		productReference: "1000",
	};
	const mechanicalVentilationData2: MechanicalVentilationData = {
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "MVHR",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506h",
		productReference: "1000",
	};

	const mechanicalVentilationData3: MechanicalVentilationData = {
		id: "7184f2fe-a78f-4a56-ba5a-1a7751ac506d",
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: "Decentralised continuous MEV",
		airFlowRate: 14,
		productReference: "1000",
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
		surfaceReflectivity: true,
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
		surfaceReflectivity: true,
	};

	it("should return true if one mvhr has a ductwork ", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData1 },
					],
				},
				ductwork: {
					data: [
						{ data: ductworkData1 },
					],
				},
			},
		});

		expect(checkMvhrHasDuctwork()).toBe(true);
	});

	it("should return false if at least one mvhr does not have a corresponding ductwork", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData1 },
						{ data: mechanicalVentilationData2 },
					],
				},
				ductwork: {
					data: [
						{ data: ductworkData1 },
						{ data: ductworkData1 },
					],
				},
			},
		});

		expect(checkMvhrHasDuctwork()).toBe(false);
	});

	it("should handle multiple mechanical ventilation objects of different types", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData1 },
						{ data: mechanicalVentilationData2 },
						{ data: mechanicalVentilationData3 },
					],
				},
				ductwork: {
					data: [
						{ data: ductworkData1 },
						{ data: ductworkData1 },
						{ data: ductworkData2 },
					],
				},
			},
		});
		expect(checkMvhrHasDuctwork()).toBe(true);
	});
});