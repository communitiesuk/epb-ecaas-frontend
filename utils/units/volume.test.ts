import { Volume, litre, cubicMetre } from "./volume";

describe('VolumeUnit', () => {
	test('suffix for litres is l', () => {
		expect(litre.suffix).toEqual("litres");
	});

	test('suffix for cubic metre is m³', () => {
		expect(cubicMetre.suffix).toEqual("m³");
	});
});

describe('Volume', () => {
	test('0 cubic metres is equivalent to 0 litres', () => {
		const volume = new Volume(0, cubicMetre);
		expect(volume.asLitres()).toEqual(0);
	});
    
	test('0.01 cubic metre is equivalent to 10 litre', () => {
		const volume = new Volume(0.01, cubicMetre);
		expect(volume.asLitres()).toEqual(10);
	});

	test('1 cubic metres is equivalent to 1000 litres', () => {
		const volume = new Volume(1, cubicMetre);
		expect(volume.asLitres()).toEqual(1000);
	});
});
