import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import type { DisplayProduct, PaginatedResult, Product } from "~/pcdb/pcdb.types";
import { mockReactiveRouteWithPath } from "~/test-utils/mockReactiveRouteWithPath";
import SelectedProductDetails from "./[id]/details.vue";
import Products from "./index.vue";

const { mockFetch, mockRoute, mockNavigateTo } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
	mockRoute: vi.fn(),
	mockNavigateTo: vi.fn(),
}));

const basePath = "/domestic-hot-water/preheated-water-storage";
mockNuxtImport("useFetch", () => mockFetch);
mockNuxtImport("useRoute", () => () => mockReactiveRouteWithPath(basePath, mockRoute));
mockNuxtImport("navigateTo", () => mockNavigateTo);

describe("preheated water storage products", () => {
	const user = userEvent.setup();
	let store: ReturnType<typeof useEcaasStore>;
	const product: Partial<Product> = {
		id: "42",
		brandName: "Test",
		modelName: "Smart tank",
		modelQualifier: "SMART",
		technologyType: "SmartHotWaterTank",
	};
	const products: PaginatedResult<DisplayProduct> = {
		data: [{ ...product, displayProduct: true } as DisplayProduct],
	};

	beforeEach(() => {
		store = useEcaasStore();
		store.$patch({
			domesticHotWater: {
				preheatedWaterStorage: {
					data: [
						{ data: { name: "SHW Tank", typeOfWaterStorage: "smartHotWaterTank" } },
					],
				},
			},
		});
		mockRoute.mockReturnValue({
			params: { waterstorage: "0", products: "smart-hot-water-tank", id: "42" },
			path: "/0/smart-hot-water-tank",
			query: {},
		});
	});

	afterEach(() => {
		store.$reset();
		mockFetch.mockReset();
		mockRoute.mockReset();
		mockNavigateTo.mockReset();
	});

	test("selecting from the list updates the preheated tank and returns to the form", async () => {
		mockFetch.mockReturnValue({ data: ref(products) });
		await renderSuspended(Products);
		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(store.domesticHotWater.preheatedWaterStorage.data[0]?.data).toEqual(expect.objectContaining({ productReference: "42" }));

		expect(mockNavigateTo).toHaveBeenCalledWith(basePath);
		expect(screen.getByTestId("backToWaterStorageButton").getAttribute("href")).toBe(basePath);
	});

	test("selected product details links back to the preheated form", async () => {
		mockRoute.mockReturnValue({
			params: { waterstorage: "0", products: "smart-hot-water-tank", id: "42" },
			path: "/0/smart-hot-water-tank/42/details",
			query: {},
		});
		mockFetch.mockReturnValue({ data: ref(product) });
		await renderSuspended(SelectedProductDetails);
		expect(screen.getByTestId("backLink").getAttribute("href")).toBe(basePath);
	});
});
