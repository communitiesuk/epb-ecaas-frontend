import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat pump details", async () => {
	const smartHotWaterTank: Partial<WaterStorageData> = {
		name: "Smart hot water tank 1",
		productReference: "42",
		typeOfWaterStorage: "smartHotWaterTank",
	};

	const shwtProduct: Partial<Product> = {
		id: "42",
		brandName: "Test",
		modelName: "Large Smart Hot Water Tank",
		modelQualifier: "SHWTLARGE",
		technologyType: "SmartHotWaterTank",
	};

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

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [{ data: smartHotWaterTank }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				waterstorage: "0",
				products: "smart-hot-water-tank",
				id: "42",
			},
			path: "/0/smart-hot-water-tank/42",
		});

		mockFetch.mockReturnValue({
			data: ref(shwtProduct),
		});
	});

	afterEach(() => {
		store.$reset();

		mockNavigateTo.mockReset();
		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("Returns not found error when products route parameter is invalid", async () => {
		// Arrange
		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				waterstorage: "0",
				products: "shwt-invalid",
				id: "1234",
			},
			path: "/0/shwt-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to smart hot water tanks");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const waterStorage = store.domesticHotWater.waterStorage.data[0]?.data as PcdbProduct;

		// Assert
		expect(waterStorage.productReference).toBe("42");
	});

	test("Navigates to water storage page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/domestic-hot-water/water-storage/0");
	});
});