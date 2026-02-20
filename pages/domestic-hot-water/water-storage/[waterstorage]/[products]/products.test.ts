import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat source products page", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const { mockFetch, mockRoute } = vi.hoisted(() => ({
		mockFetch: vi.fn(),
		mockRoute: vi.fn(),
	}));

	mockNuxtImport("useFetch", () => mockFetch);
	mockNuxtImport("useRoute", () => mockRoute);

	afterEach(() => {
		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	const MOCKED_SHWTS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				id: "42",
				brandName: "Test",
				modelName: "Large Smart Hot Water Tank",
				modelQualifier: "SHWTLARGE",
				technologyType: "SmartHotWaterTank",
			},
			{
				id: "43",
				brandName: "Test",
				modelName: "Medium Smart Hot Water Tank",
				modelQualifier: "SHWTMEDIUM",
				technologyType: "SmartHotWaterTank",
			},
		],
	};

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_SHWTS),
		});
	});

	const shwt1: Partial<WaterStorageData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfWaterStorage: "smartHotWaterTank",
	};
	const shwt2: Partial<WaterStorageData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat source 2",
		typeOfWaterStorage: "smartHotWaterTank",
	};

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [
						{ data: shwt1 },
						{ data: shwt2 },
					],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title matches smart hot water tank", async () => {
		mockRoute.mockReturnValue({
			params: {
				waterstorage: "0",
				products: "smart-hot-water-tank",
			},
			path: "/0/smart-hot-water-tank",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a smart hot water tank" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				waterstorage: "1",
				products: "smart-hot-water-tank",
			},
			path: "/1/smart-hot-water-tank",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.domesticHotWater.waterStorage.data[1]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_SHWTS.data[1]?.id }));
	});

	test("'Back to water storage' navigates user to the water storage at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				waterstorage: "1",
				products: "smart-hot-water-tank",
			},
			path: "/1/smart-hot-water-tank",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToWaterStorageButton");

		expect(backButton.getAttribute("href")).toBe(
			"/domestic-hot-water/water-storage/1",
		);
	});
});