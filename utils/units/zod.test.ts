import { litrePerSecond } from "./flowRate";
import { metre } from "./length";
import { unitValue } from "./units";
import { zodUnit } from "./zod";

describe("zodUnit", () => {
	it("does not consider a number valid", () => {
		const zodLength = zodUnit("length");
		expect(() => zodLength.parse(4)).toThrowError();
	});

	it("considers a unit value of the same dimension valid", () => {
		const zodLength = zodUnit("length");
		expect(zodLength.parse(unitValue(100, metre))).toBeTruthy();
	});

	it("does not consider a unit value of a different dimension as valid", () => {
		const zodLength = zodUnit("length");
		expect(() => zodLength.parse(unitValue(4, litrePerSecond))).toThrowError();
	});
	describe("constraints", () => {
		it("does not consider a number below the minimum as valid", () => {
			const zodLength = zodUnit("length", { min: 0 });
			expect(() => zodLength.parse(unitValue(-1, metre))).toThrowError();
		});
		it("considers a number above the minimum as valid", () => {
			const zodLength = zodUnit("length", { min: 0 });
			expect(zodLength.parse(unitValue(1, metre))).toBeTruthy();
		});
		it("does not consider a number above the maximum as valid", () => {
			const zodLength = zodUnit("length", { max: 10 });
			expect(() => zodLength.parse(unitValue(11, metre))).toThrowError();
		});
		it("considers a number below the maximum as valid", () => {
			const zodLength = zodUnit("length", { max: 10 });
			expect(zodLength.parse(unitValue(9, metre))).toBeTruthy();
		});
		it("considers a number within the minimum and maximum as valid", () => {
			const zodLength = zodUnit("length", { min: 0, max: 10 });
			expect(zodLength.parse(unitValue(5, metre))).toBeTruthy();
		});
		it("considers maximum and minimum as inclusive", () => {
			const zodLength = zodUnit("length", { min: 0, max: 10 });
			expect(zodLength.parse(unitValue(0, metre))).toBeTruthy();
			expect(zodLength.parse(unitValue(10, metre))).toBeTruthy();
		});
		it("does not consider a min that is greater than the max as valid", () => {
			expect(() => zodUnit("length", { min: 10, max: 0 })).toThrowError();
			expect(() => zodUnit("length", { min: -10, max: -20 })).toThrowError();
		});
		it("it considers max invalid when set to exclusive", () => {
			const zodLength = zodUnit("length", {
				min: 0, max: 10, exclusiveMax: true,
			});
			expect(() => zodLength.parse(unitValue(10, metre))).toThrowError();
		});
		it("it considers min invalid when set to exclusive", () => {
			const zodLength = zodUnit("length", {
				min: 0, max: 10, exclusiveMin: true,
			});
			expect(() => zodLength.parse(unitValue(0, metre))).toThrowError();
		});
	});
});
