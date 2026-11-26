import { litrePerSecond } from "./flowRate";
import { metre } from "./length";
import { unitValue } from "./units";
import { addConstraints, zodUnit } from "./zod";

describe("zodUnit", () => {
	it("does not consider a number valid", () => {
		const zodLength = zodUnit("length");
		expect(() => zodLength.parse(4)).toThrow();
	});

	it("considers a unit value of the same dimension valid", () => {
		const zodLength = zodUnit("length");
		expect(zodLength.parse(unitValue(100, metre))).toBeTruthy();
	});

	it("does not consider a unit value of a different dimension as valid", () => {
		const zodLength = zodUnit("length");
		expect(() => zodLength.parse(unitValue(4, litrePerSecond))).toThrow();
	});
	describe("constraints", () => {
		it("does not consider a number below the minimum as valid", () => {
			const zodLength = addConstraints(zodUnit("length"), { min: 0 });
			expect(() => zodLength.parse(unitValue(-1, metre))).toThrow();
		});
		it("considers a number above the minimum as valid", () => {
			const zodLength = addConstraints(zodUnit("length"), { min: 0 });
			expect(zodLength.parse(unitValue(1, metre))).toBeTruthy();
		});
		it("does not consider a number above the maximum as valid", () => {
			const zodLength = addConstraints(zodUnit("length"), { max: 10 });
			expect(() => zodLength.parse(unitValue(11, metre))).toThrow();
		});
		it("considers a number below the maximum as valid", () => {
			const zodLength = addConstraints(zodUnit("length"), { max: 10 });
			expect(zodLength.parse(unitValue(9, metre))).toBeTruthy();
		});
		it("considers a number within the minimum and maximum as valid", () => {
			const zodLength = addConstraints(zodUnit("length"), { min: 0, max: 10 });
			expect(zodLength.parse(unitValue(5, metre))).toBeTruthy();
		});
		it("considers maximum and minimum as inclusive", () => {
			const zodLength = addConstraints(zodUnit("length"), { min: 0, max: 10 });
			expect(zodLength.parse(unitValue(0, metre))).toBeTruthy();
			expect(zodLength.parse(unitValue(10, metre))).toBeTruthy();
		});
		it("does not consider a min that is greater than the max as valid", () => {
			expect(() => addConstraints(zodUnit("length"), { min: 10, max: 0 })).toThrow();
			expect(() => addConstraints(zodUnit("length"), { min: -10, max: -20 })).toThrow();
		});
		it("considers max invalid when lt is set", () => {
			const zodLength = addConstraints(zodUnit("length"), {
				min: 0, lt: 10,
			});
			expect(() => zodLength.parse(unitValue(10, metre))).toThrow();
		});
		it("considers min invalid when gt is set", () => {
			const zodLength = addConstraints(zodUnit("length"), {
				gt: 0, max: 10,
			});
			expect(() => zodLength.parse(unitValue(0, metre))).toThrow();
		});
		it("does not allow both min and gt", () => {
			expect(() => addConstraints(zodUnit("length"), { min: 0, gt: 0 })).toThrow();
		});
		it("does not allow both max and lt", () => {
			expect(() => addConstraints(zodUnit("length"), { max: 10, lt: 10 })).toThrow();
		});
		it("adds constraints when applied multiple times", () => {
			const base = zodUnit("length");
			const withMax = addConstraints(base, { max: 10 });
			const withMaxAndGreaterThan = addConstraints(withMax, { gt: 1 });

			expect(withMaxAndGreaterThan.parse(unitValue(5, metre))).toBeTruthy();
			expect(() => withMaxAndGreaterThan.parse(unitValue(10, metre))).toBeTruthy();
			expect(() => withMaxAndGreaterThan.parse(unitValue(0, metre))).toThrow();
			expect(() => withMaxAndGreaterThan.parse(unitValue(1, metre))).toThrow();
			expect(() => withMaxAndGreaterThan.parse(unitValue(11, metre))).toThrow();
		});
	});
});
