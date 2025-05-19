import { MassDistributionClass } from "~/schema/api-schema.types";

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