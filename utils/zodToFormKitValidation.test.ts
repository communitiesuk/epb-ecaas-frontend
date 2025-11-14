import * as z from "zod";
import { zodTypeAsFormKitValidation } from "./zodToFormKitValidation";

describe("convert zod types to formkit validation strings", () => {
	it("converts a general string type to a validation string that reflects that it is required", () => {
		expect(zodTypeAsFormKitValidation(z.string())).toBe("required");
	});

	it("converts an optional string Zod definition to an empty string", () => {
		expect(zodTypeAsFormKitValidation(z.optional(z.string()))).toBe("");
	});

	it("converts a number definition to denote that it is required and a number", () => {
		expect(zodTypeAsFormKitValidation(z.number())).toBe("required | number");
	});

	it("converts an optional number Zod schema to just denote it is a number", () => {
		expect(zodTypeAsFormKitValidation(z.optional(z.number()))).toBe("number");
	});

	it("converts an number with min and max bounds to correct validation string", () => {
		expect(zodTypeAsFormKitValidation(z.number().min(0.001).max(50))).toBe("required | number | min:0.001 | max:50");
	});

	it("converts a Zod schema for a positive number to the correct validation string", () => {
		expect(zodTypeAsFormKitValidation(z.number().positive())).toBe("required | number | min:0.00001");
	});

	it("converts a Zod schema with a lt constraint on a number to a viable FormKit validation string", () => {
		expect(zodTypeAsFormKitValidation(z.number().min(0).lt(180))).toBe("required | number | min:0 | max:179.99999");
	});
});