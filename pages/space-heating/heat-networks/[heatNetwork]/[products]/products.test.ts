import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat Network Products Page", () => {
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

	const MOCKED_HEAT_NETWORKS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				id: "1000",
				productId: "1000",
				subHeatNetworkId: "subnetwork-1000",
				technologyType: "HeatNetworks",
				subheatNetworkName: "Test subnetwork 1",
				displayProduct: true,
				boosterHeatPump: false,
			},
			{
				id: "2000",
				productId: "2000",
				subHeatNetworkId: "subnetwork-2000",
				technologyType: "HeatNetworks",
				subheatNetworkName: "Test subnetwork 2",
				displayProduct: true,
				boosterHeatPump: true,
			},
			{
				id: "3000",
				productId: "3000",
				subHeatNetworkId: "subnetwork-3000",
				technologyType: "HeatNetworks",
				subheatNetworkName: "Test subnetwork 3",
				displayProduct: true,
				boosterHeatPump: false,
			},
			{
				id: "4000",
				productId: "4000",
				subHeatNetworkId: "subnetwork-4000",
				technologyType: "HeatNetworks",
				subheatNetworkName: "Test subnetwork 4",
				displayProduct: true,
				boosterHeatPump: true,
			},
		],
	};

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_NETWORKS),
		});
	});

	const sleevedDistrictHeatNetwork: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-111111122",
		name: "Sleeved District Heat Network",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
	};

	const heatInterfaceUnit: Partial<HeatSourceData> = {
		id: "hiuId",
		name: "Heat Interface Unit",
		typeOfHeatSource: "heatInterfaceUnit",
	};

	const boosterHeatPump: HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b52222",
		name: "Booster HP",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "booster",
		productReference: "HEATPUMP-SMALL",
		maxFlowTemp: unitValue(30, "celsius"),
		associatedHeatNetworkId: "463c94f6-566c-49b2-af27-111111111",
	};

	const dhwBoosterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
		isExistingHeatSource: false,
		heatSourceId: "NEW_HEAT_SOURCE",
		id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		name: "Booster Heat Pump",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "booster",
	};

	const dhwHeatInterfaceUnit: Partial<DomesticHotWaterHeatSourceData> = {
		isExistingHeatSource: false,
		heatSourceId: "NEW_HEAT_SOURCE",
		id: "463c94f6-566c-49b2-af27-57e5c68b5c22",
		name: "Heat Interface Unit",
		typeOfHeatSource: "heatInterfaceUnit",
	};

	beforeEach(() => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{ data: sleevedDistrictHeatNetwork },
					],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title matches select a heat network", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a heat network" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.spaceHeating.heatNetworks.data[0]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_NETWORKS.data[1]?.id }));
	});


	test("when a user selects a product its sub heat network name gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});
	
		await renderSuspended(Products);
	
		await user.click(screen.getByTestId("selectProductButton_0"));
	
		expect(store.spaceHeating.heatNetworks.data[0]!.data).toEqual(expect.objectContaining({
			subHeatNetworkName: MOCKED_HEAT_NETWORKS.data[0]?.subheatNetworkName,
		}));
	});

	test("'Back to heat network' navigates user to the heat network at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatNetworkButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-networks/0",
		);
	});

	test("does not render HEM default inset for heat network products", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		await renderSuspended(Products);

		expect(screen.queryByTestId("hemDefaultProductInset")).toBeNull();
	});

	test("heat network PCDB search and product table is displayed when selecting a heat network product", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		await renderSuspended(Products);

		expect(screen.getByTestId("heatNetworkProductsTable")).toBeDefined();
		expect(screen.getByText("Search network or subnetwork")).toBeDefined();
	});

	test("uses heat-network specific search labels and table for heat network products", async () => {
		const mockedHeatNetworks: PaginatedResult<DisplayProduct> = {
			data: [
				{
					displayProduct: true,
					id: "4000",
					technologyType: "HeatNetworks",
					communityHeatNetworkName: "Example network",
				},
			],
		};
	
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});
	
		mockFetch.mockReturnValue({
			data: ref(mockedHeatNetworks),
		});
	
		await renderSuspended(Products);
	
		expect(screen.getByTestId("heatNetworkProductsTable")).toBeDefined();
		expect(screen.getByTestId("searchOption_networkName")).toBeDefined();
		expect(screen.getByText("Search network or subnetwork")).toBeDefined();
	});

	test("only shows heat networks with booster heat pump flag when booster heat pump in space heating exists", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{
							data: boosterHeatPump,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(Products);

		expect(screen.queryByText("Test subnetwork 1")).toBeNull();
		expect(screen.getByText("Test subnetwork 2")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 3")).toBeNull();
		expect(screen.getByText("Test subnetwork 4")).toBeDefined();

	});

	test("only shows heat networks with booster heat pump flag when booster heat pump in domestic hot water exists", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{
							data: dhwBoosterHeatPump,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(Products);

		expect(screen.queryByText("Test subnetwork 1")).toBeNull();
		expect(screen.getByText("Test subnetwork 2")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 3")).toBeNull();
		expect(screen.getByText("Test subnetwork 4")).toBeDefined();

	});

	test("only shows heat networks without booster heat pump flag when a HIU exists in space heating", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [
						{
							data: heatInterfaceUnit,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(Products);

		expect(screen.getByText("Test subnetwork 1")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 2")).toBeNull();
		expect(screen.getByText("Test subnetwork 3")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 4")).toBeNull();
	});

	test("only shows heat networks without booster heat pump flag when a HIU exists in domestic hot water", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
			},
			path: "/0/heat-network",
		});

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{
							data: dhwHeatInterfaceUnit,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(Products);

		expect(screen.getByText("Test subnetwork 1")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 2")).toBeNull();
		expect(screen.getByText("Test subnetwork 3")).toBeDefined();
		expect(screen.queryByText("Test subnetwork 4")).toBeNull();
	});
});