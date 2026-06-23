import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("WWHRS products page", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	
	const { mockFetch, mockRoute } = vi.hoisted(() => ({
		mockFetch: vi.fn(),
		mockRoute: vi.fn(),
	}));

	mockNuxtImport("useFetch", () => mockFetch);
	mockNuxtImport("useRoute", () => mockRoute);

	const wwhrs: Partial<WwhrsData> = {
		id: "12992f88-498c-455f-b3bf-c6f0ab0b8138",
		name: "WWHRS",
		coldWaterSource: "mainsWater",
	};

	const wwhrsProducts: PaginatedResult<DisplayProduct> = {
		data: [
			{
				displayProduct: true,
				id: "1000",
				brandName: "Brand",
				modelName: "Model",
				modelQualifier: "System A",
				technologyType: "InstantaneousWwhrSystem",
			},
		],
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
			data: ref(wwhrsProducts),
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
			screen.getByRole("heading", { name: "Select a waste water heat recovery system" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.domesticHotWater.wwhrs.data[0]!.data,
		).toEqual(expect.objectContaining({
			productReference: wwhrsProducts.data[0]?.id,
		}));
	});

	test("'Back to WWHRS' navigates user to the WWHRS at the correct index", async () => {
		await renderSuspended(Products);

		const backButton = screen.getByTestId("backToWwhrsButton");

		expect(backButton.getAttribute("href")).toBe(
			"/domestic-hot-water/wwhrs/0",
		);
	});
});