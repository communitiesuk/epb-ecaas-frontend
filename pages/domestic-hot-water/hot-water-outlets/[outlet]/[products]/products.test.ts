import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Hot water outlet products page", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	
	const { mockFetch, mockRoute } = vi.hoisted(() => ({
		mockFetch: vi.fn(),
		mockRoute: vi.fn(),
	}));

	mockNuxtImport("useFetch", () => mockFetch);
	mockNuxtImport("useRoute", () => mockRoute);

	const airPressureShower: Partial<HotWaterOutletsData> = {
		typeOfHotWaterOutlet: "mixedShower",
		name: "Mixer shower",
		dhwHeatSourceId: "db257659-f1f0-4ada-9fa5-b26293e3b387",
		isAirPressureShower: true,
	};

	const showerProducts: PaginatedResult<DisplayProduct> = {
		data: [
			{
				displayProduct: true,
				id: "1000",
				brandName: "Brand",
				modelName: "Air pressure shower",
				technologyType: "AirPoweredShowers",
			},
		],
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
			data: ref(showerProducts),
		});
	});

	afterEach(() => {
		store.$reset();

		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("title dependant on the type of heat source", async () => {
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select an air pressure shower" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.domesticHotWater.hotWaterOutlets.data[0]!.data,
		).toEqual(expect.objectContaining({
			airPressureShowerProductReference: showerProducts.data[0]?.id,
		}));
	});

	test("'Back to hot water outlet' navigates user to the hot water outlet at the correct index", async () => {
		await renderSuspended(Products);

		const backButton = screen.getByTestId("backToHotWaterOutletButton");

		expect(backButton.getAttribute("href")).toBe(
			"/domestic-hot-water/hot-water-outlets/0",
		);
	});
});