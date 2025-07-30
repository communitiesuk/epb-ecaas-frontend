import { Length, meter, centimeter, millimeter } from "./unitsLength";

describe('LengthUnit', () => {
	test('suffix for meter is m', () => {
		expect(meter.suffix).toEqual("m");
	});

	test('suffix for centimeter is cm', () => {
		expect(centimeter.suffix).toEqual("cm");
	});

	test('suffix for millimeter is mm', () => {
		expect(millimeter.suffix).toEqual("mm");
	});
});

describe('Length', () => {
	test('32 centimeters is equivalent to 0.32 meters', () => {
		const length1 = new Length(32, centimeter);
		expect(length1.asMeters().amount).toEqual(0.32);
	});

	test('0 centimeters is equivalent to 0 meters', () => {
		const length1 = new Length(0, centimeter);
		expect(length1.asMeters().amount).toEqual(0);
	});
    
	test('1000 millimeters is equivalent to 1 meter', () => {
		const length1 = new Length(1000, millimeter);
		expect(length1.asMeters().amount).toEqual(1);
	});

	test('0 millimeters is equivalent to 0 meters', () => {
		const length1 = new Length(0, millimeter);
		expect(length1.asMeters().amount).toEqual(0);
	});
});
