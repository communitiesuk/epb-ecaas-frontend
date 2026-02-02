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
				id: "1000",
				brandName: "Test",
				modelName: "Fan coil",
				technologyType: "FanCoils",
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
		name: "Fan coil 1",
		typeOfHeatEmitter: "fanCoil",
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
				products: "fan-coil",
			},
			path: "/0/fan-coil",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select a fan coil" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "fan-coil",
			},
			path: "/0/fan-coil",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_0"));

		expect(
			store.spaceHeating.heatEmitters.data[0]!.data,
		).toEqual(expect.objectContaining({ productReference: MOCKED_HEAT_EMITTERS.data[0]?.id }));
	});

	test("'Back to heat emitters' navigates user to the heat source at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				heatEmitter: "0",
				products: "fan-coil",
			},
			path: "/0/fan-coil",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatEmittersButton");

		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-emitters/0",
		);
	});
});