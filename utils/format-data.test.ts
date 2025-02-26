describe("formatData utils function" , () => {
	it("should return empty string when given undefined", () => {
		expect(formatData(undefined)).toBe("");
	});

	it("should return string with first character capitalised", () => {
		expect(formatData("electricity")).toBe("Electricity");
	});

	it("should return string with spaces in correct the position", () => {
		expect(formatData("seperateTempAndTimeControl")).toBe("Seperate temp and time control");
		expect(formatData("Shading 1")).toBe("Shading 1");
	});

	it("should handle numbers", () => {
		expect(formatData(2)).toBe(2);
		expect(formatData(3.4)).toBe(3.4);
	});
}) ;