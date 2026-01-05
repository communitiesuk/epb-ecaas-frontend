import type { DisplayProduct } from "~/pcdb/pcdb.types";

describe("Product search", () => {
	const productData: DisplayProduct[] = [
		{
			id: "1000",
			brandName: "Test 1",
			modelName: "Small Heat Pump",
			modelQualifier: "HPSMALL",
			technologyType: "air source heat pumps",
		},
		{
			id: "1001",
			brandName: "Test 1",
			modelName: "Medium Heat Pump",
			modelQualifier: "HPMEDIUM",
			technologyType: "air source heat pumps",
		},
		{
			id: "1002",
			brandName: "Test 2",
			modelName: "Large Heat Pump",
			modelQualifier: "HPLARGE",
			technologyType: "air source heat pumps",
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
		expect(results.length).toBe(2);
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
});