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
});

describe("Heat pump section", () => {
	describe("Existing heat pump", () => {
		const existingHeatPumpSpaceHeating: HeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat pump 2",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-LARGE",
		};

		const existingHeatPump: DomesticHotWaterHeatSourceData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c62",
			coldWaterSource: "headerTank",
			isExistingHeatSource: true,
			heatSourceId: existingHeatPumpSpaceHeating.id,
		};
	});

	describe("New heat pump", () => {
		const newHeatPump: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
		};

		const populateValidHeatPumpForm = async () => {
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
			expect(screen.queryByTestId("selectHeatPump")).toBeDefined();
		});

		test("select heat pump section only displays when type of heat pump has been selected", async () => {
			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});
			expect(screen.queryByTestId("selectHeatPump")).toBeNull();

			await populateValidHeatPumpForm();
			expect(screen.queryByTestId("selectHeatPump")).not.toBeNull();
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
			vi.mocked(uuidv4).mockReturnValue(newHeatPump.id as unknown as Buffer);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "create" },
				},
			});

			await populateValidHeatPumpForm();

			const { data } = store.domesticHotWaterNew.heatSources;
			expect(data[0]?.data).toEqual({
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Air source heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
			});
		});

		test("form is prepopulated when data exists in state", async () => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [{ data: newHeatPump }],
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
						data: [{ data: newHeatPump }],
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

			expect(data[0]!.data.id).toBe(newHeatPump.id);
			expect((data[0]!.data as { name: string }).name).toBe("Updated heat pump");
		});

		test("product reference is cleared when heat pump type changes", async () => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [{ data: newHeatPump }],
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
});