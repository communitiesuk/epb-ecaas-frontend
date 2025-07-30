import { Volume, liter, cubicMeter } from "./unitsVolume";

describe('VolumeUnit', () => {
	test('suffix for litres is l', () => {
		expect(liter.suffix).toEqual("l");
	});

	test('suffix for cubic meter is m³', () => {
		expect(cubicMeter.suffix).toEqual("m³");
	});
});

describe('Volume', () => {
	test('0 cubic meters is equivalent to 0 liters', () => {
		const volume1 = new Volume(0, cubicMeter);
		const volume2 = new Volume(0, liter);
		expect(volume1.asLiters()).toStrictEqual(volume2);
	});
    
	test('0.01 cubic meter is equivalent to 10 liter', () => {
		const volume1 = new Volume(0.01, cubicMeter);
		const volume2 = new Volume(10, liter);
		expect(volume1.asLiters()).toStrictEqual(volume2);
	});

	test('1 cubic meters is equivalent to 1000 liters', () => {
		const volume1 = new Volume(1, cubicMeter);
		const volume2 = new Volume(1000, liter);
		expect(volume1.asLiters()).toStrictEqual(volume2);
	});
});
