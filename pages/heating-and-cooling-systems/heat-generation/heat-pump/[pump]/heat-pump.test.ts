import {
	mockNuxtImport,
	renderSuspended,
	registerEndpoint,
} from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import HeatPump from "./index.vue";
import AirSourceProducts from "./[products].vue";
import { v4 as uuidv4 } from "uuid";
import { productsInCategory } from "~/server/services/products";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

registerEndpoint("/api/products", async () => productsInCategory("heatPump"));

describe("heatPump", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const largeHeatPump: HeatPumpData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
		name: "Heat pump 1",
		productReference: "HEATPUMP-LARGE",
		typeOfHeatPump: "airSource",
	};

	const smallHeatPump: HeatPumpData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		name: "Heat pump 2",
		productReference: "HEATPUMP-SMALL",
		typeOfHeatPump: "airSource",
	};

	afterEach(() => {
		store.$reset();
	});

	const selectProduct = async () => {
		await renderSuspended(AirSourceProducts);
		await user.click(screen.getByTestId("productReference_HEATPUMP-LARGE"));
		await user.click(screen.getByTestId("saveAndComplete"));
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Heat pump 1");
		await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
	};

	test("select heat pump section only displays when type of heat pump has been selected", async () => {
		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "create" },
			},
		});
		let selectHeatPump = screen.queryByTestId("selectHeatPump");
		expect(selectHeatPump).toBeNull();
    
		await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
		selectHeatPump = screen.queryByTestId("selectHeatPump");

		expect(selectHeatPump).not.toBeNull();
	});

	test("heat pump data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(largeHeatPump.id as unknown as Buffer);

		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "create" },
			},
		});

		await populateValidForm();
		await selectProduct();

		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "0" },
			},
		});

		const { data } = store.heatingAndCoolingSystems.heatGeneration.heatPump;
		expect(data[0]?.data).toEqual(largeHeatPump);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			heatingAndCoolingSystems: {
				heatGeneration: {
					heatPump: {
						data: [
							{
								data: largeHeatPump,
							},
						],
					},
				},
			},
		});

		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(
			"Heat pump 1",
		);
	});

	test("heat pump is updated when data with id exists in store", async () => {
		store.$patch({
			heatingAndCoolingSystems: {
				heatGeneration: {
					heatPump: {
						data: [
							{
								data: largeHeatPump,
							},
						],
					},
				},
			},
		});

		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Heat pump 2");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.heatingAndCoolingSystems.heatGeneration.heatPump;

		expect(data[0]!.data.id).toBe(largeHeatPump.id);
		expect(data[0]!.data.name).toBe("Heat pump 2");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HeatPump);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("typeOfHeatPump_error")).toBeDefined();
    
		await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("selectHeatPump_error")).toBeDefined();

	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatPump);
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("heatPumpErrorSummary")).toBeDefined();
	});

	it("the 'Select a product' element navigates user to a page listing all products of the selected heat pump type", async () => {
		await renderSuspended(HeatPump, {
			route: {
				params: { pump: "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
		const chooseAProductButton = screen.getByTestId("chooseAProductButton");
		expect(chooseAProductButton.getAttribute("href")).toBe(
			"/0/air-source-products",
		);
	});

	it("navigates to heat generation page when valid form is completed", async () => {
		await renderSuspended(HeatPump);

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith(
			"/heating-and-cooling-systems/heat-generation",
		);
	});

	describe("partially saving data", () => {
		it("creates a new heat pump automatically with given name", async () => {
			await renderSuspended(HeatPump, {
				route: {
					params: { pump: "create" },
				},
			});

			await user.type(screen.getByTestId("name"), "New heat pump");
			await user.tab();

			const actualHeatPump =
        store.heatingAndCoolingSystems.heatGeneration.heatPump.data[0]!;
			expect(actualHeatPump.data.name).toBe("New heat pump");
			expect(actualHeatPump.data.productReference).toBeUndefined();
		});

		it("creates a new heat pump automatically with default name after other data is entered", async () => {
			await renderSuspended(HeatPump, {
				route: {
					params: { pump: "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
			await user.tab();

			const actualHeatPump =
        store.heatingAndCoolingSystems.heatGeneration.heatPump.data[0]!;
			expect(actualHeatPump.data.name).toBe("Heat pump");
			expect(actualHeatPump.data.typeOfHeatPump).toBe("airSource");
		});

		it("saves updated form data to store automatically", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					heatGeneration: {
						heatPump: {
							data: [
								{
									data: largeHeatPump,
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatPump, {
				route: {
					params: { pump: "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat pump");
			await user.click(screen.getByTestId("typeOfHeatPump_booster"));
			await user.tab();

			const actualHeatPump =
        store.heatingAndCoolingSystems.heatGeneration.heatPump.data[0]!;
			expect(actualHeatPump.data.name).toBe("Updated heat pump");
			expect(actualHeatPump.data.typeOfHeatPump).toBe("booster");
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				heatingAndCoolingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{ data: smallHeatPump }, { data: largeHeatPump }],
						},
					},
				},
			});

			await renderSuspended(HeatPump, {
				route: {
					params: { pump: "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat pump");
			await user.click(screen.getByTestId("typeOfHeatPump_booster"));
			await user.tab();

			const actualHeatPump =
        store.heatingAndCoolingSystems.heatGeneration.heatPump.data[1]!;
			expect(actualHeatPump.data.name).toBe("Updated heat pump");
			expect(actualHeatPump.data.typeOfHeatPump).toBe("booster");
		});

		it("navigates to heat generation page on clicking Save progress", async () => {
			await renderSuspended(HeatPump);

			await user.type(screen.getByTestId("name"), "Heat pump");
			await user.click(screen.getByTestId("saveProgress"));

			expect(navigateToMock).toHaveBeenCalledWith(
				"/heating-and-cooling-systems/heat-generation",
			);
		});
	});
});
