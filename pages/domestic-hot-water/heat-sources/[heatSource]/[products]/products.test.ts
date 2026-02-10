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

	const MOCKED_HEAT_PUMPS: PaginatedResult<DisplayProduct> = {
		data: [
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
		],
	};
	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_PUMPS),
		});
	});

	const heatSource1: Partial<DomesticHotWaterHeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};
	const heatSource2: Partial<DomesticHotWaterHeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat source 2",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatSource1 }, { data: heatSource2 }],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title dependant on the type of heat pump", async () => {
		mockRoute.mockReturnValue({
			params: {
				pump: "0",
				products: "air-source",
			},
			path: "/0/air-source",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select an air source heat pump" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "air-source",
			},
			path: "/1/air-source",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.domesticHotWater.heatSources.data[1]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_PUMPS.data[1]?.id }));
	});

	test("'Back to heat source' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "air-source",
			},
			path: "/1/air-source",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatSourceButton");

		expect(backButton.getAttribute("href")).toBe(
			"/domestic-hot-water/heat-sources/1",
		);
	});
});