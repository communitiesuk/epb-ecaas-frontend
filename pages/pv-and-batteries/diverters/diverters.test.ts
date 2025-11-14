import Diverters from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const store = useEcaasStore();
const user = userEvent.setup();

const hotWaterCylinderId = "88ea3f45-6f2a-40e2-9117-0541bd8a97f3";
const heatPumpId = "56ddc6ce-7a91-4263-b051-96c7216bb01e";

const addHeatPumpAndHotWaterCylinder = () => {
	store.$patch({
		heatingAndCoolingSystems: {
			heatGeneration: {
				heatPump: {
					data: [{
						data: {
							name: "HP1",
							id: heatPumpId,
							productReference: "HEATPUMP-SMALL",
						},
					}],
				},
			},
		},
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						data: {
							name: "HWC1",
							id: hotWaterCylinderId,
							heatSource: heatPumpId,
							storageCylinderVolume: {
								amount: 1,
								unit: "litres",
							},
							dailyEnergyLoss: 1,
						},
					}],
				},
			},
		},
	});
};

const diverter1: EcaasForm<PvDiverterData> = {
	data: {
		name: "Diverter 1",
		hotWaterCylinder: hotWaterCylinderId,
	},
};

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Diverter 1");
	await user.click(screen.getByTestId(`hotWaterCylinder_${hotWaterCylinderId}`));
	await user.tab();
};

describe("Diverters", () => {

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid", async () => {
		addHeatPumpAndHotWaterCylinder();
		await renderSuspended(Diverters);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.pvAndBatteries.diverters;

		expect(data[0]).toEqual({ ...diverter1, complete: true });
	});

	test("form is prepopulated when data exists in state", async () => {
		addHeatPumpAndHotWaterCylinder();

		store.$patch({
			pvAndBatteries: {
				diverters: {
					data: [diverter1],
				},
			},
		});

		await renderSuspended(Diverters);

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Diverter 1");
		expect((await screen.findByTestId<HTMLInputElement>(`hotWaterCylinder_${hotWaterCylinderId}`)).value).toBe(hotWaterCylinderId);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Diverters);
		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("divertersErrorSummary"))).toBeDefined();
	});

	it("navigates to pv and batteries page when valid form is completed", async () => {
		addHeatPumpAndHotWaterCylinder();
		await renderSuspended(Diverters);
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("navigates to pv and batteries page when save progress button is clicked", async () => {
		await renderSuspended(Diverters);
		await user.type(screen.getByTestId("name"), "Test diverter");
		await user.click(screen.getByTestId("saveProgress"));

		expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
	});

	it("displays link to add hot water cylinder if none exists already", async () => {
		await renderSuspended(Diverters);

		const link = screen.getByRole("link", { name: "Click here to add a hot water cylinder" });

		expect(link).toBeDefined();
		expect(link.getAttribute("href")).toBe("/domestic-hot-water/water-heating");
	});

	it("preselects hot water cylinder if there is only one added to store", async () => {
		addHeatPumpAndHotWaterCylinder();
		await renderSuspended(Diverters);
		expect((await screen.findByTestId(`hotWaterCylinder_${hotWaterCylinderId}`)).hasAttribute("checked")).toBe(true);
	});
	
	describe("partially saving data", () => {
		it("creates a new diverter automatically with given name", async () => {
			await renderSuspended(Diverters);
			await user.type(screen.getByTestId("name"), "New diverter");
			await user.tab();

			const actualDiverter = store.pvAndBatteries.diverters.data[0]!;

			expect(actualDiverter.data.name).toBe("New diverter");

		});
		// re-add the test below if/when more hot water cylinders can be added 
		// currently hot water cylinder is pre-selected - meaning that a form can only be added if the name is filled out (there is not other data that can be entered)

		// it("creates a new diverter automatically with default name after other data is entered", async () => {
		// 	addHeatPumpAndHotWaterCylinder();
		// 	await renderSuspended(Diverters);
		// 	await user.click(screen.getByTestId(`hotWaterCylinder_${hotWaterCylinderId}`));
		// 	await user.tab();

		// 	const actualDiverter = store.pvAndBatteries.diverters.data[0]!;

		// 	expect(actualDiverter.data.name).toBe("Diverter");
		// 	expect(actualDiverter.data.hotWaterCylinder).toBe(hotWaterCylinderId);		
		// });

		it("automatically saves updated from data to store", async () => {
			addHeatPumpAndHotWaterCylinder();
			store.$patch({
				pvAndBatteries: {
					diverters: {
						data: [{
							data: {
								name: "New diverter",
							},
						}],
					},
				},
			});

			await renderSuspended(Diverters);
			await user.clear(screen.getByTestId("name"));
			await user.type(screen.getByTestId("name"), "Updated diverter");
			await user.click(screen.getByTestId(`hotWaterCylinder_${hotWaterCylinderId}`));
			await user.tab();

			const actualDiverter = store.pvAndBatteries.diverters.data[0]!;

			expect(actualDiverter.data.name).toBe("Updated diverter");
			expect(actualDiverter.data.hotWaterCylinder).toBe(hotWaterCylinderId);
		});

		test("diverter and section are set as 'not complete' after user edits the diverter", async () => {
			store.$patch({
				pvAndBatteries: {
					diverters: {
						data: [{ ...diverter1, complete: true }],
						complete: true,
					},
				},
			});

			await renderSuspended(Diverters);
			await user.type(screen.getByTestId("name"), "Updated diverter");
			await user.tab();

			const diverters = store.pvAndBatteries.diverters;

			expect(diverters.complete).toBe(false);
			expect(diverters.data[0]!.complete).toBe(undefined);
		});
	});
});