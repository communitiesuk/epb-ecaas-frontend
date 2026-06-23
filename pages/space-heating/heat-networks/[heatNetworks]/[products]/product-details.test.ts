import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { DisplayProduct, Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id]/index.vue";
import { screen } from "@testing-library/vue";
import type { H3Error } from "h3";
import userEvent from "@testing-library/user-event";

describe("Heat network details", async () => {
    
	const heatNetwork: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-333333333",
		name: "Heat network 1",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
	};

	const product: Partial<DisplayProduct> = {
		id: "2000",
		productId: "2000",
		subHeatNetworkId: "subnetwork-2000",
		technologyType: "HeatNetworks",
		subheatNetworkName: "Test subnetwork 2",
		displayProduct: true,
	};
    
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
    
	beforeEach(() => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{ data: heatNetwork },
					],
				},
			},
		});
    
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network",
				id: "1000",
			},
			path: "/0/heat-networks/1000",
		});
    
		mockFetch.mockReturnValue({
			data: ref(product),
		});
	});
    
	afterEach(() => {
		store.$reset();
    
		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("Displays heat network details when product is a heat network", async () => {
	// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "1",
				products: "heat-network",
				id: "1000",
			},
			path: "/1/heat-network/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Heat network",
				technologyType: "HeatNetworks",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("heatNetwork"))).toBeDefined();
	});

	test("Returns not found error when products route parameter is invalid", async () => {
		// Arrange
		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				heatNetwork: "0",
				products: "heat-network-invalid",
				id: "1234",
			},
			path: "/0/heat-network-invalid/1234",
		});

		// Act
		try {
			await renderSuspended(ProductDetails);
		} catch (error) {
			h3Error = error as H3Error;
		}

		// Assert
		expect(h3Error?.cause).toStrictEqual({
			statusCode: 404,
			statusMessage: "Product type not found",
		});
	});

	test("Back link includes displays product type", async () => {
		// Act
		await renderSuspended(ProductDetails);
	
		// Assert
		expect(screen.getByTestId("backLink").innerText).toBe("Back to heat networks");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));
	
		const heatNetwork = store.spaceHeating.heatNetworks.data[0]?.data as PcdbProduct;
	
		// Assert
		expect(heatNetwork.productReference).toBe("2000");
	});

	test("Navigates to heat networks page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-networks/0");
	});

	// test("when a heat network product is a fifth generation, hasBoosterHeatPump is set to true", async () => {
	// 	// Arrange
	// 	mockRoute.mockReturnValue({
	// 		params: {
	// 			heatNetwork: "1",
	// 			products: "heat-network",
	// 			id: "1000",
	// 		},
	// 		path: "/1/heat-network/1000",
	// 	});

	// 	mockFetch.mockReturnValue({
	// 		data: ref({
	// 			id: "1000",
	// 			brandName: "Test",
	// 			modelName: "Heat network",
	// 			modelQualifier: "HNSMALL",
	// 			technologyType: "HeatNetworks",
	// 			fifthGHeatNetwork: 1,
	// 		}),
	// 	});	
	// 	await renderSuspended(ProductDetails);
	// 	await user.click(screen.getByTestId("selectProductButton"));
	// 	expect((store.spaceHeating.heatNetworks.data[1]!.data as { hasBoosterHeatPump: boolean }).hasBoosterHeatPump).toBe(true);
	// });
});