import { suffixWithNumber, duplicateFormEntry } from "./duplicateFormEntry";
describe("suffixWithNumber", () => {
	it("should append a number in parentheses to the name", () => {
		expect(suffixWithNumber("Test", 1)).toBe("Test (1)");
		expect(suffixWithNumber("Test", 2)).toBe("Test (2)");
		expect(suffixWithNumber("Test", 3)).toBe("Test (3)");
	});
});

describe("duplicateFormEntry", () => {
	it("should create a new form entry with a suffixed name and a new id", () => {
		const originalItem = {
			complete: true,
			data: {
				name: "Original",
				id: "1234",
			},
		};

		const duplicates = 1;
		const newItem = duplicateFormEntry(originalItem, duplicates);

		expect(newItem.complete).toBe(originalItem.complete);
		expect(newItem.data.name).toBe("Original (1)");
		expect(newItem.data.id).not.toBe(originalItem.data.id);
	});
	it("should allow overriding the complete status", () => {
		const originalItem = {
			complete: true,
			data: {
				name: "Original",
				id: "1234",
			},
		};

		const duplicates = 1;
		const newItem = duplicateFormEntry(originalItem, duplicates, false);

		expect(newItem.complete).toBe(false);
		expect(newItem.data.name).toBe("Original (1)");
		expect(newItem.data.id).not.toBe(originalItem.data.id);
	});
});