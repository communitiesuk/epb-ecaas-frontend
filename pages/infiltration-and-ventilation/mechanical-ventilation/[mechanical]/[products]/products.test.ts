import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

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

	const mockedProducts = {
		mvhr: {
			data: [
				{
					displayProduct: true,
					id: "1000",
					brandName: "Test",
					modelName: "MVHR",
					technologyType: "CentralisedMvhr",
				},
			],
		},
		centralisedMv: {
			data: [
				{
					displayProduct: true,
					id: "1001",
					brandName: "Test",
					modelName: "Centralised MV",
					technologyType: "CentralisedMv",
				},
			],
		},
		centralisedContinuousMev: {
			data: [
				{
					displayProduct: true,
					id: "1002",
					brandName: "Test",
					modelName: "Centralised MEV",
					technologyType: "CentralisedMev",
				},
			],
		},
		decentralisedContinuousMev: {
			data: [
				{
					displayProduct: true,
					id: "1003",
					brandName: "Test",
					modelName: "Decentralised MEV",
					technologyType: "DecentralisedMev",
				},
			],
		},
	} as const;

	const mvhr: Partial<MechanicalVentilationData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "MVHR",
		typeOfMechanicalVentilationOptions: "MVHR",
	};

	const centralisedMV: Partial<MechanicalVentilationData> = {
		id: "463c94f6-566c-49b2-af27-222222223",
		name: "Centralised MV",
		typeOfMechanicalVentilationOptions: "Centralised MV",
	};

	const centralisedContinousMEV: Partial<MechanicalVentilationData> = {
		id: "463c94f6-566c-49b2-af27-222222224",
		name: "Centralised Continous MEV",
		typeOfMechanicalVentilationOptions: "Centralised continuous MEV",
	};

	const decentralisedContinousMEV: Partial<MechanicalVentilationData> = {
		id: "463c94f6-566c-49b2-af27-222222225",
		name: "Decentralised Continous MEV",
		typeOfMechanicalVentilationOptions: "Decentralised continuous MEV",
	};

	const mechanicalVentilationScenarios = [
		{
			name: "MVHR",
			mechanicalVentilation: mvhr,
			route: "mvhr",
			path: "/0/mvhr",
			title: "Select an MVHR",
		},
		{
			name: "Centralised MV",
			mechanicalVentilation: centralisedMV,
			route: "centralisedMv",
			path: "/0/centralised-mv",
			title: "Select a centralised MV",
		},
		{
			name: "Centralised continuous MEV",
			mechanicalVentilation: centralisedContinousMEV,
			route: "centralisedContinuousMev",
			path: "/0/centralised-continuous-mev",
			title: "Select a centralised continuous MEV",
		},
		{
			name: "Decentralised continuous MEV",
			mechanicalVentilation: decentralisedContinousMEV,
			route: "decentralisedContinuousMev",
			path: "/0/decentralised-continuous-mev",
			title: "Select a decentralised continuous MEV",
		},
	] as const;

	afterEach(async () => {
		store.$reset();
	});

	test.each(mechanicalVentilationScenarios)(
		"title dependant on the type of mechanical ventilation - $name",
		async ({ mechanicalVentilation, route, path, title }) => {
			store.$patch({
				infiltrationAndVentilation: {
					mechanicalVentilation: {
						data: [{ data: mechanicalVentilation }],
					},
				},
			});

			mockRoute.mockReturnValue({
				params: {
					mechanical: "0",
					products: route,
				},
				path,
			});

			mockFetch.mockReturnValue({
				data: ref(mockedProducts[route]),
			});

			await renderSuspended(Products);

			expect(
				screen.getByRole("heading", { name: title }),
			);
		},
	);

	test.each(mechanicalVentilationScenarios)(
		"when a user selects a $name product, its product reference gets stored",
		async ({ mechanicalVentilation, route, path }) => {
			store.$patch({
				infiltrationAndVentilation: {
					mechanicalVentilation: {
						data: [{ data: mechanicalVentilation }],
					},
				},
			});

			mockRoute.mockReturnValue({
				params: {
					mechanical: "0",
					products: route,
				},
				path,
			});

			mockFetch.mockReturnValue({
				data: ref(mockedProducts[route]),
			});

			await renderSuspended(Products);

			await user.click(screen.getByTestId("selectProductButton_0"));

			expect(
				store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
			).toEqual(
				expect.objectContaining({
					productReference: mockedProducts[route].data[0].id,
				}),
			);
		},
	);

	test("'Back to mechanical ventilation' navigates user to the mechanical ventilation at the correct index", async () => {
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
			},
			path: "/0/mvhr",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.mvhr),
		});

		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToMechanicalVentilationButton");

		expect(backButton.getAttribute("href")).toBe(
			"/infiltration-and-ventilation/mechanical-ventilation/0",
		);
	});
});