import { litrePerSecond } from "./flowRate";
import { metre } from "./length";
import { unitValue } from "./types";
import { zodUnit } from "./zod";

describe('zodUnit', () => {
	it('does not consider a number valid', () => {
		const zodLength = zodUnit('length');
		expect(() => zodLength.parse(4)).toThrowError();
	});

	it('considers a unit value of the same dimension valid', () => {
		const zodLength = zodUnit('length');
		expect(zodLength.parse(unitValue(100, metre))).toBeTruthy();
	});

	it('does not consider a unit value of a different dimension as valid', () => {
		const zodLength = zodUnit('length');
		expect(() => zodLength.parse(unitValue(4, litrePerSecond))).toThrowError();
	});
});