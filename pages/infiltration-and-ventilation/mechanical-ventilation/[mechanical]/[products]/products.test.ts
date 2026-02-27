import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Mechanical ventilation products page", () => {
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

	const mockedMvhrs: PaginatedResult<DisplayProduct> = {
		data: [
			{
				id: "1000",
				brandName: "Test",
				modelName: "MVHR",
				technologyType: "CentralisedMvhr",
			},
		],
	};

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(mockedMvhrs),
		});
	});

	const mvhr1: Partial<MechanicalVentilationData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat source 1",
		typeOfMechanicalVentilationOptions: "MVHR",
	};

	beforeEach(async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mvhr1 },
					],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title dependant on the type of mechanical ventilation", async () => {
		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "mvhr",
			},
			path: "/0/mvhr",
		});
		
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select an MVHR" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "mvhr",
			},
			path: "/0/mvhr",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
		).toEqual(expect.objectContaining({ productReference: mockedMvhrs.data[0]?.id }));
	});

	test("'Back to mechanical ventilation' navigates user to the mechanical ventilation at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "mvhr",
			},
			path: "/0/mvhr",
		});

		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToMechanicalVentilationButton");

		expect(backButton.getAttribute("href")).toBe(
			"/infiltration-and-ventilation/mechanical-ventilation/0",
		);
	});
});