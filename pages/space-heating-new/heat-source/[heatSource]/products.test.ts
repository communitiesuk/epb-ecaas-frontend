import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./[products].vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

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

	const MOCKED_HEAT_PUMPS = [
		{
			reference: "HEATPUMP-SMALL",
			product: {
				brandName: "Test",
				firstYearOfManufacture: 2023,
				modelName: "Small Heat Pump",
				modelQualifier: "HPSMALL",
				technologyType: "Air Source Heat Pump",
			},
		},
		{
			reference: "HEATPUMP-MEDIUM",
			product: {
				brandName: "Test",
				firstYearOfManufacture: 2023,
				modelName: "Medium Heat Pump",
				modelQualifier: "HPMEDIUM",
				technologyType: "Air Source Heat Pump",
			},
		},
		{
			reference: "HEATPUMP-LARGE",
			product: {
				brandName: "Test",
				firstYearOfManufacture: 2023,
				modelName: "Large Heat Pump",
				modelQualifier: "HPLARGE",
				technologyType: "Air Source Heat Pump",
			},
		},
	];
	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_PUMPS),
		});
	});

	const heatSource1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};
	const heatSource2: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat source 2",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};

	beforeEach(async () => {
		store.$patch({
			spaceHeatingNew: {
				heatSource: {
					data: [{ data: heatSource2 }, { data: heatSource1 }],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				"heatSource": "1",
				"products": "products",
			},
			path: "/1/products",
		});
		await renderSuspended(Products);
	
		await user.click(screen.getByTestId("selectProductButton_1"));
		expect(store.spaceHeatingNew.heatSource.data[1]!.data.productReference).toBe(MOCKED_HEAT_PUMPS[1]?.reference);
	});

	test("'Back to heat source' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				"heatSource": "1",
				"products": "products",
			},
			path: "/1/products",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatSourceButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating-new/heat-source/1",
		);
	});
});