import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import HeatSourceForm from "./index.vue";
import { v4 as uuidv4 } from "uuid";
import type { BoilerProduct, DisplayProduct, HybridHeatPumpProduct } from "~/pcdb/pcdb.types";
import { kilowatt } from "~/utils/units/power";

vi.mock("uuid");

describe("heatSource", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const { mockFetch, navigateToMock } = vi.hoisted(() => ({
		navigateToMock: vi.fn(),
		mockFetch: vi.fn(),
	}));

	mockNuxtImport("navigateTo", () => navigateToMock);
	mockNuxtImport("useFetch", () => mockFetch);

	afterEach(() => {
		store.$reset();
		mockFetch.mockReset();
	});

	const boiler1: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
		name: "Boiler 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_SMALL",
		needsSpecifiedLocation: false,
	};
	const boosterHeatPump:HeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c68b52222",
		name: "Booster HP",
		typeOfHeatSource: "heatPump",
		typeOfHeatPump: "booster",
		productReference: "HEATPUMP-SMALL",
	};

	describe("heat pump", () => {
		const heatPumpProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			technologyType: "AirSourceHeatPump",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(heatPumpProduct),
			});
		});

		const populateValidHeatPumpForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		};

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

		test("'HeatPumpSection' component displays when type of heat source is heat pump", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.queryByTestId("selectHeatPump")).toBeDefined();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));

			expect((await screen.findByTestId("chooseAProductButton")).getAttribute("href")).toBe("/0/heat-pump"); //subject to change
		});

		test("heat pump data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatPump1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatPumpForm();

			const { data } = store.spaceHeating.heatSource;
			expect(data[0]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump",
				typeOfHeatSource: "heatPump",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeating: {
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
		});

		test("heat pump is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeating: {
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

			const { data } = store.spaceHeating.heatSource;

			expect(data[0]!.data.id).toBe(heatPump2.id);
			expect(data[0]!.data.name).toBe("Updated heat pump");
		});

		test("required error messages are displayed when empty form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("selectHeatPump_error")).toBeDefined();
		});

		describe("heat pump default name", () => {
			it("creates a new heat pump with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat pump");
			});

			//Can change this to add heat pump type to name when a heat pump product is selected
			it.skip("adds heat pump type to name when heat pump type is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.click(screen.getByTestId("typeOfHeatPump_airSource")); 

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Air source heat pump");
			});
		});
	});

	describe("boiler", () => {
		const boilerProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			technologyType: "CombiBoiler",
			boilerLocation: "unknown",
		}; 

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(boilerProduct),
			});
		});

		const populateValidBoilerForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
		};

		const boiler2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
			name: "Boiler 2",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_MEDIUM",
			needsSpecifiedLocation: true,
			specifiedLocation: "external",
		};

		test("'BoilerSection' component displays when type of heat source is boiler", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("typeOfBoiler")).toBeDefined();
			expect(screen.queryByTestId("selectBoiler")).toBeDefined();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
			await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/combi-boiler");
		});

		test("boiler data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(boiler1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidBoilerForm();

			const { data } = store.spaceHeating.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				name: "Combi boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeating: {
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
		});

		test("boiler is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeating: {
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

			const { data } = store.spaceHeating.heatSource;

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
			await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));

			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("selectBoiler_error"))).toBeDefined();
		});

		test("disables input fields when boiler is packaged with a heat pump", async () => {
			const backupBoiler: HeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
				name: "Backup boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				productReference: "BOILER_MEDIUM",
				needsSpecifiedLocation: true,
				packagedProductReference: "1000",
			};

			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: backupBoiler },
						],
					},
				},
			});

			const hybridHeatPumpProduct: Partial<HybridHeatPumpProduct> = {
				id: "1000",
				brandName: "Test",
				modelName: "Hybrid Heat Pump",
				technologyType: "HybridHeatPump",
				boilerProductID: "2000",
			};
	
			const backupBoilerProduct: Partial<BoilerProduct> = {
				id: "2000",
				brandName: "Test",
				modelName: "Hybrid Heat Pump",
				technologyType: "CombiBoiler",
			};
	
			mockFetch.mockReturnValueOnce({
				data: ref(hybridHeatPumpProduct),
			}).mockReturnValueOnce({
				data: ref(backupBoilerProduct),
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			Object.keys(heatSourceTypesWithDisplay).forEach(type => {
				expect(screen.getByTestId<HTMLInputElement>(`typeOfHeatSource_${type}`).disabled).toBe(true);
			});

			Object.keys(boilerTypes).forEach(type => {
				expect(screen.getByTestId<HTMLInputElement>(`typeOfBoiler_${type}`).disabled).toBe(true);
			});

			expect(screen.queryByTestId("selectAProductButton")).toBeNull();

			["internal", "external"].forEach(location => {
				expect(screen.getByTestId<HTMLInputElement>(`specifiedLocation_${location}`).disabled).toBe(true);
			});
		});

		describe("boiler default name", () => {
			it("creates a new boiler with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Boiler");
			});

			it("adds boiler type to name when boiler type is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
				await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
				await user.tab();

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Combi boiler");
			});
		});
	});

	describe("heat network", () => {
		const heatNetworkProduct: Partial<DisplayProduct> = {
			id: "1000",
			technologyType: "HeatNetworks",
			communityHeatNetworkName: "Heat network",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(heatNetworkProduct),
			});
		});

		const heatNetwork1: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat network 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
			productReference: "HEATNETWORK-LARGE",
			energySupply: "electricity",
			usesHeatInterfaceUnits: false,
			isFifthGeneration: true,
			boosterHeatPumpId: boosterHeatPump.id,
		};
		const heatNetwork2: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat network 2",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
			productReference: "HEATNETWORK-LARGE",
			energySupply: "electricity",
			usesHeatInterfaceUnits: false,
			isFifthGeneration: false,
		};

		const patchHeatNetworkDataToStore = async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["electricity"] },
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{ data: boosterHeatPump }, { data: heatNetwork1 }, { data: heatNetwork2 } ],
					},
				},
			});
		};

		test("'HeatNetworkSection' component displays when type of heat source is heat network", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));

			expect(screen.getByTestId("typeOfHeatNetwork")).toBeDefined();
		});

		test("select heat network section only displays when 'Yes' is selected for 'Is the heat network in the PCDB?'", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			expect(screen.queryByTestId("selectHeatNetwork")).toBeNull();

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
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
			await user.click(screen.getByTestId("typeOfHeatNetwork_communalHeatNetwork"));
			await user.click(screen.getByTestId("isHeatNetworkInPcdb_yes"));
			expect(screen.getByTestId("chooseAProductButton").getAttribute("href")).toBe("/0/heat-network");
		});

		test("the 'Booster heat pump' element renders when isFifthGeneration is true", async () => {
			patchHeatNetworkDataToStore();
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});
			expect(screen.getByTestId("boosterHeatPumpId")).not.toBeNull();

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "2" },
				},
			});
			expect(screen.queryByTestId("boosterHeatPumpId")).toBeNull();

		});

		test("the 'Booster heat pump' element navigates user to the space heating overview page when there are stored boosters", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["electricity"] },
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{ data: {
							typeOfHeatSource: "heatNetwork",
							typeOfHeatNetwork: "communalHeatNetwork",
							isHeatNetworkInPcdb: true, 
							isFifthGeneration: true } } ],
					},
				},
			});
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect(screen.getByRole("link", { name: "Click here to add a booster heat pump" }).getAttribute("href")).toBe("/space-heating");
		});

		test("a 5th generation heat network can be tagged with a booster heat pumps from DWH & space heating", async () => {

			const booster: DomesticHotWaterHeatSourceData = {
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "booster",
				name: "DHW Booster HP",
				id: "dhwBoosterID-123",
				coldWaterSource: "headerTank",
				productReference: "1",
			};

			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: boosterHeatPump }, { data: heatNetwork1 }],
					},
				},
				domesticHotWater: {
					heatSources: {
						data: [{ data: booster } ],
					},
				},
			});
		
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});

			expect(screen.getByTestId(`boosterHeatPumpId_${booster.id}`)).toBeDefined();
			expect(screen.getByTestId(`boosterHeatPumpId_${boosterHeatPump.id}`)).toBeDefined();
		});

		test("heat network data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatNetwork1.id as unknown as Buffer);

			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["electricity"] },
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{ data: boosterHeatPump }],
					},
				},
			});
	

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("typeOfHeatNetwork_communalHeatNetwork"));
			await user.click(screen.getByTestId("isHeatNetworkInPcdb_yes"));
			await user.click(screen.getByTestId("energySupply_electricity"));
			await user.click(screen.getByTestId("usesHeatInterfaceUnits_no"));
			await user.click(screen.getByTestId("saveAndComplete"));

			const { data } = store.spaceHeating.heatSource;
			expect(data[1]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
				name: "Communal heat network",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				isHeatNetworkInPcdb: true,
				energySupply: "electricity",
				usesHeatInterfaceUnits: false,
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			patchHeatNetworkDataToStore();

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatSource_heatNetwork")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat network 1");
			expect((await screen.findByTestId("typeOfHeatNetwork_communalHeatNetwork")).hasAttribute("checked"));
			expect((await screen.findByTestId("isHeatNetworkInPcdb_yes")).hasAttribute("checked"));
			expect((await screen.findByTestId("energySupply_electricity")).hasAttribute("checked"));
			expect((await screen.findByTestId(`boosterHeatPumpId_${boosterHeatPump.id}`)).hasAttribute("checked"));
			expect((await screen.findByTestId("usesHeatInterfaceUnits_no")).hasAttribute("checked"));
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

			const { data } = store.spaceHeating.heatSource;

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

			expect((await screen.findByTestId("typeOfHeatNetwork_error"))).toBeDefined();
		});

		test("required error messages are displayed when type of heat network is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
			await user.click(screen.getByTestId("typeOfHeatNetwork_sleevedDistrictHeatNetwork"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("isHeatNetworkInPcdb_error"))).toBeDefined();
		});

		test("heat network product data is displayed when heat network product is selected", async () => {
			patchHeatNetworkDataToStore();

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect(screen.getByTestId("pcdbHeatNetworkProductData")).toBeDefined();
		});

		describe("heat network default name", () => {
			it("creates a new heat network with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat network");
			});

			it("adds heat network type to name when type of heat network is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatNetwork"));
				await user.click(screen.getByTestId("typeOfHeatNetwork_unsleevedDistrictHeatNetwork"));

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Unsleeved district heat network");
			});
		});
	});

	describe("heat battery", () => {
		const heatBatteryProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			modelName: "Model",
			technologyType: "HeatBatteryPCM",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(heatBatteryProduct),
			});
		});

		const populateValidHeatBatteryForm = async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["mains_gas"] },
					},
				},
			});
			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));
			await user.type(screen.getByTestId("numberOfUnits"), "1");
			await user.click(screen.getByTestId("energySupply_mains_gas"));
		};

		const heatBattery1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat battery 1",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			productReference: "HEAT_BATTERY_SMALL",
			maxFlowTemp: 32,
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const heatBattery2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c2222",
			name: "Heat battery 2",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryDryCore",
			productReference: "HEAT_BATTERY_MEDIUM",
			maxFlowTemp: 32,
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
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));

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
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));

			expect((await screen.findByTestId("chooseAProductButton")).getAttribute("href")).toBe("/0/heat-battery-pcm");
		});

		test("heat battery data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(heatBattery1.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatBatteryForm();

			const { data } = store.spaceHeating.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
				name: "PCM heat battery",
				typeOfHeatSource: "heatBattery",
				typeOfHeatBattery: "heatBatteryPcm",
				productReference: "",
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
				spaceHeating: {
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
			expect((await screen.findByTestId("typeOfHeatBattery_heatBatteryPcm")).hasAttribute("checked"));
			expect((await screen.findByTestId<HTMLInputElement>("numberOfUnits")).value).toBe("1");
			expect((await screen.findByTestId("energySupply_mains_gas")).hasAttribute("checked"));
		});

		test("heat battery is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeating: {
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

			const { data } = store.spaceHeating.heatSource;

			expect(data[1]!.data.id).toBe(heatBattery2.id);
			expect(data[1]!.data.name).toBe("Updated heat battery");
		});

		test("electricity is always displayed as a energy supply option", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));
			
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

			expect((await screen.findByTestId("typeOfHeatBattery_error"))).toBeDefined();
		});

		test("required error messages are displayed when type of heat battery is submitted", async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: { fuelType: ["LPG_bottled", "LPG_bulk", "electricity"] },
					},
				},
			});
			
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect((await screen.findByTestId("selectHeatBattery_error"))).toBeDefined();
			expect((await screen.findByTestId("numberOfUnits_error"))).toBeDefined();
			expect((await screen.findByTestId("energySupply_error"))).toBeDefined();
		});


		describe("heat battery default name", () => {
			it("creates a new heat battery with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.tab();

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Heat battery");
			});

			it("adds heat battery type to name when type has been selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_heatBattery"));
				await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryPcm"));
				await user.tab();

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("PCM heat battery");
			});
		});
	});

	describe("solar thermal system", () => {
		const populateValidSolarThermalSystemForm = async () => {
			await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
			await user.click(screen.getByTestId("locationOfCollectorLoopPiping_outside"));
			await user.type(screen.getByTestId("collectorModuleArea"), "1");
			await user.type(screen.getByTestId("numberOfCollectorModules"), "2");
			await user.type(screen.getByTestId("peakCollectorEfficiency"), "0");
			await user.type(screen.getByTestId("incidenceAngleModifier"), "1");
			await user.type(screen.getByTestId("firstOrderHeatLossCoefficient"), "1");
			await user.type(screen.getByTestId("secondOrderHeatLossCoefficient"), "10");
			await user.type(screen.getByTestId("heatLossCoefficientOfSolarLoopPipe"), "100");
			await user.type(screen.getByTestId("collectorMassFlowRate"), "2");
			await user.type(screen.getByTestId("powerOfCollectorPump"), "0.3");
			await user.type(screen.getByTestId("powerOfCollectorPumpController"), "0.3");
			await user.type(screen.getByTestId("pitch"), "60");
			await user.type(screen.getByTestId("orientation"), "60");
			await user.tab();
		};

		const solarThermalSystem1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
			name: "Solar thermal system 1",
			typeOfHeatSource: "solarThermalSystem",
			locationOfCollectorLoopPiping: "outside",
			collectorModuleArea: 1,
			numberOfCollectorModules: 2,
			peakCollectorEfficiency: 0,
			incidenceAngleModifier: 1,
			firstOrderHeatLossCoefficient: 1,
			secondOrderHeatLossCoefficient: 10,
			heatLossCoefficientOfSolarLoopPipe: 100,
			collectorMassFlowRate: 2,
			powerOfCollectorPump: unitValue(0.3, kilowatt),
			powerOfCollectorPumpController: unitValue(0.3, kilowatt),
			pitch: 60,
			orientation: 60,
		};

		const solarThermalSystem2: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c4444",
			name: "Solar thermal system 2",
			typeOfHeatSource: "solarThermalSystem",
			locationOfCollectorLoopPiping: "heatedSpace",
			collectorModuleArea: 2,
			numberOfCollectorModules: 4,
			peakCollectorEfficiency: 1,
			incidenceAngleModifier: 30,
			firstOrderHeatLossCoefficient: 2,
			secondOrderHeatLossCoefficient: 20,
			heatLossCoefficientOfSolarLoopPipe: 200,
			collectorMassFlowRate: 10,
			powerOfCollectorPump: unitValue(0.1, kilowatt),
			powerOfCollectorPumpController: unitValue(0.1, kilowatt),
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

			const { data } = store.spaceHeating.heatSource;
			expect(data[0]?.data).toEqual({
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
				name: "Solar thermal system",
				typeOfHeatSource: "solarThermalSystem",
				locationOfCollectorLoopPiping: "outside",
				collectorModuleArea: 1,
				numberOfCollectorModules: 2,
				peakCollectorEfficiency: 0,
				incidenceAngleModifier: 1,
				firstOrderHeatLossCoefficient: 1,
				secondOrderHeatLossCoefficient: 10,
				heatLossCoefficientOfSolarLoopPipe: 100,
				collectorMassFlowRate: 2,
				"powerOfCollectorPump": {
					"amount": 0.3,
					"unit": "kilowatt",
				},
				"powerOfCollectorPumpController": {
					"amount": 0.3,
					"unit": "kilowatt",
				},
				pitch: 60,
				orientation: 60,
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				spaceHeating: {
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
			expect((await screen.findByTestId<HTMLInputElement>("powerOfCollectorPump")).value).toBe("0.3");
			expect((await screen.findByTestId<HTMLInputElement>("powerOfCollectorPumpController")).value).toBe("0.3");
			expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("60");
			expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("60");
		});

		test("solar thermal system is updated when data with id exists in store", async () => {
			store.$patch({
				spaceHeating: {
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

			const { data } = store.spaceHeating.heatSource;

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

		describe("solar thermal system default name", () => {

			it("creates new solar thermal system with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});
				await user.click(screen.getByTestId("typeOfHeatSource_solarThermalSystem"));
				await user.tab();

				const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
				expect(actualHeatSource.data.name).toBe("Solar thermal system");
			});
		});
	});

	describe("when heat source type is updated", () => {
		const heatPumpProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			technologyType: "AirSourceHeatPump",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(heatPumpProduct),
			});
		});

		test("stored item data is cleared except id, name and type of heat source", async () => {

			const heatPump: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump 1",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
				productReference: "HEATPUMP-SMALL",
			};

			store.$patch({
				spaceHeating: {
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

			const { data } = store.spaceHeating.heatSource;
			const heatSourceItem = data[0]!.data;
			expect(heatSourceItem).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Boiler",
				typeOfHeatSource: "boiler",
			});
		});
	});

	describe("pcdb product", () => {
		beforeEach(async () => {
			const heatBatteryProduct: Partial<DisplayProduct> = {
				id: "1000",
				brandName: "Brand",
				technologyType: "HeatBatteryPCM",
			};

			mockFetch.mockReturnValue({
				data: ref(heatBatteryProduct),
			});

			const heatBattery: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat battery 1",
				typeOfHeatSource: "heatBattery",
				typeOfHeatBattery: "heatBatteryPcm",
				productReference: "HEATBATTERY-SMALL",
				maxFlowTemp: 32,
				numberOfUnits: 1,
			};

			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatBattery }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});
		});

		test("product reference is cleared when heat source subtype changes", async () => {
			await user.click(screen.getByTestId("typeOfHeatBattery_heatBatteryDryCore"));

			const { data } = store.spaceHeating.heatSource;
			const heatSourceItem = data[0]!.data;

			if ("productReference" in heatSourceItem) {
				expect(heatSourceItem.productReference).toBe("");
			}
		});

		test("product data is displayed when a PCDB product is selected which is not a heat network", async () => {
			expect(screen.getByTestId("pcdbProductData")).toBeDefined();
		});
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

	test("error summary is removed from display when type of heat source is updated", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(screen.queryByTestId("heatSourceErrorSummary")).not.toBeNull();

		await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
		expect(screen.queryByTestId("heatSourceErrorSummary")).toBeNull();
	});

	it("navigates to space heating on clicking Save progress", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));

		expect(screen.getByTestId("saveProgress").getAttribute("href")).toBe("/space-heating");
	});

	it("navigates to space heating when valid form is completed", async () => {
		const heatPumpProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			technologyType: "AirSourceHeatPump",
		};

		mockFetch.mockReturnValue({
			data: ref(heatPumpProduct),
		});

		const heatPump: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
		};

		store.$patch({
			spaceHeating: {
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

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
	});

	describe("partially saving data", () => {
		const heatPumpProduct: Partial<DisplayProduct> = {
			id: "1000",
			brandName: "Brand",
			technologyType: "AirSourceHeatPump",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(heatPumpProduct),
			});
		});

		const heatNetwork1: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat network 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
			productReference: "HEATNETWORK-LARGE",
			energySupply: "electricity",
			usesHeatInterfaceUnits: false,
			isFifthGeneration: true,
			boosterHeatPumpId: boosterHeatPump.id,
		};

		const heatNetwork2: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c88",
			name: "Heat network 2",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "unsleevedDistrictHeatNetwork",
			isHeatNetworkInPcdb: false,
			emissionsFactor: 1,
			outOfScopeEmissionsFactor: 2,
			primaryEnergyFactor: 3,
			canEnergyBeExported: true,
			usesHeatInterfaceUnits: false,
			hasBoosterHeatPump: false,
		};

		it("saves updated form data to store automatically", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatNetwork1 }, { data: boosterHeatPump }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));

			const actualHeatSource = store.spaceHeating.heatSource.data[0]!;
			expect(actualHeatSource.data.typeOfHeatSource).toBe("heatPump");
			expect(actualHeatSource.data.name).toBe("Heat pump");
		});

		it("saves updated form data to correct store object automatically", async () => {
			store.$patch({
				spaceHeating: {
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
			await user.tab();

			const actualHeatSource = store.spaceHeating.heatSource.data[1]!;
			expect(actualHeatSource.data.name).toBe("Solar thermal system");
			expect(actualHeatSource.data.typeOfHeatSource).toBe("solarThermalSystem");
		});
	});
});
