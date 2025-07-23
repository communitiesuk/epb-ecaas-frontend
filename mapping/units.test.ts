import { Length, LengthUnit } from "./units";

describe('Length', () => {
	test('32 centimeters is equivalent to 0.32 meters', () => {
		const length1 = new Length(32, LengthUnit.CENTIMETERS);
		expect(length1.inMeters()).toEqual(0.32);
	});

	test('0 centimeters is equivalent to 0 meters', () => {
		const length1 = new Length(0, LengthUnit.CENTIMETERS);
		expect(length1.inMeters()).toEqual(0);
	});
    
	test('1000 millimeters is equivalent to 1 meter', () => {
		const length1 = new Length(1000, LengthUnit.MILLIMETERS);
		expect(length1.inMeters()).toEqual(1);
	});

	test('0 millimeters is equivalent to 0 meters', () => {
		const length1 = new Length(0, LengthUnit.MILLIMETERS);
		expect(length1.inMeters()).toEqual(0);
	});
});
