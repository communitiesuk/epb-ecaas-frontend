import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat emitter products page", () => {
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

	const MOCKED_HEAT_EMITTERS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				displayProduct: true,
				id: "1000",
				brandName: "Test",
				modelName: "Fan coil",
				technologyType: "FanCoils",
			},
		],
	};

	const MOCKED_RADIATORS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				displayProduct: true,
				id: "60",
				technologyType: "ConvectorRadiator",
				type: "T33",
				height: 900,
			},
		],
	};
	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_EMITTERS),
		});
	});

	const heatEmitter1: Partial<HeatEmittingData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Warm air heater 1",
		typeOfHeatEmitter: "warmAirHeater",
	};

	beforeEach(async () => {
		store.$patch({
			spaceHeating: {
				heatEmitters: {
					data: [{ data: heatEmitter1 }],
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title dependant on the type of heat emitter", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "electric-storage-heater",
			},
			query: {},
			path: "/0/electric-storage-heater",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select an electric storage heater" }),
		);
	});

	test("title is shown for radiator products", async () => {
		mockFetch.mockReset();
		mockFetch.mockReturnValue({
			data: ref(MOCKED_RADIATORS),
		});

		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "radiator",
			},
			query: { emitterIndex: "0" },
			path: "/0/radiator",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a radiator" }),
		);
		expect(screen.queryByText("Brand")).toBeNull();
		expect(screen.getByText("T33")).toBeDefined();
		expect(screen.getByText("900")).toBeDefined();
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "electric-storage-heater",
			},
			query: {},
			path: "/0/electric-storage-heater",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.spaceHeating.heatEmitters.data[0]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_EMITTERS.data[0]?.id }));
	});

	test("more details link keeps emitter index in query params", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "electric-storage-heater",
			},
			query: { emitterIndex: "0" },
			path: "/0/electric-storage-heater",
		});
		await renderSuspended(Products);

		expect(screen.getByRole("link", { name: "More details" }).getAttribute("href")).toBe("/0/electric-storage-heater/1000?emitterIndex=0");
	});

	test("'Back to heat emitters' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "electric-storage-heater",
			},
			query: {},
			path: "/0/electric-storage-heater",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatEmittersButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-emitters/0",
		);
	});
});