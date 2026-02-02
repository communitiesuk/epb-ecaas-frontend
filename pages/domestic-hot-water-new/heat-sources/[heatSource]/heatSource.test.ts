import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import HeatSourceForm from "./index.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { v4 as uuidv4 } from "uuid";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

vi.mock("uuid");

const user = userEvent.setup();
const store = useEcaasStore();

afterEach(() => {
	store.$reset();
});

const existingHeatPumpSpaceHeating1: HeatSourceData = {
	id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
	name: "Heat pump 1",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "airSource",
	productReference: "HEATPUMP-LARGE",
};
const existingHeatPumpSpaceHeating2: HeatSourceData = {
	id: "463c94f6-566c-49b2-af27-57e5c68b5c31",
	name: "Heat pump 2",
	typeOfHeatSource: "heatPump",
	typeOfHeatPump: "airSource",
	productReference: "HEATPUMP-LARGE",
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
};

describe("Heat Source Page", () => {
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

	test("heat source data is cleared from store when user picks a different heat source", async () => {
		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{ data: existingHeatPumpSpaceHeating1 }, { data: existingHeatPumpSpaceHeating2 }],
				},
			},
			domesticHotWaterNew: {
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
		
		expect(store.domesticHotWaterNew.heatSources.data[0]?.data).toEqual({
			coldWaterSource: "mainsWater",
			isExistingHeatSource: true,
			heatSourceId: existingHeatPumpSpaceHeating1.id,
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
		});
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
});

describe("Heat pump section", () => {
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
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(store.domesticHotWaterNew.heatSources.data[0]?.data).toEqual({
				coldWaterSource: "headerTank",
				isExistingHeatSource: true,
				heatSourceId: existingHeatPumpSpaceHeating1.id,
				id: "463c94f6-566c-49b2-af27-57e5c6811111",
			});
			
		});
		test("form is prepopulated when existing heat pump data reference exists in state", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: existingHeatPumpSpaceHeating1 }, { data: existingHeatPumpSpaceHeating2 }],
					},
				},
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
	});
	describe("New heat pump", () => {

		const populateValidHeatPumpForm = async () => {
			await user.click(screen.getByTestId("coldWaterSource_headerTank"));
			await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
			await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
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

			expect((await screen.findByTestId("chooseAProductButton")).getAttribute("href")).toBe("/0/air-source");
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

			const heatPump = store.domesticHotWaterNew.heatSources.data[0];
			expect(heatPump?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Air source heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				coldWaterSource: "headerTank", 
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWaterNew: {
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
			expect((await screen.findByTestId("typeOfHeatPump_airSource")).hasAttribute("checked")).toBe(true);
		});

		test("heat pump is updated when data with id exists in store", async () => {
			store.$patch({
				domesticHotWaterNew: {
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

			const { data } = store.domesticHotWaterNew.heatSources;

			expect(data[0]!.data.id).toBe(dhwWithNewHeatPump.id);
			expect((data[0]!.data as { name: string }).name).toBe("Updated heat pump");
		});

		test("product reference is cleared when heat pump type changes", async () => {
			store.$patch({
				domesticHotWaterNew: {
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

			await user.click(screen.getByTestId("typeOfHeatPump_booster"));
			const { data } = store.domesticHotWaterNew.heatSources;
			const heatSourceItem = data[0]!.data;
			if ("productReference" in heatSourceItem) {
				expect(heatSourceItem.productReference).toBeUndefined();
			}
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

				const actualHeatSource = store.domesticHotWaterNew.heatSources.data[0]!;
				expect((actualHeatSource.data as { name: string }).name).toBe("Heat pump");
			});

			it("adds heat pump type to name when heat pump type is selected", async () => {
				await renderSuspended(HeatSourceForm, {
					route: {
						params: { "heatSource": "create" },
					},
				});

				await user.click(screen.getByTestId("heatSourceId_NEW_HEAT_SOURCE"));
				await user.click(screen.getByTestId("typeOfHeatSource_heatPump"));
				await user.click(screen.getByTestId("typeOfHeatPump_airSource"));

				const actualHeatSource = store.domesticHotWaterNew.heatSources.data[0]!;
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

			expect(await screen.findByTestId("typeOfHeatPump_error")).toBeDefined();

			await user.click(screen.getByTestId("typeOfHeatPump_airSource"));
			await user.click(screen.getByTestId("saveAndComplete"));

			expect(await screen.findByTestId("selectHeatPump_error")).toBeDefined();
		});
	});
	describe("immersion heater", () => {
			
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
	
		const immersionHeater2: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c222222",
			name: "Immersion heater 2",
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
	
	
			const immersionHeater = store.domesticHotWaterNew.heatSources.data[0]?.data;
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
					heatSources: {
						data: [{ data: immersionHeater1 }, { data: immersionHeater2 }],
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
	
			const immersionHeater = store.domesticHotWaterNew.heatSources.data[0]?.data;
	
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

	describe("point of use", () => {
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
			await user.type(screen.getByTestId("heaterEfficiency"), "1");

			await user.tab();
		};
	
		const pointOfUse1: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c111111",
			name: "Point of use",
			typeOfHeatSource: "pointOfUse",
			energySupply: "electricity",
			heaterEfficiency: 0,
			coldWaterSource: "headerTank",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
	
		};
	
		const pointOfUse2: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c222222",
			name: "Point of use 2",
			typeOfHeatSource: "pointOfUse",
			energySupply: "mains_gas",
			heaterEfficiency: 8,
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
			expect(screen.getByTestId("heaterEfficiency")).toBeDefined();
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
	
	
			const pointOfUse = store.domesticHotWaterNew.heatSources.data[0]?.data;
			expect(pointOfUse).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c111111",
				name: "Point of use",
				typeOfHeatSource: "pointOfUse",
				energySupply: "electricity",
				heaterEfficiency: 1,
				heatSourceId: "NEW_HEAT_SOURCE",
				coldWaterSource: "headerTank",
				isExistingHeatSource: false,
			});
		});
	
		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWaterNew: {
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
			expect((await screen.findByTestId<HTMLInputElement>("heaterEfficiency")).value).toBe("0");
		});
	
		test("point of use is updated when data with id exists in store", async () => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [{ data: pointOfUse1 }, { data: pointOfUse2 }],
					},
				},
			});
	
	
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "1" },
				},
			});
	
			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated point of use");
			await user.tab();
			await user.click(screen.getByTestId("saveAndComplete"));
	
			const pointOfUse = store.domesticHotWaterNew.heatSources.data[1]?.data;
	
			expect(pointOfUse!.id).toBe(pointOfUse2.id);
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
			expect(await screen.findByTestId("heaterEfficiency_error")).toBeDefined();		

		});
	});
});
