import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import HeatSourceForm from "./index.vue";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

describe("heatSource", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatSource1: HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		name: "Heat source 1",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
		productReference: "HEATPUMP-SMALL",
	};

	const heatSource2: HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
		name: "Heat source 2",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
		productReference: "HEATPUMP-LARGE",
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidHeatPumpForm = async () => {
		await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		await user.type(screen.getByTestId("name"), "Heat source 1");
		await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
	};

	describe("heat pump", () => {
		test("HeatPump component displays when type of heat source is heat pump", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("typeOfHeatPump")).toBeDefined();
			expect(screen.queryByTestId("selectHeatPump")).toBeNull();
		});

		test("select heat pump section only displays when type of heat pump has been selected", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			expect(screen.queryByTestId("selectHeatPump")).toBeNull();


			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
			expect(screen.queryByTestId("selectHeatPump")).not.toBeNull();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/products");
		});

		test("heat source data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatSource1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatPumpForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat source 1",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat source 1");
		});

		test("heat source is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource2 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat pump");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeatingNew.heatSource;

			expect(data[0]!.data.id).toBe(heatSource2.id);
			expect(data[0]!.data.name).toBe("Updated heat pump");
		});

	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("typeOfHeatSource_error")).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("heatSourceErrorSummary")).toBeDefined();
	});

	it("navigates to space heating when valid form is completed", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});

		await populateValidHeatPumpForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
	});

	describe("partially saving data", () => {
		it("creates a new heat source automatically with given name", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.type(screen.getByTestId("name"), "New heat source");
			await user.tab();

			const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
			expect(actualHeatSource.data.name).toBe("New heat source");
		});

		it("creates a new heat source automatically with default name after other data is entered", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.tab();

			const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
			expect(actualHeatSource.data.name).toBe("Heat source");
			expect(actualHeatSource.data.typeOfHeatSource).toBe("boiler");
		});

		it("saves updated form data to store automatically", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource2 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat source");
			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.tab();

			const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
			// expect(actualHeatSource.data.name).toBe("Updated heat source"); TO-DO
			expect(actualHeatSource.data.typeOfHeatSource).toBe("heatNetwork");
		});

		// TO-DO
		// it("saves updated form data to correct store object automatically", async () => {
		// 	store.$patch({
		// 		spaceHeatingNew: {
		// 			heatSource: {
		// 				data: [{ data: heatSource1 }, { data: heatSource2 }],
		// 			},
		// 		},
		// 	});

		// 	await renderSuspended(HeatSourceForm, {
		// 		route: {
		// 			params: { "heatSource": "1" },
		// 		},
		// 	});

		// 	await user.clear(screen.getByTestId("name"));
		// 	await user.type(screen.getByTestId("name"), "Updated heat source");
		// 	await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
		// 	await user.tab();

		// 	const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
		// 	expect(actualHeatSource.data.name).toBe("Updated heat source");
		// 	expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
		// });

		it("navigates to space heating on clicking Save progress", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("saveProgress"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});
	});
});
