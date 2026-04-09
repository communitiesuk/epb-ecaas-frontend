import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat pump details", async () => {
	const wetDistributionSystem: Partial<HeatEmittingData> = {
		name: "Wet distribution system 1",
		typeOfHeatEmitter: "wetDistributionSystem",
		heatSource: "HS1",
		id: "463c94f6-566c-49b2-af27-222222222",
		emitters: [
			{
				id: "1234",
				name: "Fan coil 1",
				typeOfHeatEmitter: "fanCoil",
				numOfFanCoils: 2,
			},
		],
	};

	const electricStorageHeater: Partial<HeatEmittingData> = {
		name: "Electric storage heater 1",
		typeOfHeatEmitter: "electricStorageHeater",
		id: "463c94f6-566c-49b2-af27-333333333",
	};

	const product: Partial<Product> = {
		id: "1000",
		brandName: "Test",
		modelName: "Fan coil",
		technologyType: "FanCoils",
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
				heatEmitters: {
					data: [
						{ data: wetDistributionSystem },
						{ data: electricStorageHeater },
					],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "fan-coil",
				id: "1000",
			},
			query: { emitterIndex: "0" },
			path: "/0/fan-coil/1000",
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
				heatEmitter: "0",
				products: "fan-coil-invalid",
				id: "1234",
			},
			query: {},
			path: "/0/fan-coil-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to fan coils");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const system = store.spaceHeating.heatEmitters.data[0]?.data as { emitters: Record<string, unknown>[] };

		// Assert
		expect(system.emitters[0]?.productReference).toBe("1000");
	});

	test("Navigates to heat emitter page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-emitters/0?emitterIndex=0");
	});

	test("Displays fan coil details when product is a fan coil", async () => {
		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect((await screen.findByTestId("fanCoil"))).toBeDefined();
	});

	test("Displays electric storage heater details when product is an electric storage heater", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "1",
				products: "electric-storage-heater",
				id: "1000",
			},
			query: {},
			path: "/1/electric-storage-heater/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Electric storage heater",
				technologyType: "StorageHeader",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect((await screen.findByTestId("electricStorageHeater"))).toBeDefined();
	});

	test("Displays convector radiator details when product is a radiator", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "radiator",
				id: "60",
			},
			query: { emitterIndex: "0" },
			path: "/0/radiator/60",
		});

		mockFetch.mockReturnValue({
			data: ref({
				technologyType: "ConvectorRadiator",
				ID: 60,
				water_contents: 15.7344,
				c: 0.0151485,
				wetEmitterType: "radiator",
				dataType: "illustrative_aggregated",
				thermal_mass_per_m: 0.028337,
				thermal_output_delta_50k: 3097,
				weight: 79.8415,
				frac_convective: 0.86,
				type: "T33",
				n: 1.36,
				height: 900,
			}),
		});

		// Act
		await renderSuspended(ProductDetails);

		// Assert
		expect((await screen.findByTestId("convectorRadiator"))).toBeDefined();
		expect(screen.getByRole("heading", { name: "T33 900 mm" })).toBeDefined();
	});
});
