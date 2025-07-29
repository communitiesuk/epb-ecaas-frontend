import { asMeters, length, LengthUnitName } from "./units";

describe('Length', () => {
	test('32 centimeters is equivalent to 0.32 meters', () => {
		const length1 = length(32, LengthUnitName.CENTIMETERS);
		expect(asMeters(length1)).toEqual(0.32);
	});

	test('0 centimeters is equivalent to 0 meters', () => {
		const length1 = length(0, LengthUnitName.CENTIMETERS);
		expect(asMeters(length1)).toEqual(0);
	});
    
	test('1000 millimeters is equivalent to 1 meter', () => {
		const length1 = length(1000, LengthUnitName.MILLIMETERS);
		expect(asMeters(length1)).toEqual(1);
	});

	test('0 millimeters is equivalent to 0 meters', () => {
		const length1 = length(0, LengthUnitName.MILLIMETERS);
		expect(asMeters(length1)).toEqual(0);
	});
});
