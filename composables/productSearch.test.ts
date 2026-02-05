import type { DisplayProduct } from "~/pcdb/pcdb.types";

describe("Product search", () => {
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
			brandName: "Test 2",
			modelName: "Medium Heat Pump",
			modelQualifier: "HPMEDIUM",
			technologyType: "AirSourceHeatPump",
		},
		{
			id: "1002",
			brandName: "Test 3",
			modelName: "Large Heat Pump",
			modelQualifier: "HPLARGE",
			technologyType: "AirSourceHeatPump",
		},
	];

	it("Returns all products when no search parameters are present", () => {
		// Act
		const results = useProductSearch(productData, {});
		
		// Assert
		expect(results.length).toBe(productData.length);
	});

	it("Returns products by ID when ID search parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { productId: "1000" });

		// Assert
		expect(results.length).toBe(1);
		expect(results[0]?.id).toBe("1000");
	});

	it("Returns products by brand name when brand search parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { brandName: "Test 1" });

		// Assert
		expect(results.length).toBe(1);
		expect(results.every(r => r.brandName === "Test 1")).toBeTruthy();
	});

	it("Returns products by model name when model search parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { modelName: "Small Heat Pump" });

		// Assert
		expect(results.length).toBe(1);
		expect(results[0]?.modelName).toBe("Small Heat Pump");
	});

	it("Returns products by model qualifier when qualifier search parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { modelQualifier: "HPSMALL" });

		// Assert
		expect(results.length).toBe(1);
		expect(results[0]?.modelQualifier).toBe("HPSMALL");
	});

	it("Returns products sorted by ID in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "id" });

		// Assert
		const expectedIds = ["1000", "1001", "1002"];
		const ids = results.map(r => r.id);

		expect(ids).toStrictEqual(expectedIds);
	});

	it("Returns products sorted by ID in descending order when sort and order parameters are present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "id", order: "desc" });

		// Assert
		const expectedIds = ["1002", "1001", "1000"];
		const ids = results.map(r => r.id);

		expect(ids).toStrictEqual(expectedIds);
	});

	it("Returns products sorted by brand name in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "brandName" });

		// Assert
		const expectedBrandNames = ["Test 1", "Test 2", "Test 3"];
		const brandNames = results.map(r => r.brandName);

		expect(brandNames).toStrictEqual(expectedBrandNames);
	});

	it("Returns products sorted by model name in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "modelName" });

		// Assert
		const expectedModelNames = ["Large Heat Pump", "Medium Heat Pump", "Small Heat Pump"];
		const modelNames = results.map(r => r.modelName);

		expect(modelNames).toStrictEqual(expectedModelNames);
	});

	it("Returns products sorted by model qualifier in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "modelName" });

		// Assert
		const expectedModelQualifiers = ["HPLARGE", "HPMEDIUM", "HPSMALL"];
		const modelQualifiers = results.map(r => r.modelQualifier);

		expect(modelQualifiers).toStrictEqual(expectedModelQualifiers);
	});
});