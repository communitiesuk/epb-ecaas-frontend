describe("getOrGenerateName", () => {

	test("returns name supplied by user", () => {
		const storedItem = undefined;
		const updatedItem = { name: "Item name" };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(storedItem, updatedItem, defaultName);
		expect(actual).toBe("Item name");
	});

	test("returns default name when user does not supply a name", () => {
		const storedItem = undefined;
		const updatedItem = {};
		const defaultName = "Test default name";
		const actual = getOrGenerateName(storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
	
	test("returns default name when user deletes stored name", () => {
		const storedItem = {
			name: "Item name",
		};
		const updatedItem = { name: "" };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});

	test("returns default name when user supplies only whitespace", () => {
		const storedItem = {
			name: "Item name",
		};
		const updatedItem = { name: "  " };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
});
