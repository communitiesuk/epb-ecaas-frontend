import { renderSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Products from "./[products].vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

describe("Heat pumps products page", () => {
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

	const MOCKED_HEAT_PUMPS: PaginatedResult<DisplayProduct> = {
		data: [
			{
				id: "1000",
				brandName: "Test",
				modelName: "Small Heat Pump",
				modelQualifier: "HPSMALL",
				technologyType: "air source heat pumps",
			},
			{
				id: "1001",
				brandName: "Test",
				modelName: "Medium Heat Pump",
				modelQualifier: "HPMEDIUM",
				technologyType: "air source heat pumps",
			},
			{
				id: "1002",
				brandName: "Test",
				modelName: "Large Heat Pump",
				modelQualifier: "HPLARGE",
				technologyType: "air source heat pumps",
			},
		],
	};
	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(MOCKED_HEAT_PUMPS),
		});
	});

	const heatPump1: Partial<HeatPumpData> = {
		id: "463c94f6-566c-49b2-af27-222222222",
		name: "Heat pump small",
		typeOfHeatPump: "airSource",
	};

	const heatPump2: Partial<HeatPumpData> = {
		id: "463c94f6-566c-49b2-af27-111111111",
		name: "Heat pump large",
		typeOfHeatPump: "airSource",
	};

	beforeEach(async () => {
		store.$patch({
			spaceHeating: {
				heatGeneration: {
					heatPump: {
						data: [{ data: heatPump2 }, { data: heatPump1 }],
					},
				},
			},
		});
	});

	afterEach(async () => {
		store.$reset();
	});

	test("title dependant on the type of heat pump", async () => {
		mockRoute.mockReturnValue({
			params: {
				pump: "0",
				products: "air-source",
			},
			path: "/0/air-source",
		});
		await renderSuspended(Products);

		expect(
			screen.getByRole("heading", { name: "Select an air source heat pump" }),
		);
	});

	test("when a user selects a product its product reference gets stored", async () => {
		mockRoute.mockReturnValue({
			params: {
				pump: "1",
				products: "air-source",
			},
			path: "/1/air-source",
		});
		await renderSuspended(Products);

		await user.click(screen.getByTestId("selectProductButton_1"));

		expect(
			store.spaceHeating.heatGeneration.heatPump.data[1]!.data
				.productReference,
		).toBe(MOCKED_HEAT_PUMPS.data[1]?.id);
	});

	test("'Back to heat pump' navigates user to the heat pump at the correct index", async () => {
		mockRoute.mockReturnValue({
			params: {
				pump: "1",
				products: "air-source",
			},
			path: "/1/air-source",
		});
		await renderSuspended(Products);
		const backButton = screen.getByTestId("backToHeatPumpButton");
		expect(backButton.getAttribute("href")).toBe(
			"/space-heating/heat-generation/heat-pump/1",
		);
	});
});
