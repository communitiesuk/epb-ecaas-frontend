describe("getName", () => {

	test("returns name supplied by user", () => {
		const updatedItem = { name: "Item name" };
		const defaultName = "Test default name";
		const actual = getName(updatedItem, defaultName);
		expect(actual).toBe("Item name");
	});

	describe("hasChangedFields", () => {
		test("detects newly added fields", () => {
			expect(hasChangedFields({ name: "Battery", wetHeatSourceId: "boiler" }, { name: "Battery" })).toBe(true);
		});

		test("detects removed fields", () => {
			expect(hasChangedFields({ name: "Battery" }, { name: "Battery", wetHeatSourceId: "boiler" })).toBe(true);
		});
	});

	test("returns default name when user does not supply a name", () => {
		const updatedItem = {};
		const defaultName = "Test default name";
		const actual = getName(updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
	
	test("returns default name when user deletes stored name", () => {
		const updatedItem = { name: "" };
		const defaultName = "Test default name";
		const actual = getName(updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});

	test("returns default name when user supplies only whitespace", () => {
		const updatedItem = { name: "  " };
		const defaultName = "Test default name";
		const actual = getName(updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
});
