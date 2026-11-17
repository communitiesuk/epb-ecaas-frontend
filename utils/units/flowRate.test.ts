import { asCubicMetresPerHour, cubicMetresPerHour, litrePerMinute, litrePerSecond } from "./flowRate";
import { unitValue } from "./units";

describe("FlowRateUnit", () => {
	test("suffix for cubic metre per hour is m³/h", () => {
		expect(cubicMetresPerHour.suffix).toEqual("m³/h");
	});

	test("suffix for litre per second is l/s", () => {
		expect(litrePerSecond.suffix).toEqual("litres per second");
	});
});

describe("FlowRate", () => {
	test("0 litres per second is equivalent to 0 cubic metres per hour", () => {
		const flowRate = unitValue(0, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(0);
	});

	test("1 litre per second is equivalent to 3.6 cubic metres per hour", () => {
		const flowRate = unitValue(1, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(3.6);
	});

	test("30 litres per second is equivalent to 108 cubic metres per hour", () => {
		const flowRate = unitValue(30, litrePerSecond);
		expect(asCubicMetresPerHour(flowRate)).toEqual(108);
	});
	test("0 litres per minute is equivalent to 0 cubic metres per hour", () => {
		const flowRate = unitValue(0, litrePerMinute);
		expect(asCubicMetresPerHour(flowRate)).toEqual(0);
	});

	test("1 litre per minute is equivalent to 0.06 cubic metres per hour", () => {
		const flowRate = unitValue(1, litrePerMinute);
		expect(asCubicMetresPerHour(flowRate)).toEqual(0.06);
	});

	test("30 litres per minute is equivalent to 1.8 cubic metres per hour", () => {
		const flowRate = unitValue(30, litrePerMinute);
		// float precision check might be needed for more complex cases
		expect(asCubicMetresPerHour(flowRate)).toBeCloseTo(1.8);
	});
});
