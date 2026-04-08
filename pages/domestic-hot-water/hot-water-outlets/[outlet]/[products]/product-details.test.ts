import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import type { H3Error } from "h3";
import ProductDetails from "./[id].vue";
import { screen } from "@testing-library/vue";
import type { Product } from "~/pcdb/pcdb.types";

describe("Hot water outlet product details", () => {
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

	const airPressureShower: Partial<HotWaterOutletsData> = {
		typeOfHotWaterOutlet: "mixedShower",
		name: "Mixer shower",
		dhwHeatSourceId: "db257659-f1f0-4ada-9fa5-b26293e3b387",
		isAirPressureShower: true,
	};

	const showerProduct: Partial<Product> = {
		id: "1000",
		brandName: "Brand",
		modelName: "Air pressure shower",
		technologyType: "AirPoweredShowers",
	};

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					data: [
						{ data: airPressureShower },
					],
				},
			},
		});
		
		mockRoute.mockReturnValue({
			params: {
				outlet: "0",
				products: "air-pressure-shower",
			},
			path: "/0/air-pressure-shower",
		});

		mockFetch.mockReturnValue({
			data: ref(showerProduct),
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
				outlet: "0",
				products: "air-source-invalid",
				id: "1234",
			},
			path: "/0/air-source-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to showers");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const hotWaterOutlet = store.domesticHotWater.hotWaterOutlets.data[0]?.data;

		// Assert
		const productReference = "airPressureShowerProductReference" in hotWaterOutlet! ?
			hotWaterOutlet.airPressureShowerProductReference : undefined;
			
		expect(productReference).toBe("1000");
	});

	test("Displays air pressure shower details when product is an air pressure shower", async () => {
		// Act
		await renderSuspended(ProductDetails);
			
		// Assert
		expect((await screen.findByTestId("airPressureShower"))).toBeDefined();
	});

	test("Navigates to hot water outlets page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/domestic-hot-water/hot-water-outlets/0");
	});
});