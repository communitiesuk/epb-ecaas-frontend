import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat source details", async () => {
	const smallHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
		name: "Heat pump 2",
		productReference: "HEATPUMP-SMALL",
		typeOfHeatPump: "airSource",
	};

	const combiBoiler: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-444444444",
		name: "Combi boiler 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
	};

	const heatPumpProduct: Partial<Product> = {
		id: "1000",
		brandName: "Test",
		modelName: "Small Heat Pump",
		modelQualifier: "HPSMALL",
		technologyType: "AirSourceHeatPump",
		technologyGroup: "heatPump",
	};

	const combiBoilerProduct: Partial<Product> = {
		id: "1000",
		brandName: "HEM Default",
		modelName: "Combi Boiler",
		technologyType: "CombiBoiler",
		boilerLocation: "unknown",
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
		
		mockRoute.mockReturnValue({
			params: {
				products: "air-source",
				id: "1000",
			},
			path: "/air-source/1000",
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProduct),
		});
	});

	afterEach(() => {
		store.$reset();

		mockFetch.mockReset();
		mockRoute.mockReset();
	});

	test("Returns not found error when products route parameter is invalid", async () => {
		// Arrange

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: smallHeatPump }],
				},
			},
		});

		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				products: "air-source-invalid",
				id: "1234",
			},
			path: "/air-source-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to air source heat pumps");
	});

	test("Store data updates when product is selected", async () => {
		//Arrange
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: smallHeatPump }],
				},
			},
		});
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.domesticHotWater.heatSources.data[0]?.data as PcdbProduct;

		// Assert
		expect(heatSource.productReference).toBe("1000");
	});

	test("Displays heat pump details when product is a heat pump", async () => {
		// Act
		await renderSuspended(ProductDetails);
			
		// Assert
		expect((await screen.findByTestId("heatPump"))).toBeDefined();
	});

	test("Form records that a specified location is needed when boiler location is 'unknown'", async () => {
		// Arrange

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: combiBoiler }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				products: "combi-boiler",
				id: "1000",
			},
			path: "/combi-boiler/1000",
		});

		mockFetch.mockReturnValue({
			data: ref(combiBoilerProduct),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.domesticHotWater.heatSources.data[0]?.data as HeatSourceData;

		// Assert
		expect(heatSource).toEqual(expect.objectContaining({ needsSpecifiedLocation: true }));
	});

	test("Displays hybrid heat pump details when product is a hybrid heat pump", async () => {
		// Arrange

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: smallHeatPump }],
				},
			},
		});

		mockRoute.mockReturnValueOnce({
			params: {
				products: "heat-pump",
				id: "1000",
			},
			path: "/heat-pump/1000",
		});
	
		mockFetch.mockReturnValueOnce({
			data: ref({
				...heatPumpProduct,
				modelName: "Hybrid heat pump",
				technologyType: "HybridHeatPump",
			}),
		});
	
		// Act
		await renderSuspended(ProductDetails);
			
		// Assert
		expect((await screen.findByTestId("hybridHeatPump"))).toBeDefined();
	});

	test("when a heat network product is a fifth generation, isFifthGeneration is set to true", async () => {
		
		const heatNetwork: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat network",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
		};

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatNetwork }],
				},
			},
		});

		mockRoute.mockReturnValueOnce({
			params: {
				products: "heat-network",
				id: "1000",
			},
			path: "/heat-network/1000",
		});
		
		mockFetch.mockReturnValueOnce({
			data: ref({
				id: "1000",
				brandName: "Test",
				modelName: "Heat network",
				modelQualifier: "HNSMALL",
				technologyType: "HeatNetworks",
				fifthGHeatNetwork: 1,
			}),
		});	
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));
		expect((store.domesticHotWater.heatSources.data[0]!.data as { isFifthGeneration: boolean }).isFifthGeneration).toBe(true);
	});
		
	test("Navigates to heat pump page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/domestic-hot-water/heat-sources");
	});
});