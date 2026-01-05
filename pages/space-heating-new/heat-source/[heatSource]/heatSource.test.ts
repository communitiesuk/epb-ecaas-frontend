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

	afterEach(() => {
		store.$reset();
	});

	describe("heat pump", () => {
		const populateValidHeatPumpForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.type(screen.getByTestId("name"), "Heat pump 1");
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
		};

		const heatPump1: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: HeatSourceType.heatPump,
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
		};

		const heatPump2: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat pump 2",
			typeOfHeatSource: HeatSourceType.heatPump,
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-LARGE",
		};

		test("'HeatPumpSection' component displays when type of heat source is heat pump", async () => {
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
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/air-source");
		});

		test("heat pump data is saved to store state when form is valid", async () => {
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
				typeOfHeatSource: HeatSourceType.heatPump,
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

			expect((await screen.findByTestId("typeOfHeatSource_heatPump")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat pump 1");
			expect((await screen.findByTestId("typeOfHeatPump_airSource")).hasAttribute("checked"));
		});

		test("heat pump is updated when data with id exists in store", async () => {
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

		test("product reference is cleared when heat pump type changes", async () => {
			
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

			await user.click(screen.getByTestId("typeOfHeatPump_booster"));
			const { data } = store.spaceHeatingNew.heatSource;
			const heatSourceItem = data[0]!.data;
			if ("productReference" in heatSourceItem) {
				expect(heatSourceItem.productReference).toBeUndefined();
			}
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("saveAndComplete"));
		
			expect(await screen.findByTestId("name_error")).toBeDefined();
			expect(await screen.findByTestId("typeOfHeatPump_error")).toBeDefined();
		
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
			await user.click(screen.getByTestId("saveAndComplete"));
			
			expect(await screen.findByTestId("name_error")).toBeDefined();
			expect(await screen.findByTestId("selectHeatPump_error")).toBeDefined();
		
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
			it("creates a new heat pump with given name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.type(screen.getByTestId("name"), "New heat pump");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("New heat pump");
			});

			it("creates new heat pump with 'Heat pump' as name when type of heat pump is not selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat pump");
			});

			it("creates new heat pump with default name when type of heat pump is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Air source heat pump");
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

				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.type(screen.getByTestId("name"), "New heat network");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatNetwork");
				expect(actualHeatSource.data.name).toBe("New heat network");
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: heatPump1 }, { data: heatPump2 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "1" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.type(screen.getByTestId("name"), "New solar thermal system");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
				expect(actualHeatSource.data.name).toBe("New solar thermal system");
				expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
			});

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
			typeOfHeatSource: HeatSourceType.boiler,
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_SMALL",
			locationOfBoiler: AdjacentSpaceType.heatedSpace,
		};

		const boiler2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
			name: "Boiler 2",
			typeOfHeatSource: HeatSourceType.boiler,
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_MEDIUM",
			locationOfBoiler: AdjacentSpaceType.heatedSpace,
		};

		test("'BoilerSection' component displays when type of heat source is boiler", async () => {
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
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/");
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
				typeOfHeatSource: HeatSourceType.boiler,
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

			expect((await screen.findByTestId("typeOfHeatSource_boiler")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Boiler 1");
			expect((await screen.findByTestId("typeOfBoiler_combiBoiler")).hasAttribute("checked"));
			expect((await screen.findByTestId("locationOfBoiler_heatedSpace")).hasAttribute("checked"));
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

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("typeOfBoiler_error"))).toBeDefined();
			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("selectBoiler_error"))).toBeDefined();
			expect((await screen.findByTestId("locationOfBoiler_error"))).toBeDefined();
		});

		test("navigates to space heating when valid form is completed", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidBoilerForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});

		describe("partially saving data", () => {
			it("creates a new boiler with given name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				await user.type(screen.getByTestId("name"), "New boiler");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("New boiler");
			});

			it("creates new boiler with 'Boiler' as name when type of boiler is not selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Boiler");
			});

			it("creates new boiler with default name when type of boiler is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Combi boiler");
			});

			it("saves updated form data to store automatically", async () => {
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

				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.type(screen.getByTestId("name"), "New heat network");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatNetwork");
				expect(actualHeatSource.data.name).toBe("New heat network");
			});

			it("saves updated form data to correct store object automatically", async () => {
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

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.type(screen.getByTestId("name"), "New solar thermal system");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
				expect(actualHeatSource.data.name).toBe("New solar thermal system");
				expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
			});

			it("navigates to space heating on clicking Save progress", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				await user.click(screen.getByTestId("saveProgress"));

				expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
			});
		});
	});

	describe("heat network", () => {
		const populateValidHeatNetworkForm = async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["elecOnly"] },
					},
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.type(screen.getByTestId("name"), "Heat network 1");
			await user.click(screen.getByTestId("typeOfHeatNetwork_communal"));
			await user.click(screen.getByTestId("isHeatNetworkInPcdb_yes"));
			await user.click(screen.getByTestId("energySupply_electricity"));
			await user.click(screen.getByTestId("doesHeatNetworkUseHeatInterfaceUnits_no"));
		};

		const patchHeatNetworkDataToStore = async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["elecOnly"] },
					},
				},
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatNetwork1 }],
					},
				},
			});
		};

		const heatNetwork1: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat network 1",
			typeOfHeatSource: HeatSourceType.heatNetwork,
			typeOfHeatNetwork: "communal",
			isHeatNetworkInPcdb: true,
			heatNetworkProductReference: "HEATNETWORK-LARGE",
			energySupply: "electricity",
			doesHeatNetworkUseHeatInterfaceUnits: false,
		};

		const heatNetwork2: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c88",
			name: "Heat network 2",
			typeOfHeatSource: HeatSourceType.heatNetwork,
			typeOfHeatNetwork: "unsleevedDistrict",
			isHeatNetworkInPcdb: false,
			emissionsFactor: 1,
			outOfScopeEmissionsFactor: 2,
			primaryEnergyFactor: 3,
			canEnergyBeExported: true,
			doesHeatNetworkUseHeatInterfaceUnits: false,
		};

		test("'HeatNetworkSection' component displays when type of heat source is heat network", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("typeOfHeatNetwork")).toBeDefined();
			expect(screen.queryByTestId("isHeatNetworkInPcdb")).toBeDefined();
		});

		test("select heat network section only displays when 'Yes' is selected for 'Is the heat network in the PCDB?'", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			expect(screen.queryByTestId("selectHeatNetwork")).toBeNull();


			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("isHeatNetworkInPcdb_yes"));
			expect(screen.queryByTestId("selectHeatNetwork")).not.toBeNull();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("typeOfHeatNetwork_communal"));
			await user.click(screen.getByTestId("isHeatNetworkInPcdb_yes"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/communal-heat-network");
		});

		test("heat network data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatNetwork1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatNetworkForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
				name: "Heat network 1",
				typeOfHeatSource: HeatSourceType.heatNetwork,
				typeOfHeatNetwork: "communal",
				isHeatNetworkInPcdb: true,
				energySupply: "electricity",
				doesHeatNetworkUseHeatInterfaceUnits: false,
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			patchHeatNetworkDataToStore();

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatSource_heatNetwork")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat network 1");
			expect((await screen.findByTestId("typeOfHeatNetwork_communal")).hasAttribute("checked"));
			expect((await screen.findByTestId("isHeatNetworkInPcdb_yes")).hasAttribute("checked"));
			expect((await screen.findByTestId("energySupply_electricity")).hasAttribute("checked"));
			expect((await screen.findByTestId("doesHeatNetworkUseHeatInterfaceUnits_no")).hasAttribute("checked"));
		});

		test("heat network is updated when data with id exists in store", async () => {
			patchHeatNetworkDataToStore();

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat network");
			await user.tab();
			await user.click(screen.getByTestId("typeOfHeatNetwork_unsleevedDistrict"));

			const { data } = store.spaceHeatingNew.heatSource;

			expect(data[0]!.data.name).toBe("Updated heat network");
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("typeOfHeatNetwork_error"))).toBeDefined();
			expect((await screen.findByTestId("isHeatNetworkInPcdb_error"))).toBeDefined();
		});

		test("navigates to space heating when valid form is completed", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatNetworkForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});

		describe("partially saving data", () => {
			it("creates a new heat network with given name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.type(screen.getByTestId("name"), "New heat network");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("New heat network");
			});

			it("creates new heat network with 'Heat network' as name when type of heat network is not selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat network");
			});

			it("creates new heat network with default name when type of heat network is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.click(screen.getByTestId("typeOfHeatNetwork_communal"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Communal heat network");
			});

			it("saves updated form data to store automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: heatNetwork1 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "0" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.type(screen.getByTestId("name"), "New heat pump");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatPump");
				expect(actualHeatSource.data.name).toBe("New heat pump");
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: heatNetwork1 }, { data: heatNetwork2 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "1" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.type(screen.getByTestId("name"), "New solar thermal system");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
				expect(actualHeatSource.data.name).toBe("New solar thermal system");
				expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
			});

			it("navigates to space heating on clicking Save progress", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.click(screen.getByTestId("saveProgress"));

				expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
			});
		});
	});

	describe("heat battery", () => {
		const populateValidHeatBatteryForm = async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["mains_gas"] },
					},
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			await user.type(screen.getByTestId("name"), "Heat battery 1");
			await user.click(screen.getByTestId("typeOfHeatBattery_pcm"));
			await user.type(screen.getByTestId("numberOfUnits"), "1");
			await user.click(screen.getByTestId("energySupply_mains_gas"));
		};

		const heatBattery1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat battery 1",
			typeOfHeatSource: HeatSourceType.heatBattery,
			typeOfHeatBattery: "pcm",
			productReference: "HEAT_BATTERY_SMALL",
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const heatBattery2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c2222",
			name: "Heat battery 2",
			typeOfHeatSource: HeatSourceType.heatBattery,
			typeOfHeatBattery: "dryCore",
			productReference: "HEAT_BATTERY_MEDIUM",
			numberOfUnits: 2,
			energySupply: "LPG_bulk",
		};

		test("'HeatBatterySection' component displays when type of heat source is heat battery", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("typeOfHeatBattery")).toBeDefined();
			expect(screen.queryByTestId("selectHeatBattery")).toBeDefined();
			expect(screen.getByTestId("numberOfUnits")).toBeDefined();
			expect(screen.getByTestId("energySupply")).toBeDefined();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/");
		});

		test("heat battery data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatBattery1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatBatteryForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
				name: "Heat battery 1",
				typeOfHeatSource: HeatSourceType.heatBattery,
				typeOfHeatBattery: "pcm",
				numberOfUnits: 1,
				energySupply: "mains_gas",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["mains_gas"] },
					},
				},
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatBattery1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatSource_heatBattery")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat battery 1");
			expect((await screen.findByTestId("typeOfHeatBattery_pcm")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("numberOfUnits")).value).toBe("1");
			expect((await screen.findByTestId("energySupply_mains_gas")).hasAttribute("checked"));
		});

		test("heat battery is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatBattery1 }, { data: heatBattery2 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated heat battery");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeatingNew.heatSource;

			expect(data[1]!.data.id).toBe(heatBattery2.id);
			expect(data[1]!.data.name).toBe("Updated heat battery");
		});

		test("electricity is always displayed as a energy supply option", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["mains_gas", "LPG_bulk"] },
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			expect(screen.getByTestId("energySupply_mains_gas")).toBeDefined();
			expect(screen.getByTestId("energySupply_lpg_bulk")).toBeDefined();
			expect(screen.getByTestId("energySupply_electricity")).toBeDefined();
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("typeOfHeatBattery_error"))).toBeDefined();
			expect((await screen.findByTestId("selectHeatBattery_error"))).toBeDefined();
			expect((await screen.findByTestId("numberOfUnits_error"))).toBeDefined();
			expect((await screen.findByTestId("energySupply_error"))).toBeDefined();
		});

		test("navigates to space heating when valid form is completed", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatBatteryForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});

		describe("partially saving data", () => {
			it("creates a new heat battery with given name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.type(screen.getByTestId("name"), "New heat battery");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("New heat battery");
			});

			it("creates new heat battery with 'Heat battery' as name when type of heat battery is not selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat battery");
			});

			it("creates new heat battery with default name when type of heat battery is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.click(screen.getByTestId("typeOfHeatBattery_pcm"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Pcm heat battery");
			});

			it("saves updated form data to store automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: heatBattery1 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "0" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.type(screen.getByTestId("name"), "New heat pump");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatPump");
				expect(actualHeatSource.data.name).toBe("New heat pump");
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: heatBattery1 }, { data: heatBattery2 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "1" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.type(screen.getByTestId("name"), "New solar thermal system");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
				expect(actualHeatSource.data.name).toBe("New solar thermal system");
				expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
			});

			it("navigates to space heating on clicking Save progress", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.click(screen.getByTestId("saveProgress"));

				expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
			});
		});
	});

	describe("solar thermal system", () => {
		const populateValidSolarThermalSystemForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
			await user.type(screen.getByTestId("name"), "Solar thermal system 1");
			await user.click(screen.getByTestId("locationOfCollectorLoopPiping_outside"));
			await user.type(screen.getByTestId("collectorModuleArea"), "1");
			await user.type(screen.getByTestId("numberOfCollectorModules"), "2");
			await user.type(screen.getByTestId("peakCollectorEfficiency"), "0");
			await user.type(screen.getByTestId("incidenceAngleModifier"), "1");
			await user.type(screen.getByTestId("firstOrderHeatLossCoefficient"), "1");
			await user.type(screen.getByTestId("secondOrderHeatLossCoefficient"), "10");
			await user.type(screen.getByTestId("heatLossCoefficientOfSolarLoopPipe"), "100");
			await user.type(screen.getByTestId("collectorMassFlowRate"), "2");
			await user.type(screen.getByTestId("powerOfCollectorPump"), "30");
			await user.type(screen.getByTestId("powerOfCollectorPumpController"), "30");
			await user.type(screen.getByTestId("pitch"), "60");
			await user.type(screen.getByTestId("orientation"), "60");
			await user.tab();
		};

		const solarThermalSystem1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
			name: "Solar thermal system 1",
			typeOfHeatSource: HeatSourceType.solarThermalSystem,
			locationOfCollectorLoopPiping: "outside",
			collectorModuleArea: 1,
			numberOfCollectorModules: 2,
			peakCollectorEfficiency: 0,
			incidenceAngleModifier: 1,
			firstOrderHeatLossCoefficient: 1,
			secondOrderHeatLossCoefficient: 10,
			heatLossCoefficientOfSolarLoopPipe: 100,
			collectorMassFlowRate: 2,
			powerOfCollectorPump: 30,
			powerOfCollectorPumpController: 30,
			pitch: 60,
			orientation: 60,
		};

		const solarThermalSystem2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c4444",
			name: "Solar thermal system 2",
			typeOfHeatSource: HeatSourceType.solarThermalSystem,
			locationOfCollectorLoopPiping: "heatedSpace",
			collectorModuleArea: 2,
			numberOfCollectorModules: 4,
			peakCollectorEfficiency: 1,
			incidenceAngleModifier: 30,
			firstOrderHeatLossCoefficient: 2,
			secondOrderHeatLossCoefficient: 20,
			heatLossCoefficientOfSolarLoopPipe: 200,
			collectorMassFlowRate: 10,
			powerOfCollectorPump: 100,
			powerOfCollectorPumpController: 100,
			pitch: 90,
			orientation: 90,
		};

		test("'SolarThermalSystemSection' component displays when type of heat source is solar thermal system", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("locationOfCollectorLoopPiping")).toBeDefined();
			expect(screen.queryByTestId("collectorModuleArea")).toBeDefined();
			expect(screen.getByTestId("numberOfCollectorModules")).toBeDefined();
			expect(screen.getByTestId("peakCollectorEfficiency")).toBeDefined();
			expect(screen.getByTestId("incidenceAngleModifier")).toBeDefined();
			expect(screen.getByTestId("firstOrderHeatLossCoefficient")).toBeDefined();
			expect(screen.getByTestId("secondOrderHeatLossCoefficient")).toBeDefined();
			expect(screen.getByTestId("heatLossCoefficientOfSolarLoopPipe")).toBeDefined();
			expect(screen.getByTestId("collectorMassFlowRate")).toBeDefined();
			expect(screen.getByTestId("powerOfCollectorPump")).toBeDefined();
			expect(screen.getByTestId("powerOfCollectorPumpController")).toBeDefined();
			expect(screen.getByTestId("pitch")).toBeDefined();
			expect(screen.getByTestId("orientation")).toBeDefined();
		});

		test("solar thermal system data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(solarThermalSystem1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidSolarThermalSystemForm();

			const { data } = store.spaceHeatingNew.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
				name: "Solar thermal system 1",
				typeOfHeatSource: HeatSourceType.solarThermalSystem,
				locationOfCollectorLoopPiping: "outside",
				collectorModuleArea: 1,
				numberOfCollectorModules: 2,
				peakCollectorEfficiency: 0,
				incidenceAngleModifier: 1,
				firstOrderHeatLossCoefficient: 1,
				secondOrderHeatLossCoefficient: 10,
				heatLossCoefficientOfSolarLoopPipe: 100,
				collectorMassFlowRate: 2,
				powerOfCollectorPump: 30,
				powerOfCollectorPumpController: 30,
				pitch: 60,
				orientation: 60,
			});
		});

		test("product reference is cleared when heat source type changes", async () => {
			
			const heatPump: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump 1",
				typeOfHeatSource: HeatSourceType.heatPump,
				typeOfHeatPump: "airSource",
				productReference: "HEATPUMP-SMALL",
			};

			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			
			const { data } = store.spaceHeatingNew.heatSource;
			const heatSourceItem = data[0]!.data;

			if ("productReference" in heatSourceItem) {
				expect(heatSourceItem.productReference).toBeUndefined();
			}
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: solarThermalSystem1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Solar thermal system 1");
			expect((await screen.findByTestId("locationOfCollectorLoopPiping_outside")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("collectorModuleArea")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("numberOfCollectorModules")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("peakCollectorEfficiency")).value).toBe("0");
			expect((await screen.findByTestId<HTMLInputElement>("incidenceAngleModifier")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("firstOrderHeatLossCoefficient")).value).toBe("1");
			expect((await screen.findByTestId<HTMLInputElement>("secondOrderHeatLossCoefficient")).value).toBe("10");
			expect((await screen.findByTestId<HTMLInputElement>("heatLossCoefficientOfSolarLoopPipe")).value).toBe("100");
			expect((await screen.findByTestId<HTMLInputElement>("collectorMassFlowRate")).value).toBe("2");
			expect((await screen.findByTestId<HTMLInputElement>("powerOfCollectorPump")).value).toBe("30");
			expect((await screen.findByTestId<HTMLInputElement>("powerOfCollectorPumpController")).value).toBe("30");
			expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("60");
		});

		test("solar thermal system is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: solarThermalSystem1 }, { data: solarThermalSystem2 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});

			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated solar thermal system");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeatingNew.heatSource;

			expect(data[1]!.data.id).toBe(solarThermalSystem2.id);
			expect(data[1]!.data.name).toBe("Updated solar thermal system");
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
		
			await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("name_error"))).toBeDefined();
			expect((await screen.findByTestId("locationOfCollectorLoopPiping_error")).hasAttribute("checked"));
			expect((await screen.findByTestId("collectorModuleArea_error"))).toBeDefined();
			expect((await screen.findByTestId("numberOfCollectorModules_error"))).toBeDefined();
			expect((await screen.findByTestId("peakCollectorEfficiency_error"))).toBeDefined();
			expect((await screen.findByTestId("incidenceAngleModifier_error"))).toBeDefined();
			expect((await screen.findByTestId("firstOrderHeatLossCoefficient_error"))).toBeDefined();
			expect((await screen.findByTestId("secondOrderHeatLossCoefficient_error"))).toBeDefined();
			expect((await screen.findByTestId("heatLossCoefficientOfSolarLoopPipe_error"))).toBeDefined();
			expect((await screen.findByTestId("collectorMassFlowRate_error"))).toBeDefined();
			expect((await screen.findByTestId("powerOfCollectorPump_error"))).toBeDefined();
			expect((await screen.findByTestId("powerOfCollectorPumpController_error"))).toBeDefined();
			expect((await screen.findByTestId("pitch_error"))).toBeDefined();
			expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		});

		test("navigates to space heating when valid form is completed", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidSolarThermalSystemForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});

		describe("partially saving data", () => {
			it("creates a new solar thermal system with given name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.type(screen.getByTestId("name"), "New solar thermal system");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("New solar thermal system");
			});

			it("creates new solar thermal system with 'Solar thermal system' as name when name is not given", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Solar thermal system");
			});

			it("saves updated form data to store automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: solarThermalSystem1 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "0" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.type(screen.getByTestId("name"), "New heat pump");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[0]!;
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatPump");
				expect(actualHeatSource.data.name).toBe("New heat pump");
			});

			it("saves updated form data to correct store object automatically", async () => {
				store.$patch({
					spaceHeatingNew: {
						heatSource: {
							data: [{ data: solarThermalSystem1 }, { data: solarThermalSystem2 }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "1" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.type(screen.getByTestId("name"), "New heat pump");
				await user.tab();

				const actualHeatSource = store.spaceHeatingNew.heatSource.data[1]!;
				expect(actualHeatSource.data.name).toBe("New heat pump");
				expect(actualHeatSource.data.typeOfHeatSource).toBe("heatPump");
			});

			it("navigates to space heating on clicking Save progress", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.click(screen.getByTestId("saveProgress"));

				expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
			});
		});
	});

	test("product reference is cleared when heat source type changes", async () => {
			
		const heatPump: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: HeatSourceType.heatPump,
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
		};

		store.$patch({
			spaceHeatingNew: {
				heatSource: {
					data: [{ data: heatPump }],
				},
			},
		});
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
		const { data } = store.spaceHeatingNew.heatSource;
		const heatSourceItem = data[0]!.data;
		if ("productReference" in heatSourceItem) {
			expect(heatSourceItem.productReference).toBeUndefined();
		}
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
});
