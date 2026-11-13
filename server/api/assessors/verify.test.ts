import { describe, expect, it } from "vitest";
import { checkAssessor } from "./verify.post";

describe("Assessors verify logic", () => {
	it("returns isValid: true and email for a valid registered assessor", () => {
		const result = checkAssessor("Test Assessor", "TEST123");

		expect(result).toEqual({
			isValid: true,
			reason: null,
			email: "test.assessor@homes.co.uk",
		});
	});

	it("handles case-insensitive matching and whitespace", () => {
		const result = checkAssessor("  test assessor  ", "  test123  ");

		expect(result).toEqual({
			isValid: true,
			reason: null,
			email: "test.assessor@homes.co.uk",
		});
	});

	it("returns isValid: false with NO_EMAIL reason when assessor has no email", () => {
		const result = checkAssessor("No Email Assessor", "NOEMAIL123");

		expect(result).toEqual({
			isValid: false,
			reason: "NO_EMAIL",
			email: null,
		});
	});

	it("returns isValid: false with NOT_FOUND reason for unknown assessor credentials", () => {
		const result = checkAssessor("Unknown Person", "FAKE999");

		expect(result).toEqual({
			isValid: false,
			reason: "NOT_FOUND",
			email: null,
		});
	});

	it("throws a 400 error if name or id are missing", () => {
		expect(() => checkAssessor("Test Assessor", "")).toThrow();
		expect(() => checkAssessor(undefined, "TEST123")).toThrow();
	});
});