import { unitValue } from "./units";
import { litre, cubicMetre, asLitres } from "./volume";

describe("VolumeUnit", () => {
	test("suffix for litres is l", () => {
		expect(litre.suffix).toEqual("litres");
	});

	test("suffix for cubic metre is m³", () => {
		expect(cubicMetre.suffix).toEqual("m³");
	});
});

describe("Volume", () => {
	test("0 cubic metres is equivalent to 0 litres", () => {
		const volume = unitValue(0, cubicMetre);
		expect(asLitres(volume)).toEqual(0);
	});
    
	test("0.01 cubic metre is equivalent to 10 litre", () => {
		const volume = unitValue(0.01, cubicMetre);
		expect(asLitres(volume)).toEqual(10);
	});

	test("1 cubic metres is equivalent to 1000 litres", () => {
		const volume = unitValue(1, cubicMetre);
		expect(asLitres(volume)).toEqual(1000);
	});
});
