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
	test('0 liters is equivalent to 0 cubic meters', () => {
		const volume1 = new Volume(0, liter);
		const volume2 = new Volume(0, cubicMeter);
		expect(volume1.asCubicMeters()).toStrictEqual(volume2);
	});
    
	test('1 liter is equivalent to 0.001 cubic meters', () => {
		const volume1 = new Volume(1, liter);
		const volume2 = new Volume(0.001, cubicMeter);
		expect(volume1.asCubicMeters()).toStrictEqual(volume2);
	});

	test('1000 liters is equivalent to 1 cubic meters', () => {
		const volume1 = new Volume(1000, liter);
		const volume2 = new Volume(1, cubicMeter);
		expect(volume1.asCubicMeters()).toStrictEqual(volume2);
	});

	test('10 cubic meters is equivalent to 10 cubic meters', () => {
		const volume1 = new Volume(10, cubicMeter);
		const volume2 = new Volume(10, cubicMeter);
		expect(volume1).toStrictEqual(volume2);
		expect(volume1.asCubicMeters()).toStrictEqual(volume2);
	});
});
