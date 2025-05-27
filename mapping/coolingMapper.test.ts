import { SpaceCoolSystemType, type SchemaSpaceCoolSystemDetails } from "~/schema/api-schema.types";
import { mapSpaceCoolSystems } from "./coolingMapper";


describe('cooling mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps air conditioning input state to FHS input request', () => {
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
					data: [airConditioning],
					complete: true
				}
			}
		});

		// Acts
		const result = mapSpaceCoolSystems(resolveState(store.$state));

		// Assert
		const expectedResult: Record<string, SchemaSpaceCoolSystemDetails> = {
			"airCon1": {
				EnergySupply: "mains elec",
				cooling_capacity: 4,
				frac_convective: 1,
				efficiency: 1,
				type: SpaceCoolSystemType.AirConditioning,
			}
		};

		expect(result).toEqual(expectedResult);
	});

	it('maps two air conditioners to an FHS input request', () => {
		// Arrange
		const airConditioner1: AirConditioningData = {
			name: "airConditioner1",
			coolingCapacity: 1,
			seasonalEnergyEfficiencyRatio:2,
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
					data: [airConditioner1, airConditioner2],
					complete: true,
				}
			}
		});

		// Acts
		const result = mapSpaceCoolSystems(resolveState(store.$state));

		// Assert
		const expectedResult: Record<string, SchemaSpaceCoolSystemDetails> = {
			"airConditioner1": {
				EnergySupply: "mains elec",
				cooling_capacity: 1,
				frac_convective: 3,
				efficiency: 2,
				type: SpaceCoolSystemType.AirConditioning,
			},
			"airConditioner2": {
				EnergySupply: "mains elec",
				cooling_capacity: 7,
				frac_convective: 5,
				efficiency: 6,
				type: SpaceCoolSystemType.AirConditioning,
			},
		};

		expect(result).toEqual(expectedResult);
	});
});