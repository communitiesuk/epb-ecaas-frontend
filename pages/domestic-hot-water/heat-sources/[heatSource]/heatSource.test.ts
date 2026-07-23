import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import HeatSourceForm from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { v4 as uuidv4 } from "uuid";
import type { DomesticHotWaterHeatSourceData, HeatNetworkData } from "~/stores/ecaasStore.schema";
import type { BoilerProduct, DisplayProduct, HybridHeatPumpProduct, Product } from "~/pcdb/pcdb.types";
import { celsius } from "~/utils/units/temperature";
import { litre } from "~/utils/units/volume";
import type { HeatSourceData, WaterStorageData } from "../../../../stores/ecaasStore.schema";

vi.mock("uuid");

const user = userEvent.setup();
const store = useEcaasStore();

const { mockFetch, navigateToMock } = vi.hoisted(() => ({
	navigateToMock: vi.fn(),
	mockFetch: vi.fn(),
}));

mockNuxtImport("navigateTo", () => navigateToMock);
mockNuxtImport("useFetch", () => mockFetch);

afterEach(() => {
	store.$reset();
	mockFetch.mockReset();
	navigateToMock.mockReset();
});



mockNuxtImport("useFetch", () => mockFetch);

const product: Partial<Product> = {
	id: "1000",
	brandName: "HEM Default",
	modelName: "Model Name",
};

beforeEach(() => {
	mockFetch.mockReturnValue({
		data: ref(product),
	});
});

afterEach(() => {
	store.$reset();
	mockFetch.mockReset();
});

const existingHeatPumpSpaceHeating1: HeatSourceData = {
	id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
	name: "Heat pump 1",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "airSource",
	productReference: "HEATPUMP-LARGE",
	maxFlowTemp: unitValue(7, celsius),
	energySupply: "electricity",
};
const existingHeatPumpSpaceHeating2: HeatSourceData = {
	id: "463c94f6-566c-49b2-af27-57e5c68b5c31",
	name: "Heat pump 2",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "airSource",
	productReference: "HEATPUMP-LARGE",
	maxFlowTemp: unitValue(7, celsius),
	energySupply: "electricity",
};

const dhwWithExistingHeatPump: DomesticHotWaterHeatSourceData = {
	id: "463c94f6-566c-49b2-af27-57e5c68b5c62",
	coldWaterSource: "headerTank",
	isExistingHeatSource: true,
	heatSourceId: existingHeatPumpSpaceHeating1.id,
};

const dhwWithNewHeatPump: DomesticHotWaterHeatSourceData = {
	coldWaterSource: "mainsWater",
	isExistingHeatSource: false,
	heatSourceId: "NEW_HEAT_SOURCE",
	id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
	name: "Heat pump 1",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "airSource",
	productReference: "HEATPUMP-SMALL",
	maxFlowTemp: unitValue(7, celsius),
	energySupply: "electricity",
};

const hybridHeatPump: DomesticHotWaterHeatSourceData = {
	coldWaterSource: "headerTank",
	isExistingHeatSource: false,
	heatSourceId: "NEW_HEAT_SOURCE",
	id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
	name: "Heat pump 1",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "hybridHeatPump",
	productReference: "1000",
	packageProductIds: ["1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b"],
	maxFlowTemp: unitValue(7, celsius),
	energySupply: "electricity",
};

const backupBoiler: DomesticHotWaterHeatSourceData = {
	id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
	name: "Backup boiler",
	heatSourceId: "NEW_HEAT_SOURCE",
	coldWaterSource: "headerTank",
	isExistingHeatSource: false,
	typeOfHeatSource: "boiler",
	typeOfBoiler: "combiBoiler",
	productReference: "2000",
	needsSpecifiedLocation: true,
	packagedProductReference: "1000",
	maxFlowTemp: unitValue(32, celsius),
};

describe("Heat Source Page", () => {
	test("only allows user to choose a hui when a communal heat network is already added", async () => {
		const heatNetwork: EcaasForm<HeatNetworkData> = {
			data: {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8f",
				name: "Heat Network",
				productReference: "42",
				typeOfHeatNetwork: "communalHeatNetwork",
			},
		};

		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [heatNetwork],
					complete: true,
				},
			},
		});
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		
		expect(screen.getByTestId("typeOfHeatSource_heatInterfaceUnit")).toBeDefined();
	});

	test("only allows user to choose heat network when a DHW-only heat pump is already added", async () => {
		const dhwHeatPump: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "DHW Heat pump",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
			energySupply: "electricity",
			maxFlowTemp: unitValue(30, celsius),
		};

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: dhwHeatPump }],
				},
			},
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));

		expect(screen.getByTestId("typeOfHeatSource_heatNetwork")).toBeDefined();
		expect(screen.queryByTestId("typeOfHeatSource_heatPump")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_heatInterfaceUnit")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_boiler")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_heatBattery")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_solarThermalSystem")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_immersionHeater")).toBeNull();
		expect(screen.queryByTestId("typeOfHeatSource_pointOfUse")).toBeNull();
	});

	test("should display the base form when no data has been added ", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("coldWaterSource")).toBeDefined();
		expect(screen.getByTestId("heatSourceId")).toBeDefined();
	});

	test("should not display heat source form when add new heat source option is not selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE").hasAttribute("checked")).toBe(false);
		expect(screen.queryByTestId("typeOfHeatSource")).toBeNull();
	});

	test("should display heat source form when add new heat source option is selected", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		expect(screen.getByTestId("typeOfHeatSource")).toBeDefined();
	});

	test("HeatInterfaceUnitSection displays when type of heat source is heat interface unit", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});

		await user.click(screen.getByTestId("coldWaterSource_headerTank"));
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_heatInterfaceUnit"));

		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.getByTestId("selectHeatInterfaceUnit")).toBeDefined();
		expect(screen.getByTestId("associatedHeatNetwork")).toBeDefined();
		expect(screen.getByTestId("maxFlowTemp")).toBeDefined();
		expect(screen.getByTestId("buildingLevelLosses")).toBeDefined();
	});

	test("heat source data is cleared from store when user picks a different heat source", async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: existingHeatPumpSpaceHeating1 }, { data: existingHeatPumpSpaceHeating2 }],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [{ data: dhwWithNewHeatPump }],
				},
			},
		});
		
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`));
		
		expect(store.domesticHotWater.heatSources.data[0]?.data).toEqual(expect.objectContaining({
			coldWaterSource: "mainsWater",
			isExistingHeatSource: true,
			heatSourceId: existingHeatPumpSpaceHeating1.id,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		}));
	});

	test("only display the heat source base form when user clicks existing heat source after initially adding a new one", async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: existingHeatPumpSpaceHeating1 }, { data: existingHeatPumpSpaceHeating2 }],
				},
			},
		});
	
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		expect(screen.getByTestId("typeOfHeatSource")).toBeDefined();
		await user.click(screen.getByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`));
		expect(screen.queryByTestId("typeOfHeatSource")).toBeNull();
	});
	
	test("once an existing heat source has been selected, it appears greyed out and cannot be selected", async () => { 
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: existingHeatPumpSpaceHeating1 }],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [{ data: dhwWithExistingHeatPump }],
				},
			},
		});
	
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		expect(screen.getByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`)
			.hasAttribute("disabled")).toBeTruthy();
		expect(screen.getByText(`${existingHeatPumpSpaceHeating1.name} (already used for water heating)`).textContent)
			.toBeDefined();
	});

	test("save progress button navigates user to the domestic hot wate overview page", async () => {
		await renderSuspended(HeatSourceForm);
		const saveProgressButton = screen.getByTestId("saveProgress");

		expect(saveProgressButton.getAttribute("href")).toBe("/domestic-hot-water");
	});

	test("save progress button navigates user to the domestic hot wate overview page", async () => {
		await renderSuspended(HeatSourceForm);
		const saveProgressButton = screen.getByTestId("saveProgress");

		expect(saveProgressButton.getAttribute("href")).toBe("/domestic-hot-water");
	});

	test("disables input fields when heat source is created automatically", async () => {
		const createdHeatPump: DomesticHotWaterHeatSourceData = {
			...dhwWithExistingHeatPump,
			createdAutomatically: true,
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: existingHeatPumpSpaceHeating1 }],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [{ data: createdHeatPump }],
				},
			},
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		[createdHeatPump.heatSourceId, "NEW_HEAT_SOURCE"].forEach(option => {
			expect(screen.getByTestId<HTMLInputElement>(`heatSourceId_${option}`).disabled).toBe(true);
		});
	});

	test("displays insets message when linked to a space heating heat source and hot water cylinder", async () => {
		const spaceHeatingHeatPump: HeatSourceData = {
			...existingHeatPumpSpaceHeating1,
			packageProductIds: ["463c95f6-566c-41b2-af27-57e5c68b5c39"],
		};

		const hotWaterCylinder: Partial<WaterStorageData> = {
			id: "463c95f6-566c-41b2-af27-57e5c68b5c39",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: existingHeatPumpSpaceHeating1.productReference,
		};

		const domesticHotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
			id: "473c95f6-566c-41b2-af28-59e5c68b5c39",
			isExistingHeatSource: true,
			heatSourceId: spaceHeatingHeatPump.id,
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: spaceHeatingHeatPump }],
				},
			},
			domesticHotWater: {
				heatSources: {
					data: [{ data: domesticHotWaterHeatPump }],
				},
				waterStorage: {
					data: [{ data: hotWaterCylinder }],
				},
			},
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		expect(screen.getByTestId("spaceHeatingHeatSourceWithCylinderInset")).toBeDefined();
	});

	describe("unique name", () => {
	
		const heatPump: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			heatSourceId: "NEW_HEAT_SOURCE",
			name: "Heat source 1",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			maxFlowTemp: unitValue(7, celsius),
		};
		const boiler: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdk333333",
			name: "Heat source 1",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			maxFlowTemp: unitValue(32, celsius),
		};

		const heatBattery: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat source 1",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
		};

		// const heatNetwork: Partial<DomesticHotWaterHeatSourceData> = {
		// 	isExistingHeatSource: false,
		// 	heatSourceId: "NEW_HEAT_SOURCE",
		// 	id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
		// 	name: "Heat source 1",
		// 	typeOfHeatSource: "heatNetwork",
		// 	typeOfHeatNetwork: "communalHeatNetwork",
		// };

		const solarThermalSystem: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
			name: "Heat source 1",
			typeOfHeatSource: "solarThermalSystem",
		};

		const immersionHeater: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c888888",
			name: "Heat source 1",
			typeOfHeatSource: "immersionHeater",
		};

		const pointOfUse: Partial<DomesticHotWaterHeatSourceData> = {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c9999999",
			name: "Heat source 1",
			typeOfHeatSource: "pointOfUse",
		};

		it.each([
			["heat pump", heatPump],
			["boiler", boiler],
			["heat battery", heatBattery],
			// ["heat network", heatNetwork],
			["solar thermal system", solarThermalSystem],
			["immersion heater", immersionHeater],
			["point of use", pointOfUse],
		])(
			"check DHW heat sources %s and space heating heat sources to ensure name is unique", async (_name, heatSource) => {

				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [{ data: {
								id: "HS-1",
								name: "Heat source 1",
							} }],
						},
					},
					domesticHotWater: {
						heatSources: { data: [{ data: heatSource }] },
					} });

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "0" },
					},
				});

				await user.click(screen.getByTestId("saveAndComplete"));
				const nameError = await screen.findByTestId("name_error");
				expect(nameError.innerText).toContain("An element with this name in domestic hot water or space heating already exists. Please enter a unique name.");
			});
	});

	describe("max flow temp input for existing heat source", () => {
		const existingBoilerSpaceHeating: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c37",
			name: "Combi boiler",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "2000",
			needsSpecifiedLocation: true,
			maxFlowTemp: unitValue(7, celsius),
		};

		const dhwWithExistingBoiler: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c37",
			coldWaterSource: "headerTank",
			isExistingHeatSource: true,
			heatSourceId: existingBoilerSpaceHeating.id,
		};

		const existingBatterySpaceHeating: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c38",
			name: "Heat battery",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			productReference: "100",
			maxFlowTemp: unitValue(7, celsius),
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const dhwWithExistingBattery: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c38",
			coldWaterSource: "headerTank",
			isExistingHeatSource: true,
			heatSourceId: existingBatterySpaceHeating.id,
		};
        
		it.each([[existingHeatPumpSpaceHeating1, dhwWithExistingHeatPump], [existingBoilerSpaceHeating, dhwWithExistingBoiler], [existingBatterySpaceHeating, dhwWithExistingBattery]]) (
			"when existing boiler, heat pump and heat battery has been selected, max flow temp input shows", async (existingHeatSource, dhwWithExistingHeatSource) => {
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [{ data: existingHeatSource }],
						},
					},
					domesticHotWater: {
						heatSources: {
							data: [{ data: dhwWithExistingHeatSource }],
						},
					},
				});

				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "0" },
					},
				});

				expect(screen.getByTestId("maxFlowTemp")).toBeDefined();
			});
	});

	test("Renders HEM default product warning when default product is selected", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: dhwWithNewHeatPump }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref({
				...product,
				brandName: "HEM Default",
			}),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		expect((await screen.findByTestId("hemDefaultProductWarning"))).toBeDefined();
	});
});

describe("Boiler section", () => {
	it("disables input fields when boiler is packaged with a heat pump", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
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

		Object.keys(coldWaterSourceOptions).forEach(option => {
			expect(screen.getByTestId<HTMLInputElement>(`coldWaterSource_${option}`).disabled).toBe(true);
		});

		expect(screen.getByTestId<HTMLInputElement>(`heatSourceId_NEW_HEAT_SOURCE`).disabled).toBe(true);

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
});

describe("Heat pump section", () => {
	const heatPumpProductWithCylinder: Partial<DisplayProduct> = {
		id: "1001",
		brandName: "Brand",
		technologyType: "AirSourceHeatPump",
		vesselType: "Integral",
	};

	const heatPumpWithCylinder: Partial<DomesticHotWaterHeatSourceData> = {
		...dhwWithNewHeatPump,
		productReference: heatPumpProductWithCylinder.id,
		packagedWithWaterCylinder: true,
	};
	
	describe("Existing heat pump", () => {

		test("existing heat pump data reference is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue("463c94f6-566c-49b2-af27-57e5c6811111" as unknown as Buffer);

			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: existingHeatPumpSpaceHeating1 }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await user.click(screen.getByTestId("coldWaterSource_headerTank"));
			await user.click(screen.getByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`));
			await user.type(screen.getByTestId("maxFlowTemp"), "40");
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(store.domesticHotWater.heatSources.data[0]?.data).toEqual(expect.objectContaining({
				coldWaterSource: "headerTank",
				isExistingHeatSource: true,
				heatSourceId: existingHeatPumpSpaceHeating1.id,
				id: "463c94f6-566c-49b2-af27-57e5c6811111",
			}));
		});

		test("form is prepopulated when existing heat pump data reference exists in state", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: existingHeatPumpSpaceHeating1 }, { data: existingHeatPumpSpaceHeating2 }],
					},
				},
				domesticHotWater: {
					heatSources: {
						data: [{ data: dhwWithExistingHeatPump }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId("coldWaterSource_headerTank")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`)).hasAttribute("checked")).toBe(true);
		});

		test("form is prepopulated when existing heat pump data reference exists in state", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: existingHeatPumpSpaceHeating1 }],
					},
				},
				domesticHotWater: {
					heatSources: {
						data: [{ data: dhwWithExistingHeatPump }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId("coldWaterSource_headerTank")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId(`heatSourceId_${existingHeatPumpSpaceHeating1.id}`)).hasAttribute("checked")).toBe(true);
		});

		test("Cold water source of backup boiler is updated when cold water source of hybrid heat pump is updated", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							{ data: hybridHeatPump },
							{ data: backupBoiler },
						],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.click(screen.getByTestId("coldWaterSource_mainsWater"));

			expect(store.domesticHotWater.heatSources.data[1]?.data.coldWaterSource).toBe("mainsWater");
		});
	});

	describe("New heat pump", () => {

		const populateValidHeatPumpForm = async () => {
			await user.click(screen.getByTestId("coldWaterSource_headerTank"));
			await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
		};

		test("'HeatPumpSection' component displays when type of heat source is heat pump", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await populateValidHeatPumpForm();
			expect(screen.getByTestId("name")).toBeDefined();
			expect(screen.getByTestId("selectHeatPump")).toBeDefined();
		});

		test("select heat pump section only displays when type of heat pump has been selected", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			expect(screen.queryByTestId("selectHeatPump")).toBeNull();

			await populateValidHeatPumpForm();
			expect(screen.getByTestId("selectHeatPump")).not.toBeNull();
		});

		test("the 'Select a product' element navigates user to the products page", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			await populateValidHeatPumpForm();

			await user.click(screen.getByTestId("chooseAProductButton"));

			expect(navigateToMock).toHaveBeenCalledWith("/0/heat-pump");

		});

		test("heat pump data is saved to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(dhwWithNewHeatPump.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatPumpForm();
			await user.click(screen.getByTestId("saveAndComplete"));

			const heatPump = store.domesticHotWater.heatSources.data[0];
			expect(heatPump?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump",
				typeOfHeatSource: "heatPump",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				coldWaterSource: "headerTank",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{ data: dhwWithNewHeatPump }],
					},
				},
			});

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			expect((await screen.findByTestId("typeOfHeatSource_heatPump")).hasAttribute("checked")).toBe(true);
			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Heat pump 1");
			expect((await screen.findByTestId<HTMLInputElement>("maxFlowTemp")).value).toBe("7");
		});

		test("heat pump is updated when data with id exists in store", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{ data: dhwWithNewHeatPump }],
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

			const { data } = store.domesticHotWater.heatSources;

			expect(data[0]!.data.id).toBe(dhwWithNewHeatPump.id);
			expect((data[0]!.data as { name: string }).name).toBe("Updated heat pump");
		});

		describe("heat pump default name", () => {
			it("creates a new heat pump with default name", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));

				const actualHeatSource = store.domesticHotWater.heatSources.data[0]!;
				expect((actualHeatSource.data as { name: string }).name).toBe("Heat pump");
			});

			//Can change this to add heat pump type to name when heat pump product is selected
			it.skip("adds heat pump type to name when heat pump type is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.click(screen.getByTestId("typeOfHeatPump_airSource"));

				const actualHeatSource = store.domesticHotWater.heatSources.data[0]!;
				expect((actualHeatSource.data as { name: string }).name).toBe("Air source heat pump");

				await user.click(screen.getByTestId("typeOfHeatPump_booster"));

				expect((actualHeatSource.data as { name: string }).name).toBe("Booster heat pump");
			});
		});

		test("required error messages are displayed when invalid form is submitted", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("selectHeatPump_error")).toBeDefined();
			expect(await screen.findByTestId("maxFlowTemp_error")).toBeDefined();
		});
	});
	
	it("removes backup boiler packaged with heat pump when heat source is changed from heat pump to another type", async () => {
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
	
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [
						{ data: backupBoiler },
						{ data: hybridHeatPump },
					],
				},
			},
		});
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "1" },
			},
		});
		const backUpBolerInStoreBeforeChange = store.domesticHotWater.heatSources.data.find(hs => hs.data.id === backupBoiler.id);
		expect(backUpBolerInStoreBeforeChange).toBeDefined();
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
		await user.click(screen.getByTestId("typeOfBoiler_combiBoiler"));
		await user.tab();
		const backUpBolerInStoreAfterChange = store.domesticHotWater.heatSources.data.find(hs => hs.data.id === backupBoiler.id);
		expect(backUpBolerInStoreAfterChange).toBeUndefined();
	});

	test("requires configuration of water cylinder when heat pump comes with water cylinder", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatPumpWithCylinder }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProductWithCylinder),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		expect(screen.getByTestId("waterCylinderConfiguration")).toBeDefined();

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(screen.getByTestId("waterCylinderConfiguration_error")).toBeDefined();
	});

	test("selecting hot water cylinder configuration creates a hot water cylinder", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatPumpWithCylinder }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProductWithCylinder),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId("waterCylinderConfiguration_hotWaterCylinder"));
		await user.click(screen.getByTestId("saveProgress"));

		const waterStorageData = store.domesticHotWater.waterStorage.data;
		const expectedCylinderData: Partial<WaterStorageData> = {
			name: "Hot water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: heatPumpProductWithCylinder.id,
		};

		expect(waterStorageData.length).toBe(1);
		expect(waterStorageData[0]?.data).toEqual(expect.objectContaining(expectedCylinderData));
	});

	test("selecting pre-heated water cylinder configuration creates a pre-heated water cylinder", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatPumpWithCylinder }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProductWithCylinder),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId("waterCylinderConfiguration_preheatedWaterCylinder"));
		await user.click(screen.getByTestId("saveProgress"));

		const waterStorageData = store.domesticHotWater.preheatedWaterStorage.data;
		const expectedCylinderData: Partial<PreheatedWaterStorageData> = {
			name: "Preheated water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: heatPumpProductWithCylinder.id,
		};

		expect(waterStorageData.length).toBe(1);
		expect(waterStorageData[0]?.data).toEqual(expect.objectContaining(expectedCylinderData));
	});

	test("selecting pre-heated water cylinder configuration adds pre-heated cylinder to cold water source options", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatPumpWithCylinder }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProductWithCylinder),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId("waterCylinderConfiguration_preheatedWaterCylinder"));

		setTimeout(() => {
			const preheatedWaterCylinder = store.domesticHotWater.preheatedWaterStorage.data[0]?.data;

			expect(screen.findByTestId(`coldWaterSource_${preheatedWaterCylinder?.id}`)).toBeDefined();
		}, 500);
	});

	test("changing heat source clears associated hot water source and cylinder", async () => {
		const cylinderData: Partial<PreheatedWaterStorageData> = {
			name: "Preheated water cylinder",
			typeOfWaterStorage: "hotWaterCylinder",
			packagedProductReference: heatPumpProductWithCylinder.id,
		};

		const heatPumpWithCylinderConfig: Partial<DomesticHotWaterHeatSourceData> = {
			...heatPumpWithCylinder,
			waterCylinderConfiguration: "hotWaterCylinder",
			packageProductIds: [cylinderData.id!],
		};

		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: heatPumpWithCylinderConfig }],
				},
				waterStorage: {
					data: [{ data: cylinderData }],
				},
			},
		});

		mockFetch.mockReturnValue({
			data: ref(heatPumpProductWithCylinder),
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.click(screen.getByTestId("typeOfHeatSource_boiler"));
		await user.click(screen.getByTestId("saveProgress"));

		const waterStorageData = store.domesticHotWater.waterStorage.data;

		expect(waterStorageData.length).toBe(0);
	});
});

describe("Immersion heater section", () => {
	const populateValidImmersionHeaterForm = async () => {
		await user.click(screen.getByTestId("coldWaterSource_headerTank"));
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_immersionHeater"));
		await user.type(screen.getByTestId("power"), "1");
		await user.tab();
	};

	const immersionHeater1: DomesticHotWaterHeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c111111",
		name: "Immersion heater",
		typeOfHeatSource: "immersionHeater",
		power: 2,
		coldWaterSource: "headerTank",
		isExistingHeatSource: false,
		heatSourceId: "NEW_HEAT_SOURCE",

	};

	test("'ImmersionHeaterSection' component displays when type of heat source is immersion heater", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await populateValidImmersionHeaterForm();

		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.getByTestId("power")).toBeDefined();
	});

	test("immersion heater data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(immersionHeater1.id as unknown as Buffer);

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await populateValidImmersionHeaterForm();
		await user.click(screen.getByTestId("saveAndComplete"));


		const immersionHeater = store.domesticHotWater.heatSources.data[0]?.data;
		expect(immersionHeater).toEqual({
			id: "463c94f6-566c-49b2-af27-57e5c111111",
			name: "Immersion heater",
			typeOfHeatSource: "immersionHeater",
			power: 1,
			heatSourceId: "NEW_HEAT_SOURCE",
			coldWaterSource: "headerTank",
			isExistingHeatSource: false,
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: immersionHeater1 }],
				},
			},
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		expect((await screen.findByTestId("typeOfHeatSource_immersionHeater")).hasAttribute("checked"));
		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Immersion heater");
		expect((await screen.findByTestId<HTMLInputElement>("power")).value).toBe("2");
	});

	test("immersion heater is updated when data with id exists in store", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: immersionHeater1 }],
				},
			},
		});


		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated immersion heater");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const immersionHeater = store.domesticHotWater.heatSources.data[0]?.data;

		expect(immersionHeater!.id).toBe(immersionHeater1.id);
		expect((immersionHeater! as { name: string }).name).toBe("Updated immersion heater");
	});

	test("required error messages are displayed when invalid form is submitted", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));

		await user.click(screen.getByTestId("typeOfHeatSource_immersionHeater"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("power_error")).toBeDefined();		
	});
});

describe("Point of use section", () => {
	beforeEach(() => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: { fuelType: ["electricity"] },
				},
			},
		});
	});

	const populateValidPOUForm = async () => {
		await user.click(screen.getByTestId("coldWaterSource_headerTank"));
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_pointOfUse"));
		await user.click(screen.getByTestId("energySupply_electricity"));
		// await user.type(screen.getByTestId("heaterEfficiency"), "1");

		await user.tab();
	};

	const pointOfUse1: DomesticHotWaterHeatSourceData = {
		id: "463c94f6-566c-49b2-af27-57e5c111111",
		name: "Point of use",
		typeOfHeatSource: "pointOfUse",
		energySupply: "electricity",
		// heaterEfficiency: 0,
		coldWaterSource: "headerTank",
		isExistingHeatSource: false,
		heatSourceId: "NEW_HEAT_SOURCE",

	};

	test("'PointOfUseSection' component displays when type of heat source is Point of use", async () => {
		
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		
		await user.click(screen.getByTestId("coldWaterSource_headerTank"));
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_pointOfUse"));

		expect(screen.getByTestId("name")).toBeDefined();
		expect(screen.getByTestId("energySupply")).toBeDefined();
		// expect(screen.getByTestId("heaterEfficiency")).toBeDefined();
	});

	test("Point of use data is saved to store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue(pointOfUse1.id as unknown as Buffer);
		
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await populateValidPOUForm();
		await user.click(screen.getByTestId("saveAndComplete"));


		const pointOfUse = store.domesticHotWater.heatSources.data[0]?.data;
		expect(pointOfUse).toEqual({
			id: "463c94f6-566c-49b2-af27-57e5c111111",
			name: "Point of use",
			typeOfHeatSource: "pointOfUse",
			energySupply: "electricity",
			// heaterEfficiency: 0,
			heatSourceId: "NEW_HEAT_SOURCE",
			coldWaterSource: "headerTank",
			isExistingHeatSource: false,
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: pointOfUse1 }],
				},
			},
		});

		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		expect((await screen.findByTestId("typeOfHeatSource_pointOfUse")).hasAttribute("checked"));
		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Point of use");
		expect((await screen.findByTestId("energySupply_electricity")).hasAttribute("checked"));
		// expect((await screen.findByTestId<HTMLInputElement>("heaterEfficiency")).value).toBe("0");
	});

	test("point of use is updated when data with id exists in store", async () => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [{ data: pointOfUse1 }],
				},
			},
		});


		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "Updated point of use");
		await user.tab();
		await user.click(screen.getByTestId("saveAndComplete"));

		const pointOfUse = store.domesticHotWater.heatSources.data[0]?.data;

		expect(pointOfUse!.id).toBe(pointOfUse1.id);
		expect((pointOfUse! as { name: string }).name).toBe("Updated point of use");
	});

	test("required error messages are displayed when invalid form is submitted", async () => {
		await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		await user.click(screen.getByTestId("typeOfHeatSource_pointOfUse"));
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("energySupply_error")).toBeDefined();	
		// expect(await screen.findByTestId("heaterEfficiency_error")).toBeDefined();		

	});

	test("point of use heat source is disabled when a water storage has been selected", async () => {
		const hotWaterCylinder: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Hot water cylinder 1",
				id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
				typeOfWaterStorage: "hotWaterCylinder",
				storageCylinderVolume: unitValue(5, litre),
				dailyEnergyLoss: 1,
				areaOfHeatExchanger: 1000,
				heaterPosition: 0.8,
				thermostatPosition: 0.5,
				coldWaterSource: "mainsWater",
			},
		};
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [hotWaterCylinder],
				},
			},
		});
		await renderSuspended(HeatSourceForm);
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		expect(screen.getByTestId("typeOfHeatSource_pointOfUse").hasAttribute("disabled")).toBeTruthy();
	});

	test("point of use hint text is displayed when point of use is disabled", async () => {
		const hotWaterCylinder: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Hot water cylinder 1",
				id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
				typeOfWaterStorage: "hotWaterCylinder",
				storageCylinderVolume: unitValue(5, litre),
				dailyEnergyLoss: 1,
				areaOfHeatExchanger: 1000,
				heaterPosition: 0.8,
				thermostatPosition: 0.5,
				coldWaterSource: "mainsWater",
			},
		};
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [hotWaterCylinder],
				},
			},
		});
		await renderSuspended(HeatSourceForm);
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		expect(screen.getByText("Point of use can only be selected when there is no water storage")).toBeTruthy();	
	});

	test("if heat source type is not point of use, it is not disabled when water storage has been selected", async () => {
		const hotWaterCylinder: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Hot water cylinder 1",
				id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
				typeOfWaterStorage: "hotWaterCylinder",
				storageCylinderVolume: unitValue(5, litre),
				dailyEnergyLoss: 1,
				areaOfHeatExchanger: 1000,
				heaterPosition: 0.8,
				thermostatPosition: 0.5,
				coldWaterSource: "mainsWater",
			},
		};
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [hotWaterCylinder],
				},
			},
		});
		await renderSuspended(HeatSourceForm);
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
		expect(screen.getByTestId("typeOfHeatSource_immersionHeater").hasAttribute("disabled")).toBeFalsy();
		expect(screen.getByTestId("typeOfHeatSource_heatPump").hasAttribute("disabled")).toBeFalsy();
	});
});

describe("Heat Networks", () => {
	const communalHeatNetwork: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c13",
		name: "Communal Heat Network",
		typeOfHeatNetwork: "communalHeatNetwork",
		subHeatNetworkName: "Sub Communal Heat Network",
	};

	const communalHeatNetworkWithBooster: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c20",
		name: "Communal Heat Network with Booster",
		typeOfHeatNetwork: "communalHeatNetwork",
		subHeatNetworkName: "Sub Communal Heat Network with Booster",
		boosterHeatPump: true,
	};

	const sleevedDistrictHeatNetwork: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c15",
		name: "Sleeved District Heat Network",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		subHeatNetworkName: "Sub Sleeved District Heat Network",
	};

	const unsleevedDistrictHeatNetwork: Partial<HeatNetworkData> = {
		id: "463c94f6-566c-49b2-af27-57e5c68b5c17",
		name: "Unsleeved District Heat Network",
		typeOfHeatNetwork: "unsleevedDistrictHeatNetwork",
		subHeatNetworkName: "Sub Unsleeved District Heat Network",
	};

	const heatInterfaceUnit: Partial<HeatSourceData> = {
		id: "hiuId",
		name: "Heat Interface Unit",
		typeOfHeatSource: "heatInterfaceUnit",
	};

	test("if the heat network is a communal heat network without a booster heat pump flag, show HIU & add new water heating source options in previously added heat source section", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: communalHeatNetwork }],
					complete: true,
				},
				heatSource: {
					data: [{ data: heatInterfaceUnit }],
				},
			},
		});
		const component = await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});

		const heatSourceRadios = component.container.querySelectorAll("#heatSourceId input[type=radio]");
		
		expect(screen.getByTestId("heatSourceId_hiuId")).toBeDefined();
		expect(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE")).toBeDefined();
		expect(heatSourceRadios.length).toBe(2);
	});

	test("if the heat network is a communal heat network without a booster heat pump flag, only show HIU as an option in type of heat source", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: communalHeatNetwork }],
					complete: true,
				},
			},
		});
		const component = await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));

		const heatSourceRadios = component.container.querySelectorAll("#typeOfHeatSource input[type=radio]");
		
		expect(screen.getByTestId("typeOfHeatSource_heatInterfaceUnit")).toBeDefined();
		expect(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE")).toBeDefined();
		expect(heatSourceRadios.length).toBe(1);
	});

	test("if the heat network is a sleeved district heat network, only show HIU as an option in type of heat source", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: sleevedDistrictHeatNetwork }],
					complete: true,
				},
			},
		});
		const component = await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));

		const heatSourceRadios = component.container.querySelectorAll("#typeOfHeatSource input[type=radio]");
		
		expect(screen.getByTestId("typeOfHeatSource_heatInterfaceUnit")).toBeDefined();
		expect(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE")).toBeDefined();
		expect(heatSourceRadios.length).toBe(1);
	});

	test("if the heat network is an unsleeved district heat network, only show HIU as an option in type of heat source", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: unsleevedDistrictHeatNetwork }],
					complete: true,
				},
			},
		});
		const component = await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));

		const heatSourceRadios = component.container.querySelectorAll("#typeOfHeatSource input[type=radio]");
		
		expect(screen.getByTestId("typeOfHeatSource_heatInterfaceUnit")).toBeDefined();
		expect(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE")).toBeDefined();
		expect(heatSourceRadios.length).toBe(1);
	});

	test("if heat network is a communal heat network with a booster heat pump flag, only show booster heat pump as an option", async () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [{ data: communalHeatNetworkWithBooster }],
					complete: true,
				},
			},
		});
		const component = await renderSuspended(HeatSourceForm, {
			route: {
				params: { "heatSource": "create" },
			},
		});
		await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
	
		const heatSourceRadios = component.container.querySelectorAll("#typeOfHeatSource input[type=radio]");
			
		expect(screen.getByTestId("typeOfHeatSource_heatPump")).toBeDefined();
		expect(heatSourceRadios.length).toBe(1);
		expect(screen.getByText("Booster heat pump"));
	});
});