import { asCubicMetresPerHour, cubicMetresPerHour, litrePerSecond } from "./flowRate";
import { unitValue } from "./types";

describe('FlowRateUnit', () => {
	test('suffix for cubic metre per hour is m³/h', () => {
		expect(cubicMetresPerHour.suffix).toEqual("m³/h");
	});

	test('suffix for litre per second is l/s', () => {
		expect(litrePerSecond.suffix).toEqual("litres per second");
	});
});

describe('FlowRate', () => {
	test('0 litres per second is equivalent to 0 cubic metres per hour', () => {
		const flowRate = unitValue(0, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(0);
	});
    
	test('1 litre per second is equivalent to 3.6 cubic metres per hour', () => {
		const flowRate = unitValue(1, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(3.6);
	});

	test('30 litres per second is equivalent to 108 cubic metres per hour', () => {
		const flowRate = unitValue(30, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(108);
	});
});
