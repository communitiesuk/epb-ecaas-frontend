//TODO convert from space heating to domestic hot water

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

	const heatPumpProduct: Partial<Product> = {
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
					data: [{ data: smallHeatPump }],
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

	test("Navigates to heat pump page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/space-heating/heat-source/0");
	});
});