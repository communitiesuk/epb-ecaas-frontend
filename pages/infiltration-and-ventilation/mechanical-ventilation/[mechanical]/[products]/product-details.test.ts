import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import type { Product } from "~/pcdb/pcdb.types";
import ProductDetails from "./[id].vue";
import type { H3Error } from "h3";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Mechanical ventilation details", async () => {
	const mvhr: Partial<MechanicalVentilationData> = {
		name: "MVHR 1",
		productReference: "1000",
	};

	const product: Partial<Product> = {
		id: "1000",
		brandName: "Test",
		modelName: "MVHR",
		technologyType: "CentralisedMvhr",
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
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mvhr },
					],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "mvhr",
				id: "1000",
			},
			path: "/0/mvhr/1000",
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
				products: "mvhr-invalid",
				id: "1234",
			},
			path: "/0/mvhr-invalid/1234",
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
		expect(screen.getByTestId("backLink").innerText).toBe("Back to MVHRs");
	});

	test("Store data updates when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		const mechanicalVentilation = store.infiltrationAndVentilation.mechanicalVentilation.data[0]?.data as PcdbProduct;

		// Assert
		expect(mechanicalVentilation.productReference).toBe("1000");
	});

	test("Navigates to mechanical ventilation page when product is selected", async () => {
		// Act
		await renderSuspended(ProductDetails);
		await user.click(screen.getByTestId("selectProductButton"));

		// Assert
		expect(mockNavigateTo).toHaveBeenCalledWith("/infiltration-and-ventilation/mechanical-ventilation/0");
	});

	test("Displays MVHR details when product is an MVHR", async () => {
		// Act
		await renderSuspended(ProductDetails);
		
		// Assert
		expect((await screen.findByTestId("mvhr"))).toBeDefined();
	});
});