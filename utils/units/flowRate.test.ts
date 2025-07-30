import { FlowRate, cubicMeterPerHour, literPerSecond } from "./flowRate";

describe('FlowRateUnit', () => {
	test('suffix for cubic meter per hour is m³/h', () => {
		expect(cubicMeterPerHour.suffix).toEqual("m³/h");
	});

	test('suffix for liter per second is l/s', () => {
		expect(literPerSecond.suffix).toEqual("l/s");
	});
});

describe('FlowRate', () => {
	test('0 liters per second is equivalent to 0 cubic meters per hour', () => {
		const flowRate1 = new FlowRate(0, literPerSecond);
		const volume2 = new FlowRate(0, cubicMeterPerHour);
		expect(flowRate1.asCubicMetersPerHour()).toStrictEqual(volume2);
	});
    
	test('1 liter per second is equivalent to 0.001 cubic meter per hour', () => {
		const flowRate1 = new FlowRate(1, literPerSecond);
		const flowRate2 = new FlowRate(0.001, cubicMeterPerHour);
		expect(flowRate1.asCubicMetersPerHour()).toStrictEqual(flowRate2);
	});

	test('30 liters per second is equivalent to 0.001 cubic meters per hour', () => {
		const flowRate1 = new FlowRate(30, literPerSecond);
		const flowRate2 = new FlowRate(0.03, cubicMeterPerHour);
		expect(flowRate1.asCubicMetersPerHour()).toStrictEqual(flowRate2);
	});
});
