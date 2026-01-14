import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

describe("Products page", () => {
	const mockRoute = vi.hoisted(() => vi.fn());

	mockNuxtImport("useRoute", () => mockRoute);

	beforeEach(() => {
		const route: Partial<RouteLocationNormalizedLoadedGeneric> = {
			params: {
				pump: "0",
				products: "air-source",
			},
		};

		mockRoute.mockReturnValue(route);
	});

	afterEach(() => {
		mockRoute.mockReset();
	});

	it("Returns bad request error when page ID is not a valid PCDB technology type", () => {
		// Arrange
		const route: Partial<RouteLocationNormalizedLoadedGeneric> = {
			params: {
				products: "invalid-product-type",
			},
		};

		mockRoute.mockReturnValue(route);

		// Act / Assert
		expect(() => useProductsPage("pump")).toThrowError("Invalid product type selected");
	});

	it("Returns camel case page ID when ID is a valid PCDB technology type", () => {
		// Act
		const { pageId } = useProductsPage("pump");

		// Assert
		expect(pageId).toBeOneOf(Object.keys(pcdbTechnologyTypes));
	});

	it("Returns page title when page ID is valid", () => {
		// Act
		const { title } = useProductsPage("pump");

		// Assert
		expect(title).toBeDefined();
	});

	it("Returns product index parameter when provided as a route param", () => {
		// Act
		const { index } = useProductsPage("pump");

		// Assert
		expect(index).toBe(0);
	});

	it("Returns search model when parameters provided as query params", () => {
		// Arrange
		const route: Partial<RouteLocationNormalizedLoadedGeneric> = {
			params: {
				pump: "0",
				products: "air-source",
			},
			query: {
				productId: "ABC123",
				searchOption: "productId",
			},
		};

		mockRoute.mockReturnValue(route);

		// Act
		const { searchModel } = useProductsPage("pump");

		// Assert
		expect(searchModel.value.productId).toBe("ABC123");
		expect(searchModel.value.searchOption).toBe("productId");
	});

	it("searchData returns paginated results", () => {
		// Arrange
		const productData: DisplayProduct[] = [
			{
				id: "1000",
				brandName: "Test",
				modelName: "Small Heat Pump",
				modelQualifier: "HPSMALL",
				technologyType: "AirSourceHeatPump",
			},
			{
				id: "1001",
				brandName: "Test",
				modelName: "Medium Heat Pump",
				modelQualifier: "HPMEDIUM",
				technologyType: "AirSourceHeatPump",
			},
			{
				id: "1002",
				brandName: "Test",
				modelName: "Large Heat Pump",
				modelQualifier: "HPLARGE",
				technologyType: "AirSourceHeatPump",
			},
		];

		// Act
		const { searchData } = useProductsPage("pump");
		const results = searchData(productData);

		// Assert
		expect(results.pagination.value.getData().length).toBe(productData.length);
		expect(results.pagination.value.totalPages).toBe(1);
	});
});