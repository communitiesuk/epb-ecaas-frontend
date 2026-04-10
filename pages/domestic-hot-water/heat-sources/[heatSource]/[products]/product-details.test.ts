import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { BoilerProduct, HeatPumpProduct, HybridHeatPumpProduct, Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat source details", async () => {
	const smallHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
		name: "Heat pump 2",
		productReference: "HEATPUMP-SMALL",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
		isExistingHeatSource: false,
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
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: smallHeatPump }, { data: combiBoiler }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-pump",
				id: "1000",
			},
			path: "/0/heat-pump/1000",
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
		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				pump: "0",
				products: "air-source-invalid",
				id: "1234",
			},
			path: "/0/air-source-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to heat pumps");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.domesticHotWater.heatSources.data[0]?.data as PcdbProduct;

		// Assert
		expect(heatSource.productReference).toBe("1000");
	});

	test("A boiler heat source is created when a hybrid heat pump is selected", async () => {
		// Arrange
		const hybridHeatPump: Partial<HeatSourceData> = {
			id: "463c94f6-566c-49b2-af27-444444444",
			name: "Hybrid heat pump",
			typeOfHeatSource: "heatPump",
		};

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: hybridHeatPump },
					],
				},
			},
		});

		const hybridHeatPumpProduct: Partial<HybridHeatPumpProduct> = {
			id: "1000",
			brandName: "Test",
			modelName: "Hybrid heat pump",
			technologyType: "HybridHeatPump",
			technologyGroup: "heatPump",
			boilerProductID: "2000",
		};

		const backupBoilerProduct: Partial<BoilerProduct> = {
			id: "2000",
			brandName: "Test",
			modelName: "Backup boiler",
			technologyType: "CombiBoiler",
			boilerLocation: "internal",
		};

		mockFetch.mockReturnValueOnce({
			data: ref(hybridHeatPumpProduct),
		});

		mockFetch.mockReturnValueOnce({
			data: ref(backupBoilerProduct),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		const heatSources = store.domesticHotWater.heatSources.data;

		expect(heatSources.length).toBe(2);

		expect(heatSources[1]?.data).toStrictEqual(expect.objectContaining({
			name: "Combi boiler",
			productReference: "2000",
			packagedProductReference: "1000",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
		}));
	});

	test("A hot water cylinder is created when a heat pump with vessel type 'Integral' is selected", async () => {
		// Arrange
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: smallHeatPump },
					],
				},
			},
		});

		const heatPumpDetails: Partial<HeatPumpProduct> = {
			id: "1000",
			brandName: "Test",
			modelName: "Heat Pump",
			technologyType: "AirSourceHeatPump",
			vesselType: "Integral",
			tankVolumeDeclared: 20,
			dailyLossesDeclared: 10,
			heatExchangerSurfaceAreaDeclared: 0.65,
		};

		mockFetch.mockReturnValueOnce({
			data: ref(heatPumpDetails),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		const waterStorageData = store.domesticHotWater.waterStorage.data;
		const expectedCylinderData: Partial<WaterStorageData> = {
			name: "Hot water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: "1000",
			storageCylinderVolume: unitValue(20, "litres"),
			dailyEnergyLoss: 10,
			areaOfHeatExchanger: 0.65,
		};

		const hotWaterHeatSources = store.domesticHotWater.heatSources.data;
		const expectedHotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			typeOfHeatPump: "airSource",
			productReference: "1000",
		};

		expect(hotWaterHeatSources.length).toBe(1);
		expect(hotWaterHeatSources[0]?.data).toStrictEqual(expect.objectContaining(expectedHotWaterHeatPump));

		expect(waterStorageData.length).toBe(1);
		expect(waterStorageData[0]?.data).toStrictEqual(expect.objectContaining(expectedCylinderData));
	});

	test("Displays heat pump details when product is a heat pump", async () => {
		// Act
		await renderSuspended(ProductDetails);
			
		// Assert
		expect((await screen.findByTestId("heatPump"))).toBeDefined();
	});

	test("Form records that a specified location is needed when boiler location is 'unknown'", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "combi-boiler",
				id: "1000",
			},
			path: "/1/combi-boiler/1000",
		});

		mockFetch.mockReturnValue({
			data: ref(combiBoilerProduct),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.domesticHotWater.heatSources.data[1]?.data as HeatSourceData;

		// Assert
		expect(heatSource).toEqual(expect.objectContaining({ needsSpecifiedLocation: true }));
	});

	test("Displays hybrid heat pump details when product is a hybrid heat pump", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-pump",
				id: "1000",
			},
			path: "/0/heat-pump/1000",
		});
	
		mockFetch.mockReturnValue({
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

	// test("when a heat network product is a fifth generation, hasBoosterHeatPump is set to true", async () => {
		
	// 	const heatNetwork: Partial<DomesticHotWaterHeatSourceData> = {
	// 		isExistingHeatSource: false,
	// 		heatSourceId: "NEW_HEAT_SOURCE",
	// 		id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
	// 		name: "Heat network",
	// 		typeOfHeatSource: "heatNetwork",
	// 		typeOfHeatNetwork: "communalHeatNetwork",
	// 		isHeatNetworkInPcdb: true,
	// 	};

	// 	store.$patch({
	// 		domesticHotWater: {
	// 			heatSources: {
	// 				data: [{ data: heatNetwork }],
	// 			},
	// 		},
	// 	});

	// 	mockRoute.mockReturnValueOnce({
	// 		params: {
	// 			heatSource: "0",
	// 			products: "heat-network",
	// 			id: "1000",
	// 		},
	// 		path: "/0/heat-network/1000",
	// 	});
		
	// 	mockFetch.mockReturnValueOnce({
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
	// 	expect((store.domesticHotWater.heatSources.data[0]!.data as { hasBoosterHeatPump: boolean }).hasBoosterHeatPump).toBe(true);
	// });
		
	test("Navigates to heat pump page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/domestic-hot-water/heat-sources/0");
	});
});