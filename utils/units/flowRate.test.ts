import { FlowRate, cubicMetrePerHour, litrePerSecond } from "./flowRate";

describe('FlowRateUnit', () => {
	test('suffix for cubic metre per hour is m³/h', () => {
		expect(cubicMetrePerHour.suffix).toEqual("m³/h");
	});

	test('suffix for litre per second is l/s', () => {
		expect(litrePerSecond.suffix).toEqual("litres per second");
	});
});

describe('FlowRate', () => {
	test('0 litres per second is equivalent to 0 cubic metres per hour', () => {
		const flowRate = new FlowRate(0, litrePerSecond);
		expect(flowRate.asCubicMetresPerHour()).toEqual(0);
	});
    
	test('1 litre per second is equivalent to 3.6 cubic metres per hour', () => {
		const flowRate = new FlowRate(1, litrePerSecond);
		expect(flowRate.asCubicMetresPerHour()).toEqual(3.6);
	});

	test('30 litres per second is equivalent to 108 cubic metres per hour', () => {
		const flowRate = new FlowRate(30, litrePerSecond);
		expect(flowRate.asCubicMetresPerHour()).toEqual(108);
	});
});
