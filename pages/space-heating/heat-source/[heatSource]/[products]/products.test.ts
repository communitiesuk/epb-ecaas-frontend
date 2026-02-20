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

	const heatNetwork1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-333333333",
		name: "Heat network 1",
		typeOfHeatSource: "heatNetwork",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		usesHeatInterfaceUnits: true,
	};

	const combiBoiler1: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-444444444",
		name: "Heat network 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
	};

	beforeEach(async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{ data: heatSource2 },
						{ data: heatSource1 },
						{ data: heatNetwork1 },
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
			store.spaceHeating.heatSource.data[1]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_PUMPS.data[1]?.id }));
	});

	test("when a user selects a heat interface unit product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "2",
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
			store.spaceHeating.heatSource.data[2]!.data,
		).toEqual(expect.objectContaining({ heatInterfaceUnitProductReference: mockedHeatInterfaceUnits.data[0]?.id }));
	});

	test("Boiler location is stored as 'heatedSpace' when boiler location is 'internal'", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "3",
				products: "combi-boiler",
			},
			path: "/3/combi-boiler",
		});

		const mockedCombiBoilers: PaginatedResult<DisplayProduct> = {
			data: [
				{
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
			store.spaceHeating.heatSource.data[3]!.data,
		).toEqual(expect.objectContaining({ locationOfBoiler: "heatedSpace" }));
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
			"/space-heating/heat-source/1",
		);
	});

	test("standard PCDB search and product table is displayed when selecting a product other than heat networks", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "air-source",
			},
			path: "/0/air-source",
		});

		await renderSuspended(Products);

		expect(screen.getByTestId("productSearch")).toBeDefined();
		expect(screen.getByTestId("productsTable")).toBeDefined();
	});

	test("heat network PCDB search and product table is displayed when selecting a heat network product", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		await renderSuspended(Products);

		expect(screen.getByTestId("heatNetworkProductSearch")).toBeDefined();
		expect(screen.getByTestId("heatNetworkProductsTable")).toBeDefined();
	});
});