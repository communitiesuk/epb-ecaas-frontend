import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { BoilerProduct, DisplayProduct, HeatPumpProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat source products page", () => {
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

	afterEach(() => {
		mockFetch.mockReset();
		mockRoute.mockReset();
		store.$reset();
	});

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

	afterEach(() => {
		mockFetch.mockReset();
		mockRoute.mockReset();

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
					displayProduct: true,
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
					displayProduct: true,
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

	test("heat network PCDB search and product table is displayed when selecting a heat network product", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-network",
			},
			path: "/1/heat-network",
		});

		await renderSuspended(Products);

		expect(screen.getByTestId("heatNetworkProductsTable")).toBeDefined();
	});

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
	//});
	test("a heat network product  gets stored when a heat network is selected", async () => {
		const heatNetwork: Partial<HeatSourceData> = {
			id: "463c94f6-566c-49b2-af27-333333333",
			name: "Heat network 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{ data: heatNetwork },
					],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		const heatNetworkProduct: DisplayProduct = {
			id: "1000",
			brandName: "Test",
			modelName: "Heat network",
			modelQualifier: "HNSMALL",
			technologyType: "HeatNetworks",
			displayProduct: true,
		};

		mockFetch.mockReturnValueOnce({
			data: ref({
				data: [heatNetworkProduct],
			}),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(store.spaceHeating.heatSource.data[0]!.data).toEqual(expect.objectContaining({
			productReference: heatNetworkProduct.id,
		}));
	});


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
				displayProduct: true,
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

	test("a hot water cylinder is created when a heat pump with vessel type 'Integral' is selected", async () => {
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

		const heatPumpProduct: PaginatedResult<DisplayProduct> = {
			data: [{
				displayProduct: true,
				id: "1000",
				brandName: "Test",
				modelName: "Heat Pump",
				technologyType: "AirSourceHeatPump",
				vesselType: "Integral",
			}],
		};

		const heatPumpDetails: Partial<HeatPumpProduct> = {
			id: "1000",
			brandName: "Test",
			modelName: "Heat Pump",
			technologyType: "AirSourceHeatPump",
			vesselType: "Integral",
			tankVolumeDeclared: 20,
			dailyLossesDeclared: 10,
		};

		mockFetch.mockReturnValueOnce({
			data: ref(heatPumpProduct),
		}).mockReturnValueOnce({
			data: ref(heatPumpDetails),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		const waterStorageData = store.domesticHotWater.waterStorage.data;
		const expectedCylinderData: Partial<WaterStorageData> = {
			name: "Hot water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: "1000",
			storageCylinderVolume: unitValue(20, "litres"),
			dailyEnergyLoss: 10,
		};

		const hotWaterHeatSources = store.domesticHotWater.heatSources.data;
		const expectedHotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: true,
			heatSourceId: heatSource1.id,
		};

		expect(hotWaterHeatSources.length).toBe(1);
		expect(hotWaterHeatSources[0]?.data).toEqual(expect.objectContaining(expectedHotWaterHeatPump));

		expect(waterStorageData.length).toBe(1);
		expect(waterStorageData[0]?.data).toStrictEqual(expect.objectContaining(expectedCylinderData));
	});

	test("selecting a heat pump with cylinder should throw an error and redirect to the space heating form", async () => {
		const heatPump: Partial<HeatSourceData> = {
			id: "463c94f6-566c-49b2-af27-222222222",
			name: "Heat source 1",
			typeOfHeatSource: "heatPump",
		};

		const hotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			id: "c4f9f615-4ee8-49f0-b3bd-a48fc359dc24",
			isExistingHeatSource: true,
			createdAutomatically: true,
			heatSourceId: heatSource1.id,
		};

		const cylinderData: Partial<WaterStorageData> = {
			id: "5e267b2a-e3d6-4cfc-a776-30516527be4e",
			name: "Hot water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: "1000",
			storageCylinderVolume: unitValue(20, "litres"),
			dailyEnergyLoss: 10,
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{ data: heatPump },
					],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: hotWaterHeatPump },
					],
				},
				waterStorage: {
					data: [
						{ data: cylinderData },
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

		const heatPumpProduct: PaginatedResult<DisplayProduct> = {
			data: [{
				displayProduct: true,
				id: "1000",
				brandName: "Test",
				modelName: "Heat Pump",
				technologyType: "AirSourceHeatPump",
				vesselType: "Integral",
			}],
		};

		mockFetch.mockReturnValue({
			data: ref(heatPumpProduct),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-source/0?error=DHW_HEAT_SOURCE_CONFLICT");
		expect(store.spaceHeating.heatSource.data[0]?.data.productReference).toBeUndefined();
		expect(store.domesticHotWater.heatSources.data.length).toBe(1);
		expect(store.domesticHotWater.waterStorage.data.length).toBe(1);
	});
});