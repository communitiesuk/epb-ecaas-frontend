import type { DisplayProduct } from "~/pcdb/pcdb.types";

describe("Product search", () => {
	const productData: DisplayProduct[] = [
		{
			displayProduct: true,
			id: "1000",
			brandName: "Test 1",
			modelName: "Small Heat Pump",
			modelQualifier: "HPSMALL",
			technologyType: "AirSourceHeatPump",
		},
		{
			displayProduct: true,
			id: "1001",
			brandName: "Test 2",
			modelName: "Medium Heat Pump",
			modelQualifier: "HPMEDIUM",
			technologyType: "AirSourceHeatPump",
		},
		{
			displayProduct: true,
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

	it("Returns products by ID when ID is used as search parameter", () => {
		// Act
		const results = useProductSearch(productData, {
			searchOption: "productId",
			productId: "1000",
		});

		// Assert
		expect(results.length).toBe(1);
		expect(results[0]?.id).toBe("1000");
	});

	it("Returns products by brand name when brand is used as search parameter", () => {
		// Act
		const results = useProductSearch(productData, { searchTerm: "Test 1" });

		// Assert
		expect((results[0] as { brandName: string })?.brandName).toBe("Test 1");
	});

	it("Returns products by model name when model is used as search parameter", () => {
		// Act
		const results = useProductSearch(productData, { searchTerm: "Small Heat Pump" });

		// Assert
		expect((results[0] as { modelName: string })?.modelName).toBe("Small Heat Pump");
	});

	it("Returns products by model qualifier when qualifier is used as search parameter", () => {
		// Act
		const results = useProductSearch(productData, { searchTerm: "HPSMALL" });

		// Assert
		expect((results[0] as { modelQualifier: string })?.modelQualifier).toBe("HPSMALL");
	});

	it("Returns products when multiple fields are used as a search parameter", () => {
		// Act
		const results = useProductSearch(productData, { searchTerm: "Test 1 Small Heat Pump" });

		// Assert
		expect(results[0]?.id).toBe("1000");
	});

	it("Returns heat network products by subnetwork name when subnetwork is used as a search parameter", () => {
		const heatNetworkData: DisplayProduct[] = [
			...productData,
			{
				displayProduct: true,
				id: "1003",
				technologyType: "HeatNetworks",
				communityHeatNetworkName: "Test Heat Network",
				subheatNetworkName: "Test Subnetwork",
			},
		];

		// Act
		const results = useProductSearch(heatNetworkData, { searchTerm: "Test Subnetwork" });

		// Assert
		expect(results).toHaveLength(1);
		expect(results[0]?.id).toBe("1003");
	});

	it("Returns radiator products by height when height is used as a search parameter", () => {
		const radiatorData: DisplayProduct[] = [
			...productData,
			{
				displayProduct: true,
				id: "1004",
				technologyType: "ConvectorRadiator",
				type: "T33",
				height: 900,
			},
		];

		// Act
		const results = useProductSearch(radiatorData, { searchTerm: "900" });

		// Assert
		expect(results).toHaveLength(1);
		expect(results[0]?.id).toBe("1004");
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

	it("Sorts prefixed product IDs by numeric suffix in ascending order", () => {
		const radiatorData: DisplayProduct[] = [
			{
				displayProduct: true,
				id: "CR21",
				technologyType: "ConvectorRadiator",
				type: "T20",
				height: 1950,
			},
			{
				displayProduct: true,
				id: "CR2",
				technologyType: "ConvectorRadiator",
				type: "T10",
				height: 1950,
			},
			{
				displayProduct: true,
				id: "CR6",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 1950,
			},
		];

		const results = useProductSearch(radiatorData, { sort: "id", order: "asc" });

		expect(results.map(r => r.id)).toStrictEqual(["CR2", "CR6", "CR21"]);
	});

	it("Sorts prefixed product IDs by numeric suffix in descending order", () => {
		const radiatorData: DisplayProduct[] = [
			{
				displayProduct: true,
				id: "CR21",
				technologyType: "ConvectorRadiator",
				type: "T20",
				height: 1950,
			},
			{
				displayProduct: true,
				id: "CR2",
				technologyType: "ConvectorRadiator",
				type: "T10",
				height: 1950,
			},
			{
				displayProduct: true,
				id: "CR6",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 1950,
			},
		];

		const results = useProductSearch(radiatorData, { sort: "id", order: "desc" });

		expect(results.map(r => r.id)).toStrictEqual(["CR21", "CR6", "CR2"]);
	});

	it("Returns products sorted by brand name in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "brandName" });

		// Assert
		const expectedBrandNames = ["Test 1", "Test 2", "Test 3"];
		const brandNames = results.map(r => (r as { brandName: string })?.brandName);

		expect(brandNames).toStrictEqual(expectedBrandNames);
	});

	it("Returns products sorted by model name in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "modelName" });

		// Assert
		const expectedModelNames = ["Large Heat Pump", "Medium Heat Pump", "Small Heat Pump"];
		const modelNames = results.map(r => (r as { modelName: string })?.modelName);

		expect(modelNames).toStrictEqual(expectedModelNames);
	});

	it("Returns products sorted by model qualifier in ascending order when sort parameter is present", () => {
		// Act
		const results = useProductSearch(productData, { sort: "modelName" });

		// Assert
		const expectedModelQualifiers = ["HPLARGE", "HPMEDIUM", "HPSMALL"];
		const modelQualifiers = results.map(r => (r as { modelQualifier: string })?.modelQualifier);

		expect(modelQualifiers).toStrictEqual(expectedModelQualifiers);
	});

	it("Returns radiator products sorted by type with height as secondary sort in ascending order", () => {
		const radiatorData: DisplayProduct[] = [
			{
				displayProduct: true,
				id: "2001",
				technologyType: "ConvectorRadiator",
				type: "T22",
				height: 800,
			},
			{
				displayProduct: true,
				id: "2002",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 700,
			},
			{
				displayProduct: true,
				id: "2003",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 500,
			},
			{
				displayProduct: true,
				id: "2004",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 900,
			},
		];


		const results = useProductSearch(radiatorData, { sort: "type", order: "asc" });

		expect(results.map(r => r.id)).toStrictEqual(["2003", "2002", "2004", "2001"]);
	});
	
	it("sorts by height treating them as numberical values, even when they are strings", () => {
		const radiatorData: DisplayProduct[] = [
			{
				displayProduct: true,
				id: "3001",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 810,
			},
			{
				displayProduct: true,
				id: "3002",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 7350,
			},
			{
				displayProduct: true,
				id: "3003",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 540,
			},
			{
				displayProduct: true,
				id: "3004",
				technologyType: "ConvectorRadiator",
				type: "T11",
				height: 1100,
			},
		];

		// Act
		const results = useProductSearch(radiatorData, { sort: "height", order: "asc" });

		// Assert
		expect(results.map(r => r.id)).toStrictEqual(["3003", "3001", "3004", "3002"]);
	});
	
	it("Returns HEM default products first", () => {
		// Act
		const results = useProductSearch([
			...productData,
			{
				displayProduct: true,
				id: "1003",
				brandName: "HEM Default 1",
				modelName: "Small Heat Pump",
				technologyType: "AirSourceHeatPump",
			},
			{
				displayProduct: true,
				id: "1004",
				brandName: "HEM Default 2",
				modelName: "Small Heat Pump",
				technologyType: "AirSourceHeatPump",
			},
		], {});

		// Assert
		expect(results[0]?.brandName).toBe("HEM Default 1");
		expect(results[1]?.brandName).toBe("HEM Default 2");
	});
});