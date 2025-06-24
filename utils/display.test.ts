import { ApplianceKey, FlueGasExhaustSituation, MassDistributionClass } from "~/schema/api-schema.types";

describe('Show boolean in display', () => {
	it('should return Yes when value is true', () => {
		const result = displayBoolean(true);
		expect(result).toBe('Yes');
	});

	it('should return No when value is false', () => {
		const result = displayBoolean(false);
		expect(result).toBe('No');
	});

	it('should return undefined when value is undefined', () => {
		const result = displayBoolean(undefined);
		expect(result).toBe(undefined);
	});
});

describe('Show MassDistributionClass in display', () => {
	it('should return Internal when value is I', () => {
		const result = displayMassDistributionClass(MassDistributionClass.I);
		expect(result).toBe('Internal');
	});

	it('should return External when value is E', () => {
		const result = displayMassDistributionClass(MassDistributionClass.E);
		expect(result).toBe('External');
	});

	it('should return Divided when value is IE', () => {
		const result = displayMassDistributionClass(MassDistributionClass.IE);
		expect(result).toBe('Divided');
	});

	it('should return Equally when value is D', () => {
		const result = displayMassDistributionClass(MassDistributionClass.D);
		expect(result).toBe('Equally');
	});

	it('should return Inside when value is M', () => {
		const result = displayMassDistributionClass(MassDistributionClass.M);
		expect(result).toBe('Inside');
	});

	it('should return undefined when value is undefined', () => {
		const result = displayMassDistributionClass(undefined);
		expect(result).toBe(undefined);
	});
});

describe('Show string in sentence case', () => {
	it('should return string in sentence case', () => {
		const result = sentenceCase('hello_world');
		expect(result).toBe('Hello world');
	});

	it('should return string in sentence case with multiple underscores and initial capital', () => {
		const result = sentenceCase('Hello_world_test');
		expect(result).toBe('Hello world test');
	});

	it('should return string in sentence case with no underscores', () => {
		const result = sentenceCase('helloworld');
		expect(result).toBe('Helloworld');
	});

	it('should return string in sentence with no spaces at start', () => {
		const result = sentenceCase('_energy_from_environment');
		expect(result).toBe('Energy from environment');
	});
});

describe('Show flue gas exhaust situation in display', () => {
	it('should display correct representiation of flue gas exhasut situation "into room"', () => {
		const result = displayFlueGasExhaustSituation(FlueGasExhaustSituation.into_room);
		expect(result).toBe('Into room');
	});

	it('should display correct representiation of flue gas exhasut situation "into mechanical vent"', () => {
		const result = displayFlueGasExhaustSituation(FlueGasExhaustSituation.into_mech_vent);
		expect(result).toBe('Into mechanical vent');
	});

	it('should display correct representiation of flue gas exhasut situation "into separate duct"', () => {
		const result = displayFlueGasExhaustSituation(FlueGasExhaustSituation.into_separate_duct);
		expect(result).toBe('Into separate duct');
	});
});

describe('displaySnakeToSentenceCase', () => {
	it('should convert snake_case to Sentence Case', () => {
		const result = displaySnakeToSentenceCase('hello_world');
		expect(result).toBe('Hello world');
	});

	it('should convert snake_case with multiple underscores to sentence case', () => {
		const result = displaySnakeToSentenceCase('hello_world_test');
		expect(result).toBe('Hello world test');
	});

	it('should return the same string (but capitalised) if no underscores are present', () => {
		const result = displaySnakeToSentenceCase('helloworld');
		expect(result).toBe('Helloworld');
	});
});

describe('displayDeliveryEnergyUseKey', () => {
	it('should convert an appliance key to the correct display value', () => {
		expect(displayDeliveryEnergyUseKey(ApplianceKey.Clothes_washing)).toBe("Washing machine");
	});

	it('should pass anything else through verbatim', () => {
		expect(displayDeliveryEnergyUseKey('acme')).toBe('acme');
	});
});