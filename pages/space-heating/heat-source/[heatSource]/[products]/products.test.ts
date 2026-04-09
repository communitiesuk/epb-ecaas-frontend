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
			{
				id: "1003",
				brandName: "Test",
				modelName: "Hybrid Heat Pump",
				technologyType: "HybridHeatPump",
				boilerProductID: "2000",
			},
		],
	};

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_PUMPS),
		});
	});

	const heatSource1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfHeatSource: "heatPump",
	};

	// const heatNetwork1: Partial<HeatSourceData> = {
	// 	id: "463c94f6-566c-49b2-af27-333333333",
	// 	name: "Heat network 1",
	// 	typeOfHeatSource: "heatNetwork",
	// 	typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
	// 	usesHeatInterfaceUnits: true,
	// 	isHeatNetworkInPcdb: true,
	// };

	const combiBoiler1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-444444444",
		name: "Combi boiler",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
	};

	beforeEach(async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{ data: heatSource1 },
						// { data: heatNetwork1 },
						{ data: combiBoiler1 },
					],
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
				heatSource: "0",
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
				heatSource: "0",
				products: "heat-pump",
			},
			path: "/0/heat-pump",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.spaceHeating.heatSource.data[0]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_PUMPS.data[1]?.id }));
	});

	//Unsure how to handle this with the heat network input being removed, but currently HIUs aren't an option so review this later
	test.skip("when a user selects a heat interface unit product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-interface-unit",
			},
			path: "/1/heat-interface-unit",
		});

		const mockedHeatInterfaceUnits: PaginatedResult<DisplayProduct> = {
			data: [
				{
					id: "1000",
					brandName: "HEM Default",
					modelName: "Heat Interface Unit",
					technologyType: "HeatInterfaceUnit",
				},
			],
		};

		mockFetch.mockReturnValue({
			data: ref(mockedHeatInterfaceUnits),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.spaceHeating.heatSource.data[1]!.data,
		).toEqual(expect.objectContaining({ heatInterfaceUnitProductReference: mockedHeatInterfaceUnits.data[0]?.id }));
	});

	test("Form marks that it needs a specified boiler location when boiler location is 'unknown'", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "combi-boiler",
			},
			path: "/1/combi-boiler",
		});

		const mockedCombiBoilers: PaginatedResult<DisplayProduct> = {
			data: [
				{
					id: "1000",
					brandName: "HEM Default",
					modelName: "Combi Boiler",
					technologyType: "CombiBoiler",
					boilerLocation: "unknown",
				},
			],
		};

		mockFetch.mockReturnValue({
			data: ref(mockedCombiBoilers),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.spaceHeating.heatSource.data[1]!.data,
		).toEqual(expect.objectContaining({ needsSpecifiedLocation: true }));
	});

	test("'Back to heat source' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-pump",
			},
			path: "/0/heat-pump",
		});

		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatSourceButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-source/0",
		);
	});

	test("standard PCDB search and product table is displayed when selecting a product other than heat networks", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-pump",
			},
			path: "/0/heat-pump",
		});

		await renderSuspended(Products);

		expect(screen.getByTestId("productsTable")).toBeDefined();
	});

	// test("heat network PCDB search and product table is displayed when selecting a heat network product", async () => {
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatSource: "1",
	// 			products: "heat-network",
	// 		},
	// 		path: "/1/heat-network",
	// 	});

	// 	await renderSuspended(Products);

	// 	expect(screen.getByTestId("heatNetworkProductsTable")).toBeDefined();
	// });

	// test("when a heat network product is a fifth generation, hasBoosterHeatPump is set to true", async () => {
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatSource: "1",
	// 			products: "heat-network",
	// 		},
	// 		path: "/1/heat-network",
	// 	});
	
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatSource: "1",
	// 			products: "heat-network",
	// 			id: "1000",
	// 		},
	// 		path: "/1/heat-network/1000",
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
	// 	expect(store.spaceHeating.heatSource.data[1]!.data).toEqual(expect.objectContaining({
	// 		hasBoosterHeatPump: true,
	// 	}));
	// });

	test("a boiler heat source is created when a hybrid heat pump is selected", async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
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
			data: ref(MOCKED_HEAT_PUMPS),
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

		const heatSources = store.spaceHeating.heatSource.data;

		expect(heatSources.length).toBe(2);

		expect(heatSources[1]?.data).toEqual(expect.objectContaining({
			name: "Combi boiler",
			productReference: "2000",
			packagedProductReference: "1003",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
		}));
	});

	test("a mechanical ventilation entry gets created when an exhaust air heat pump is selected", async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
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

		const exhaustAirHeatPumpProduct: PaginatedResult<DisplayProduct> = {
			data: [{
				id: "1000",
				brandName: "Test",
				modelName: "Exhaust Air Heat Pump",
				technologyType: "ExhaustAirMvhrHeatPump",
			}],
		};

		mockFetch.mockReturnValueOnce({
			data: ref(exhaustAirHeatPumpProduct),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		const mechanicalVentildationData = store.infiltrationAndVentilation.mechanicalVentilation.data;
		const expectedData: Partial<MechanicalVentilationData> = {
			name: "Exhaust air MVHR HP",
			typeOfMechanicalVentilationOptions: "MVHR",
			productReference: "1000",
			packagedProductReference: "1000",
		};

		expect(mechanicalVentildationData.length).toBe(1);
		expect(mechanicalVentildationData[0]?.data).toStrictEqual(expect.objectContaining(expectedData));
	});
});