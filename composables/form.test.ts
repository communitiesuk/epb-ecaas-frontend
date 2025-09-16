describe("getOrGenerateName", () => {

  test("returns the name supplied by user", () => {
		const allItems: EcaasForm<object>[] = [];
		const storedItem = undefined;
		const updatedItem = { name: "Item name" };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(allItems, storedItem, updatedItem, defaultName);
		expect(actual).toBe("Item name");
	});

	test("returns default name when user does not supply a name", () => {
		const allItems: EcaasForm<object>[] = [];
		const storedItem = undefined;
		const updatedItem = {};
		const defaultName = "Test default name";
		const actual = getOrGenerateName(allItems, storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
	
	test("returns the default name when user deletes the stored name", () => {
		const allItems: EcaasForm<object>[] = [{
			data: {
				name: "Item name",
			},
		}];
		const storedItem = {
			name: "Item name",
		};
		const updatedItem = { name: "" };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(allItems, storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});

	test("returns the default name when user supplies only whitespace", () => {
		const allItems: EcaasForm<object>[] = [{
			data: {
				name: "Item name",
			},
		}];
		const storedItem = {
			name: "Item name",
		};
		const updatedItem = { name: "  " };
		const defaultName = "Test default name";
		const actual = getOrGenerateName(allItems, storedItem, updatedItem, defaultName);
		expect(actual).toBe(defaultName);
	});
});
