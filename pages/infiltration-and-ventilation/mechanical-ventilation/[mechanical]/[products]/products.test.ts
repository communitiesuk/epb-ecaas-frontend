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
		store.$reset();
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

	test("title is correct for MVHR", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: mvhr }],
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

		expect(
			screen.getByRole("heading", { name: "Select an MVHR" }),
		);
	});

	test("title is correct for Centralised MV", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: centralisedMV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "centralisedMv",
			},
			path: "/0/centralised-mv",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.centralisedMv),
		});

		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a centralised MV" }),
		);
	});

	test("title is correct for Centralised continuous MEV", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: centralisedContinousMEV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "centralisedContinuousMev",
			},
			path: "/0/centralised-continuous-mev",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.centralisedContinuousMev),
		});

		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", {
				name: "Select a centralised continuous MEV",
			}),
		);
	});

	test("title is correct for Decentralised continuous MEV", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: decentralisedContinousMEV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "decentralisedContinuousMev",
			},
			path: "/0/decentralised-continuous-mev",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.decentralisedContinuousMev),
		});

		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", {
				name: "Select a decentralised continuous MEV",
			}),
		);
	});

	test("when a user selects an MVHR product, its product reference gets stored", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: mvhr }],
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

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
		).toEqual(
			expect.objectContaining({
				productReference: mockedProducts.mvhr.data[0].id,
			}),
		);
	});

	test.skip("when a user selects a Centralised MV product, its product reference gets stored", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: centralisedMV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "centralisedMv",
			},
			path: "/0/centralised-mv",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.centralisedMv),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
		).toEqual(
			expect.objectContaining({
				productReference: mockedProducts.centralisedMv.data[0].id,
			}),
		);
	});

	test.skip("when a user selects a Centralised continuous MEV product, its product reference gets stored", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: centralisedContinousMEV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "centralisedContinuousMev",
			},
			path: "/0/centralised-continuous-mev",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.centralisedContinuousMev),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
		).toEqual(
			expect.objectContaining({
				productReference: mockedProducts.centralisedContinuousMev.data[0].id,
			}),
		);
	});

	test.skip("when a user selects a Decentralised continuous MEV product, its product reference gets stored", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{ data: decentralisedContinousMEV }],
				},
			},
		});

		mockRoute.mockReturnValue({
			params: {
				mechanical: "0",
				products: "decentralisedContinuousMev",
			},
			path: "/0/decentralised-continuous-mev",
		});

		mockFetch.mockReturnValue({
			data: ref(mockedProducts.decentralisedContinuousMev),
		});

		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.infiltrationAndVentilation.mechanicalVentilation.data[0]!.data,
		).toEqual(
			expect.objectContaining({
				productReference: mockedProducts.decentralisedContinuousMev.data[0].id,
			}),
		);
	});

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