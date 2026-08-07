import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import type { H3Error } from "h3";
import ProductDetails from "./[id]/index.vue";
import { screen } from "@testing-library/vue";
import type { Product } from "~/pcdb/pcdb.types";

describe("WWHRS product details", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const { mockFetch, mockRoute, mockNavigateTo } = vi.hoisted(() => ({
		mockFetch: vi.fn(),
		mockRoute: vi.fn(),
		mockNavigateTo: vi.fn(),
	}));

	mockNuxtImport("useFetch", () => mockFetch);
	mockNuxtImport("useRoute", () => mockRoute);
	mockNuxtImport("navigateTo", () => mockNavigateTo);

	const wwhrs: Partial<WwhrsData> = {
		id: "1c1bfa48-d4f5-4438-af55-5e7523ddfd62",
		name: "WWHRS",
		coldWaterSource: "mainsWater",
	};

	const wwhrsProduct: Partial<Product> = {
		id: "1000",
		brandName: "Brand",
		modelName: "Model",
		modelQualifier: "System A",
		technologyType: "InstantaneousWwhrSystem",
	};

	const hemDefaultWwhrsProduct: Partial<Product> = {
		...wwhrsProduct,
		brandName: "HEM Default",
	};

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [
						{ data: wwhrs },
					],
				},
			},
		});
		
		mockRoute.mockReturnValue({
			params: {
				system: "0",
				products: "wwhrs",
			},
			path: "/0/wwhrs",
		});

		mockFetch.mockReturnValue({
			data: ref(wwhrsProduct),
		});
	});

	afterEach(() => {
		store.$reset();

		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("Returns not found error when products route parameter is invalid", async () => {
		// Arrange
		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				system: "0",
				products: "wwhrs-invalid",
				id: "1234",
			},
			path: "/0/wwhrs-invalid/1234",
		});

		// Act
		try {
			await renderSuspended(ProductDetails);
		} catch (error) {
			h3Error = error as H3Error;
		}

		// Assert
		expect(h3Error?.cause).toStrictEqual({
			statusCode: 404,
			statusMessage: "Product type not found",
		});
	});

	test("Back link includes displays product type", async () => {
		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect(screen.getByTestId("backLink").innerText).toBe("Back to waste water heat recovery systems");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const wwhrsItem = store.domesticHotWater.wwhrs.data[0]?.data;

		// Assert
		expect(wwhrsItem?.productReference).toBe("1000");
	});

	test("Does not display HEM default inset when product is not HEM Default", async () => {
		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect(screen.queryByTestId("hemDefaultProductInset")).toBeNull();
	});

	test("Displays HEM default inset when product brand is HEM Default", async () => {
		// Arrange
		mockFetch.mockReturnValue({
			data: ref(hemDefaultWwhrsProduct),
		});

		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect((await screen.findByTestId("hemDefaultProductInset"))).toBeDefined();
	});

	test("Navigates to WWHRS page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/domestic-hot-water/wwhrs/0");
	});
});