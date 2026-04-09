import type { DisplayProduct } from "~/pcdb/pcdb.types";

describe("Pagination", () => {
	const productData: DisplayProduct[] = [
		{
			id: "1000",
			brandName: "Test 1",
			modelName: "Small Heat Pump",
			modelQualifier: "HPSMALL",
			technologyType: "AirSourceHeatPump",
		},
		{
			id: "1001",
			brandName: "Test 1",
			modelName: "Medium Heat Pump",
			modelQualifier: "HPMEDIUM",
			technologyType: "AirSourceHeatPump",
		},
		{
			id: "1002",
			brandName: "Test 2",
			modelName: "Large Heat Pump",
			modelQualifier: "HPLARGE",
			technologyType: "AirSourceHeatPump",
		},
	];
	
	it("Returns total pages relative to the given page size", () => {
		// Act
		const { totalPages } = usePagination(productData, 1);

		// Assert
		expect(totalPages).toBe(3);
	});

	it("getData returns paginated data relative to the current page and page size", () => {
		// Act
		const { getData } = usePagination(productData, 1);
		const result = getData();

		// Assert
		expect(result.length).toBe(1);
	});
});