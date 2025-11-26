import type { FhsInputSchema } from "./fhsInputMapper";
import { mapSpaceCoolSystems } from "./coolingMapper";


describe("cooling systems mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps air conditioning input state to FHS input request", () => {
		// Arrange
		const airConditioning: AirConditioningData = {
			name: "airCon1",
			coolingCapacity: 4,
			seasonalEnergyEfficiencyRatio: 1,
			convectionFraction: 1,
		};

		store.$patch({
			cooling: {
				airConditioning: {
					data: [{ data: airConditioning, complete: true }],
					complete: true,
				},
			},
		});

		// Acts
		const result = mapSpaceCoolSystems(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "SpaceCoolSystem"> = {
			SpaceCoolSystem: {
				"airCon1": {
					EnergySupply: "mains elec",
					cooling_capacity: 4,
					frac_convective: 1,
					efficiency: 1,
					type: "AirConditioning",
				},
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps two air conditioners to an FHS input request", () => {
		// Arrange
		const airConditioner1: AirConditioningData = {
			name: "airConditioner1",
			coolingCapacity: 1,
			seasonalEnergyEfficiencyRatio: 2,
			convectionFraction: 3,
		};

		const airConditioner2: AirConditioningData = {
			name: "airConditioner2",
			coolingCapacity: 7,
			seasonalEnergyEfficiencyRatio: 6,
			convectionFraction: 5,
		};

		store.$patch({
			cooling: {
				airConditioning: {
					data: [{
						data: airConditioner1,
						complete: true,
					}, {
						data: airConditioner2,
						complete: true,
					}],
					complete: true,
				},
			},
		});

		// Acts
		const result = mapSpaceCoolSystems(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "SpaceCoolSystem"> = {
			SpaceCoolSystem: {
				"airConditioner1": {
					EnergySupply: "mains elec",
					cooling_capacity: 1,
					frac_convective: 3,
					efficiency: 2,
					type: "AirConditioning",
				},
				"airConditioner2": {
					EnergySupply: "mains elec",
					cooling_capacity: 7,
					frac_convective: 5,
					efficiency: 6,
					type: "AirConditioning",
				},
			},
		};

		expect(result).toEqual(expectedResult);
	});
});