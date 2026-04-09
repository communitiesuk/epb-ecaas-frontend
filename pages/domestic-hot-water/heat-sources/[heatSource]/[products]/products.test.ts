import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { BoilerProduct, DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat source products page", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	
	const { mockFetch, mockRoute } = vi.hoisted(() => ({
		mockFetch: vi.fn(),
		mockRoute: vi.fn(),
	}));

	mockNuxtImport("useFetch", () => mockFetch);
	mockNuxtImport("useRoute", () => mockRoute);

	const MOCKED_HEAT_PUMPS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				displayProduct: true,
				id: "1000",
				brandName: "Test",
				modelName: "Small Heat Pump",
				modelQualifier: "HPSMALL",
				technologyType: "AirSourceHeatPump",
			},
			{
				displayProduct: true,
				id: "1001",
				brandName: "Test",
				modelName: "Medium Heat Pump",
				modelQualifier: "HPMEDIUM",
				technologyType: "AirSourceHeatPump",
			},
			{
				displayProduct: true,
				id: "1002",
				brandName: "Test",
				modelName: "Large Heat Pump",
				modelQualifier: "HPLARGE",
				technologyType: "AirSourceHeatPump",
			},
			{
				displayProduct: true,
				id: "1004",
				brandName: "Test",
				modelName: "Hybrid Heat Pump",
				technologyType: "HybridHeatPump",
				boilerProductID: "2000",
			},
		],
	};

	const HOT_WATER_HEAT_PUMPS: PaginatedResult<DisplayProduct> = {
		data: [{
			displayProduct: true,
			id: "1003",
			brandName: "Test",
			modelName: "Small Hot Water Only Heat Pump",
			modelQualifier: "HWHPSMALL",
			technologyType: "HotWaterOnlyHeatPump",
		}],
	};

	const heatSource1: Partial<DomesticHotWaterHeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfHeatSource: "heatPump",
	};
	const heatSource2: Partial<DomesticHotWaterHeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat source 2",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
	};

	const combiBoiler1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-444444444",
		name: "Heat network 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
	};

	// const heatNetwork: Partial<DomesticHotWaterHeatSourceData> = {
	// 	isExistingHeatSource: false,
	// 	heatSourceId: "NEW_HEAT_SOURCE",
	// 	id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
	// 	name: "Heat network",
	// 	typeOfHeatSource: "heatNetwork",
	// 	typeOfHeatNetwork: "communalHeatNetwork",
	// 	isHeatNetworkInPcdb: true,
	// };

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: heatSource1 },
						{ data: heatSource2 },
						{ data: combiBoiler1 },
						// { data: heatNetwork },
					],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref({ ...MOCKED_HEAT_PUMPS }),
		});
	});

	afterEach(() => {
		store.$reset();

		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("title dependant on the type of heat source", async () => {
		mockRoute.mockReturnValue({
			params: {
				pump: "0",
				products: "heat-pump",
			},
			path: "/0/heat-pump",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a heat pump" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-pump",
			},
			path: "/1/heat-pump",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.domesticHotWater.heatSources.data[1]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_PUMPS.data[1]?.id }));
	});

	test("Form marks that boiler location does not need to be specified when boiler location is 'internal'", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "2",
				products: "combi-boiler",
			},
			path: "/2/combi-boiler",
		});

		const mockedCombiBoilers: PaginatedResult<DisplayProduct> = {
			data: [
				{
					displayProduct: true,
					id: "1000",
					brandName: "HEM Default",
					modelName: "Combi Boiler",
					technologyType: "CombiBoiler",
					boilerLocation: "internal",
				},
			],
		};

		mockFetch.mockReturnValue({
			data: ref(mockedCombiBoilers),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.domesticHotWater.heatSources.data[2]!.data,
		).toEqual(expect.objectContaining({ needsSpecifiedLocation: false }));
	});

	// test("when a heat network product is a fifth generation, hasBoosterHeatPump is set to true", async () => {
		
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatSource: "3",
	// 			products: "heat-network",
	// 		},
	// 		path: "/3/heat-network",
	// 	});
		
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatSource: "3",
	// 			products: "heat-network",
	// 			id: "1000",
	// 		},
	// 		path: "/3/heat-network/1000",
	// 	});
	// 	const product = {
	// 		id: "1000",
	// 		brandName: "Test",
	// 		modelName: "Heat network",
	// 		modelQualifier: "HNSMALL",
	// 		technologyType: "HeatNetworks",
	// 	};
	// 	const heatNetworks = {
	// 		data: [product],
	// 	};
	// 	mockFetch.mockReturnValueOnce({
	// 		data: ref(heatNetworks),
	// 	});	
	// 	mockFetch.mockReturnValueOnce({
	// 		data: ref({
	// 			...product,
	// 			fifthGHeatNetwork: 1,
	// 		}),
	// 	});	
	
	// 	await renderSuspended(Products);
	// 	await user.click(screen.getByTestId("selectProductButton_0"));
	// 	expect((store.domesticHotWater.heatSources.data[3]!.data as { hasBoosterHeatPump: boolean }).hasBoosterHeatPump).toBe(true);
	// });

	test("makes additional fetch for hot water only heat pumps if pageId is heatPump", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-pump",
			},
			path: "/1/heat-pump",
		});

		mockFetch.mockResolvedValueOnce({
			data: ref({ ...MOCKED_HEAT_PUMPS }),
		}).mockResolvedValueOnce({
			data: ref({ ...HOT_WATER_HEAT_PUMPS }),
		});

		await renderSuspended(Products);
		expect(mockFetch).toHaveBeenCalledTimes(2);
		
		expect(mockFetch).toHaveBeenNthCalledWith(
			1,
			"/api/products",
			{ query: { technologyGroup: "heatPump" } },
			expect.any(String), // nuxt appears to call useFetch with "$-AeMDhtYIx" as an extra arg here (???)
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			2,
			"/api/products",
			{ query: { technologyType: "HotWaterOnlyHeatPump" } },
			expect.any(String), // nuxt appears to call useFetch with "$-AeMDhtYIx" as an extra arg here (???)
		);
		
		expect(screen.queryAllByTestId("productRow").length).toBe(MOCKED_HEAT_PUMPS.data.length + HOT_WATER_HEAT_PUMPS.data.length);
	});

	test("a boiler heat source is created when a hybrid heat pump is selected", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: heatSource1 },
					],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-pump",
			},
			path: "/0/heat-pump",
		});

		mockFetch.mockReturnValueOnce({
			data: ref({ ...MOCKED_HEAT_PUMPS }),
		}).mockReturnValueOnce({
			data: ref({ ...HOT_WATER_HEAT_PUMPS }),
		});

		const mockBoiler: Partial<BoilerProduct> = {
			id: "2000",
			brandName: "Test",
			modelName: "Combi boiler",
			technologyType: "CombiBoiler",
		};

		mockFetch.mockReturnValueOnce({
			data: ref(mockBoiler),
		});
		
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_3"));

		const heatSources = store.domesticHotWater.heatSources.data;

		expect(heatSources.length).toBe(2);

		expect(heatSources[1]?.data).toStrictEqual(expect.objectContaining({
			name: "Combi boiler",
			productReference: "2000",
			packagedProductReference: "1004",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
		}));
	});
		
	test("'Back to heat source' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-pump",
			},
			path: "/1/heat-pump",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatSourceButton");

		expect(backButton.getAttribute("href")).toBe(
			"/domestic-hot-water/heat-sources/1",
		);
	});
});