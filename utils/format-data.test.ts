describe("formatData utils function" , () => {
	it("should return empty string when given undefined", () => {
		expect(formatData(undefined, true)).toBe("");
	});

	it("should return string with first character capitalised if second argument is true", () => {
		expect(formatData("electricity", true)).toBe("Electricity");
	});
	
	it("should return string with all lower case if second argument is false", () => {
		expect(formatData("electricity", false)).toBe("electricity");
	});

	it("should return string with spaces in correct the position", () => {
		expect(formatData("seperateTempAndTimeControl", true)).toBe("Seperate temp and time control");
		expect(formatData("Shading 1", true)).toBe("Shading 1");
	});

	it("should handle numbers", () => {
		expect(formatData(2, true)).toBe(2);
		expect(formatData(3.4, true)).toBe(3.4);
	});
}) ;