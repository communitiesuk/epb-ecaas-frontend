import type { SchemaThermalBridgeJunctionType } from "~/schema/aliases";
import { useJunctionValidation } from "./junctionValidation";

describe("Junction validation", () => {
	const store = useEcaasStore();

	const groundFloor: Partial<GroundFloorData> = {
		id: "0d5b322a-8bd7-4f45-8027-ebe9f2056e70",
		name: "Ground 1",
		perimeter: 40,
	};

	const linearThermalBridgeData = {
		name: "E5",
		linearThermalTransmittance: 1,
		length: 30,
		reference: "Ref",
	};

	beforeEach(() => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{ data: groundFloor }],
					},
				},
			},
		});
	});

	it("Returns true if total length of associated junctions is less than or equal to the perimeter", () => {
		const linearThermalBridge: LinearThermalBridgeData = {
			...linearThermalBridgeData,
			typeOfThermalBridge: "E5",
			associatedItemId: groundFloor.id!,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: {
						data: [{ data: linearThermalBridge }],
					},
				},
			},
		});

		const isValid = useJunctionValidation();

		expect(isValid).toBe(true);
	});

	it("Returns false if the total length of associated junctions is greater than the perimeter", () => {
		const linearThermalBridge: LinearThermalBridgeData = {
			...linearThermalBridgeData,
			typeOfThermalBridge: "E5",
			length: 50,
			associatedItemId: groundFloor.id!,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: {
						data: [{ data: linearThermalBridge }],
					},
				},
			},
		});

		const isValid = useJunctionValidation();

		expect(isValid).toBe(false);
	});

	it("Returns false if E5 thermal bridges are not associated with a ground floor", () => {
		const types: SchemaThermalBridgeJunctionType[] = ["E5", "E6"];

		types.forEach(typeOfThermalBridge => {
			const linearThermalBridge = {
				name: typeOfThermalBridge,
				typeOfThermalBridge,
				linearThermalTransmittance: 1,
				length: 30,
				reference: "Ref",
			} as LinearThermalBridgeData;

			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: {
							data: [{ data: linearThermalBridge }],
						},
					},
				},
			});

			const isValid = useJunctionValidation();

			expect(isValid).toBe(false);
		});
	});
});