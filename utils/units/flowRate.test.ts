import { FlowRate, cubicMetrePerHour, litrePerSecond } from "./flowRate";

describe('FlowRateUnit', () => {
	test('suffix for cubic metre per hour is m³/h', () => {
		expect(cubicMetrePerHour.suffix).toEqual("m³/h");
	});

	test('suffix for litre per second is l/s', () => {
		expect(litrePerSecond.suffix).toEqual("l/s");
	});
});

describe('FlowRate', () => {
	test('0 litres per second is equivalent to 0 cubic metres per hour', () => {
		const flowRate1 = new FlowRate(0, litrePerSecond);
		const volume2 = new FlowRate(0, cubicMetrePerHour);
		expect(flowRate1.asCubicMetresPerHour()).toStrictEqual(volume2);
	});
    
	test('1 litre per second is equivalent to 3.6 cubic metres per hour', () => {
		const flowRate1 = new FlowRate(1, litrePerSecond);
		const flowRate2 = new FlowRate(3.6, cubicMetrePerHour);
		expect(flowRate1.asCubicMetresPerHour()).toStrictEqual(flowRate2);
	});

	test('30 litres per second is equivalent to 108 cubic metres per hour', () => {
		const flowRate1 = new FlowRate(30, litrePerSecond);
		const flowRate2 = new FlowRate(108, cubicMetrePerHour);
		expect(flowRate1.asCubicMetresPerHour()).toStrictEqual(flowRate2);
	});
});
