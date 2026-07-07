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
			},
			{
				id: "2000",
				productId: "2000",
				subHeatNetworkId: "subnetwork-2000",
				technologyType: "HeatNetworks",
				subheatNetworkName: "Test subnetwork 2",
				displayProduct: true,
			},
		],
	};

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_NETWORKS),
		});
	});

	const heatNetwork1: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat Network 1",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
	};
	const heatNetwork2: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat Network 2",
		typeOfHeatNetwork: "communalHeatNetwork",
	};

	beforeEach(() => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{ data: heatNetwork1 },
						{ data: heatNetwork2 },
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
				heatNetwork: "1",
				products: "heat-network",
			},
			path: "/1/heat-network",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.spaceHeating.heatNetworks.data[1]!.data,
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
				heatNetwork: "1",
				products: "heat-network",
			},
			path: "/1/heat-network",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatNetworkButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-networks/1",
		);
	});

	test("when a heat network product is a fifth generation, hasBoosterHeatPump is set to true", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatNetworks: "1",
				products: "heat-network",
			},
			path: "/1/heat-network",
		});
	
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "1",
				products: "heat-network",
				id: "1000",
			},
			path: "/1/heat-network/1000",
		});
	
		const product = {
			id: "1000",
			brandName: "Test",
			modelName: "Heat network",
			modelQualifier: "HNSMALL",
			technologyType: "HeatNetworks",
		};
	
		const heatNetworks = {
			data: [product],
		};
	
		mockFetch.mockReturnValueOnce({
			data: ref(heatNetworks),
		});	
	
		mockFetch.mockReturnValueOnce({
			data: ref({
				...product,
				fifthGHeatNetwork: 1,
			}),
		});	
	
		await renderSuspended(Products);
		await user.click(screen.getByTestId("selectProductButton_0"));
		expect(store.spaceHeating.heatNetworks.data[1]!.data).toEqual(expect.objectContaining({
			hasBoosterHeatPump: true,
		}));
	});
});