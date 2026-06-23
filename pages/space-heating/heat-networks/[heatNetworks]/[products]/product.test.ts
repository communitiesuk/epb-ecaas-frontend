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

	// 	test("'Back to water storage' navigates user to the water storage at the correct index", async () => {
	// 		mockRoute.mockReturnValue({
	// 			params: {
	// 				waterstorage: "1",
	// 				products: "smart-hot-water-tank",
	// 			},
	// 			path: "/1/smart-hot-water-tank",
	// 		});
	// 		await renderSuspended(Products);
	// 		const backButton = screen.getByTestId("backToWaterStorageButton");

// 		expect(backButton.getAttribute("href")).toBe(
// 			"/domestic-hot-water/water-storage/1",
// 		);
// 	});
});