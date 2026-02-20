import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat pump details", async () => {
	const smallHeatPump: Partial<HeatPumpData> = {
		name: "Heat pump 2",
		productReference: "HEATPUMP-SMALL",
		typeOfHeatPump: "airSource",
	};

	const heatNetwork: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-333333333",
		name: "Heat network 1",
		typeOfHeatSource: "heatNetwork",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		usesHeatInterfaceUnits: true,
	};

	const combiBoiler: Partial<HeatSourceData> = {
		id: "463c94f6-566c-49b2-af27-444444444",
		name: "Combi boiler 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
	};

	const product: Partial<Product> = {
		id: "1000",
		brandName: "Test",
		modelName: "Small Heat Pump",
		modelQualifier: "HPSMALL",
		technologyType: "AirSourceHeatPump",
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
				heatSource: {
					data: [
						{ data: smallHeatPump },
						{ data: heatNetwork },
						{ data: combiBoiler },
					],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "air-source",
				id: "1000",
			},
			path: "/0/air-source/1000",
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

	test("Returns not found error when products route parameter is invalid", async () => {
		// Arrange
		let h3Error: H3Error | undefined;

		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to air source heat pumps");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.spaceHeating.heatSource.data[0]?.data as PcdbProduct;

		// Assert
		expect(heatSource.productReference).toBe("1000");
	});

	test("Store data updates when heat interface product is selected", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
				products: "heat-interface-unit",
				id: "1000",
			},
			path: "/1/heat-interface-unit/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Heat interface unit",
				technologyType: "HeatInterfaceUnit",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.spaceHeating.heatSource.data[1]?.data as HeatSourceData;

		// Assert
		expect(heatSource).toEqual(expect.objectContaining({ heatInterfaceUnitProductReference: product.id }));
	});

	test("Boiler location is stored as 'heatedSpace' when boiler location is 'internal'", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "2",
				products: "combi-boiler",
				id: "1000",
			},
			path: "/2/combi-boiler/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Combi boiler",
				technologyType: "CombiBoiler",
				boilerLocation: "internal",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const heatSource = store.spaceHeating.heatSource.data[2]?.data as HeatSourceData;

		// Assert
		expect(heatSource).toEqual(expect.objectContaining({ locationOfBoiler: "heatedSpace" }));
	});

	test("Navigates to heat pump page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-source/0");
	});

	test("Displays heat pump details when product is a heat pump", async () => {
		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("heatPump"))).toBeDefined();
	});

	test("Displays boiler details when product is a boiler", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "combi-boiler",
				id: "1000",
			},
			path: "/0/combi-boiler/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Combi boiler",
				technologyType: "CombiBoiler",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("boiler"))).toBeDefined();
	});

	test("Displays PCM heat battery details when product is a PCM heat battery", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-battery-pcm",
				id: "1000",
			},
			path: "/0/heat-battery-pcm/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "PCM Heat battery",
				technologyType: "HeatBatteryPCM",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("heatBatteryPcm"))).toBeDefined();
	});

	test("Displays dry core heat battery details when product is a dry core heat battery", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "0",
				products: "heat-battery-dry-core",
				id: "1000",
			},
			path: "/0/heat-battery-dry-core/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Dry core Heat battery",
				technologyType: "HeatBatteryDryCore",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("heatBatteryDryCore"))).toBeDefined();
	});

	test("Displays heat network details when product is a heat network", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatSource: "1",
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
});