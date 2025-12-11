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

	const heatPump1: HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		name: "Heat pump 1",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
		productReference: "HEATPUMP-SMALL",
	};

	const heatPump2: HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
		name: "Heat pump 2",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "airSource",
		productReference: "HEATPUMP-LARGE",
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidHeatPumpForm = async () => {
		await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		await user.type(screen.getByTestId("name"), "Heat pump 1");
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
			vi.mocked(uuidv4).mockReturnValue(heatPump1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatPumpForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump 1",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat pump 1");
		});

		test("heat source is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump2 }],
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

			expect(data[0]!.data.id).toBe(heatPump2.id);
			expect(data[0]!.data.name).toBe("Updated heat pump");
		});
	});

	describe("boiler", () => {

		const populateValidBoilerForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.type(screen.getByTestId("name"), "Boiler 1");
			await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
			await user.click(screen.getByTestId("locationOfBoiler_heatedSpace"));

		};
		const boiler1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
			name: "Boiler 1",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_SMALL",
			locationOfBoiler: AdjacentSpaceType.heatedSpace,
		};

		const boiler2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
			name: "Boiler 2",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_MEDIUM",
			locationOfBoiler: AdjacentSpaceType.heatedSpace,
		};

		test("boiler component displays when type of heat source is boiler", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("typeOfBoiler")).toBeDefined();
			expect(screen.queryByTestId("selectBoiler")).toBeDefined();
			expect(screen.getByTestId("locationOfBoiler")).toBeDefined();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/products");
		});

		test("boiler data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(boiler1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidBoilerForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				name: "Boiler 1",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				locationOfBoiler: AdjacentSpaceType.heatedSpace,
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: boiler1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Boiler 1");
		});

		test("boiler is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: boiler1 }, { data: boiler2 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated boiler");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeatingNew.heatSource;

			expect(data[1]!.data.id).toBe(boiler2.id);
			expect(data[1]!.data.name).toBe("Updated boiler");
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
						data: [{ data: heatPump2 }],
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
		// 				data: [{ data: heatPump1 }, { data: heatPump2 }],
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
