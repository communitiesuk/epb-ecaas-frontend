import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat pump details", async () => {
	const fanCoil: Partial<HeatEmittingData> = {
		name: "Fan coil 1",
		productReference: "1000",
		typeOfHeatEmitter: "fanCoil",
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
					data: [{ data: fanCoil }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "fan-coil",
				id: "1000",
			},
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

		const heatSource = store.spaceHeating.heatEmitters.data[0]?.data as PcdbProduct;

		// Assert
		expect(heatSource.productReference).toBe("1000");
	});

	test("Navigates to heat emitter page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-emitters/0");
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
				heatEmitter: "0",
				products: "electric-storage-heater",
				id: "1000",
			},
			path: "/0/electric-storage-heater/1000",
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

	test("Displays instant electric heater details when product is an instant electric heater", async () => {
		// Arrange
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "instant-electric-heater",
				id: "1000",
			},
			path: "/0/instant-electric-heater/1000",
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				modelName: "Instant electric heater",
				technologyType: "DirectElectricHeaters",
			}),
		});

		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("instantElectricHeater"))).toBeDefined();
	});
});