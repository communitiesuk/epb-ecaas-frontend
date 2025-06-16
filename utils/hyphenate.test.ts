import hyphenate from "./hyphenate";

describe("hyphenate utils function", () => {
	
	it("should return empty string when value is undefined", () => {
		expect(hyphenate(undefined)).toBe("");
	});

	it("should return hyphenated string to lower case", () => {
		expect(hyphenate("General specifications")).toBe("general-specifications");
	});

	it("should handle string with multiple spaces", () => {
		expect(hyphenate("Hot water distribution")).toBe("hot-water-distribution");
	});

	it("should handle string with no spaces",() => {
		expect(hyphenate("Shading")).toBe("shading");
	});

	it("should handle string with leading and trailing spaces", () => {
		expect(hyphenate("  Shading")).toBe("shading");
		expect(hyphenate("Shading   ")).toBe("shading");
		expect(hyphenate("  General specifications   ")).toBe("general-specifications");
	});

	it("should handle empty string", () => {
		expect(hyphenate("")).toBe("");
	});
});
