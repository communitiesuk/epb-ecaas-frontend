import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import PipeworkForm from "./[pipe].vue";
import WaterHeatingForm from "../../water-heating/index.vue";
import type { PrimaryPipeworkData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const hotWaterCylinderId = "c84528bb-f805-4f1e-95d3-2bd17384fdbe";

const pipework1: EcaasForm<PrimaryPipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink",
		internalDiameter: 10,
		externalDiameter: 10,
		length: 3,
		insulationThickness: 5,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		hotWaterCylinder: hotWaterCylinderId,
		location: "internal"
	}
};

const pipework2: EcaasForm<PrimaryPipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink 2",
		internalDiameter: 11,
		externalDiameter: 11,
		length: 2,
		insulationThickness: 4,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		hotWaterCylinder: hotWaterCylinderId,
		location: "internal"
	}
};

const store = useEcaasStore();
const user = userEvent.setup();

afterEach(() => {
	store.$reset();
});

const addHotWaterCylinder = () => {
	store.$patch({
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						id: hotWaterCylinderId,
						name: "Hot water cylinder 1",
						storageCylinderVolume: 5,
						dailyEnergyLoss: 1,
						heatSource: "463c94f6-566c-49b2-af27-57e5c68b5c30"
					}]
				}
			}
		}
	});
};

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
	await user.type(screen.getByTestId("internalDiameter"), "10");
	await user.type(screen.getByTestId("externalDiameter"), "10");
	await user.type(screen.getByTestId("length"), "3");
	await user.type(screen.getByTestId("insulationThickness"), "5");
	await user.type(screen.getByTestId("thermalConductivity"), "1");
	await user.click(screen.getByTestId("surfaceReflectivity_yes"));
	await user.click(screen.getByTestId("pipeContents_water"));
	await user.click(screen.getByTestId(`hotWaterCylinder_${hotWaterCylinderId}`));
	await user.click(screen.getByTestId("location_internal"));
};

describe("Primary pipework form", () => {

	test("data is saved to store state when form is valid", async () => {
		addHotWaterCylinder();
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await populateValidForm();

		await(user.click(screen.getByTestId("saveAndComplete")));


		const { data } = store.domesticHotWater.pipework.primaryPipework;
		expect(data[0]).toEqual({
			...pipework1,
			complete: true,
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		addHotWaterCylinder();

		store.$patch({
			domesticHotWater: {
				pipework: {
					primaryPipework: {
						data: [pipework1]
					}
				}
			}
		});

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" }
			}
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Pipework Kitchen Sink");
		expect((await screen.findByTestId<HTMLInputElement>("internalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("externalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("3");
		expect((await screen.findByTestId<HTMLInputElement>("insulationThickness")).value).toBe("5");
		expect((await screen.findByTestId<HTMLInputElement>("thermalConductivity")).value).toBe("1");
		expect((await screen.findByTestId("surfaceReflectivity_yes")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pipeContents_water")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId(`hotWaterCylinder_${hotWaterCylinderId}`)).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("location_internal")).hasAttribute("checked")).toBe(true);
	});

	test("hot water cylinder option remains checked on pipework page when user re-saves the hot water cylinder form (Water heating)", async () => {
		addHotWaterCylinder();

		store.$patch({
			domesticHotWater: {
				pipework: {
					primaryPipework: {
						data: [pipework1]
					}
				}
			}
		});

		await renderSuspended(WaterHeatingForm); 
		await(user.click(screen.getByTestId("saveAndComplete")));

		expect(store.domesticHotWater.pipework.primaryPipework.data[0]?.data.hotWaterCylinder).toBe(store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]!.id);
		
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" }
			}
		});
		expect((await screen.findByTestId(`hotWaterCylinder_${hotWaterCylinderId}`)).hasAttribute("checked")).toBe(true);
	});	

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PipeworkForm);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("internalDiameter_error"))).toBeDefined();
		expect((await screen.findByTestId("externalDiameter_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
		expect((await screen.findByTestId("insulationThickness_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalConductivity_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceReflectivity_error"))).toBeDefined();
		expect((await screen.findByTestId("pipeContents_error"))).toBeDefined();
		expect((await screen.findByTestId("hotWaterCylinder_error"))).toBeDefined();
		expect((await screen.findByTestId("location_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" }
			}
		});

		await(user.click(screen.getByTestId("saveAndComplete")));
		expect((await screen.findByTestId("pipeworkErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the pipework overview page", async () => {
		addHotWaterCylinder();
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});
		await populateValidForm();
		const saveProcess = screen.getByRole("button", { name: "Save progress" });

		expect(saveProcess.getAttribute("href")).toBe("/domestic-hot-water/pipework");
	});
});

describe("partially saving data", () => {
	test("form data is automatically saved to store", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.type(screen.getByTestId("internalDiameter"), "10");
		await user.tab();
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[0]!.data.name).toBe("Pipework Kitchen Sink");
		expect(data[0]!.data.internalDiameter).toBe(10);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("internalDiameter"), "10");
		await user.tab();
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[0]!.data.name).toBe("Primary pipework");
		expect(data[0]!.data.internalDiameter).toBe(10);
	});

	test("default name is used if name is added then deleted", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByRole("button", { name: "Save progress" }));

		const { data } = store.domesticHotWater.pipework.primaryPipework;
	
		expect(data[0]!.data.name).toBe("Primary pipework");
	});

	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByRole("button", { name: "Save progress" }));

		
		expect(store.domesticHotWater.pipework.primaryPipework.data[0]!.data.name).toBe("Primary pipework");

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();
		
		expect(store.domesticHotWater.pipework.primaryPipework.data[0]!.data.name).toBe("Primary pipework");
	});

	test("creates a new primary pipework automatically when a user adds only the name value", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");

		await user.tab();
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[0]!.data.name).toBe("Pipework Kitchen Sink");
		expect(data[0]!.data.internalDiameter).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple primary pipeworks added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
		addHotWaterCylinder();

		store.$patch({
			domesticHotWater: {
				pipework: {
					primaryPipework: {
						data: [pipework1, pipework2]
					}
				}
			}
		});    
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "1" },
			},
		});

					
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("internalDiameter"));
		
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink 2");
		await user.type(screen.getByTestId("internalDiameter"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[1]?.data.name).toBe("Pipework Kitchen Sink 2");
		expect(data[1]?.data.internalDiameter).toBe(1);
	});
});
