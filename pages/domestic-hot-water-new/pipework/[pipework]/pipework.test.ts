import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import PipeworkForm from "./index.vue";
import type { EcaasForm, PipeworkData } from "~/stores/ecaasStore.schema";
import { litre } from "~/utils/units/volume";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const hotWaterCylinderId = "4ea2b8f5-5f4c-4d3a-9f0b-123456789abc";
const smartHotWaterTankId = "4ea2b8f5-5f4c-4d3a-9f0b-123456789abc";

const hotWaterCylinder: EcaasForm<HotWaterCylinderDataNew> = {
	data: {
		name: "Hot water cylinder 1",
		id: hotWaterCylinderId,
		typeOfWaterStorage: "hotWaterCylinder",
		storageCylinderVolume: unitValue(5, litre),
		initialTemperature: 60,
		dailyEnergyLoss: 1,
		dhwHeatSourceId: "12345678-1234-1234-1234-123456789abc",
		areaOfHeatExchanger: 1000,
		heaterPosition: 0.8,
		thermostatPosition: 0.5,
	},
};

const pipework1: EcaasForm<PipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink",
		waterStorage: hotWaterCylinderId,
		internalDiameter: 10,
		externalDiameter: 10,
		length: 3,
		insulationThickness: 5,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		location: "heatedSpace",
	},
};

const pipework2: EcaasForm<PipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink 2",
		waterStorage: smartHotWaterTankId,
		internalDiameter: 11,
		externalDiameter: 11,
		length: 2,
		insulationThickness: 4,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		location: "heatedSpace",
	},
};

const store = useEcaasStore();
const user = userEvent.setup();

afterEach(() => {
	store.$reset();
});


const populateValidForm = async (pipework: EcaasForm<PipeworkData>) => {
	await user.type(screen.getByTestId("name"), pipework.data.name);
	await user.click(screen.getByTestId("waterStorage_" + pipework.data.waterStorage));
	await user.type(screen.getByTestId("internalDiameter"), pipework.data.internalDiameter.toString());
	await user.type(screen.getByTestId("externalDiameter"), pipework.data.externalDiameter.toString());
	await user.type(screen.getByTestId("length"), pipework.data.length.toString());
	await user.type(screen.getByTestId("insulationThickness"), pipework.data.insulationThickness.toString());
	await user.type(screen.getByTestId("thermalConductivity"), pipework.data.thermalConductivity.toString());
	await user.click(screen.getByTestId("surfaceReflectivity_" + (pipework.data.surfaceReflectivity ? "yes" : "no")));
	await user.click(screen.getByTestId("pipeContents_" + pipework.data.pipeContents));
	await user.click(screen.getByTestId("location_" + pipework.data.location));
};

describe("Pipework form", () => {

	test("data is saved to store state when form is valid", async () => {
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [
						{ ...hotWaterCylinder },
					],
				},
			},
		});
		
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});
		
		await populateValidForm(pipework1);

		await(user.click(screen.getByTestId("saveAndComplete")));


		const pipeworkItem = store.domesticHotWater.pipework.data[0];
		expect(pipeworkItem).toEqual({
			...pipework1,
			complete: true,
		});
	});

	test("form is prepopulated when data exists in state", async () => {

		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [
						{ ...hotWaterCylinder },
					],
				},
				pipework: {
					data: [pipework1],
				},
			},
		});

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Pipework Kitchen Sink");
		expect((await screen.findByTestId("waterStorage_" + pipework1.data.waterStorage)).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("internalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("externalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("3");
		expect((await screen.findByTestId<HTMLInputElement>("insulationThickness")).value).toBe("5");
		expect((await screen.findByTestId<HTMLInputElement>("thermalConductivity")).value).toBe("1");
		expect((await screen.findByTestId("surfaceReflectivity_yes")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pipeContents_water")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("location_heatedSpace")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PipeworkForm);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("waterStorage_error"))).toBeDefined();
		expect((await screen.findByTestId("internalDiameter_error"))).toBeDefined();
		expect((await screen.findByTestId("externalDiameter_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
		expect((await screen.findByTestId("insulationThickness_error"))).toBeDefined();
		expect((await screen.findByTestId("thermalConductivity_error"))).toBeDefined();
		expect((await screen.findByTestId("surfaceReflectivity_error"))).toBeDefined();
		expect((await screen.findByTestId("pipeContents_error"))).toBeDefined();
		expect((await screen.findByTestId("location_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await(user.click(screen.getByTestId("saveAndComplete")));
		expect((await screen.findByTestId("pipeworkErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the domestic hot water overview page", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});
		const saveProgressButton = screen.getByTestId<HTMLAnchorElement>("saveProgress");
		expect(saveProgressButton.getAttribute("href")).toBe("/domestic-hot-water-new");
	});
});

describe("partially saving data", () => {
	test("form data is automatically saved to store", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.type(screen.getByTestId("internalDiameter"), "10");
		await user.tab();
		const pipeworkItem = store.domesticHotWater.pipework.data[0];

		expect(pipeworkItem?.data.name).toBe("Pipework Kitchen Sink");
		expect(pipeworkItem?.data.internalDiameter).toBe(10);
	});

	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await user.type(screen.getByTestId("internalDiameter"), "10");
		await user.tab();
		const pipeworkItem = store.domesticHotWater.pipework.data[0];

		expect(pipeworkItem?.data.name).toBe("Pipework");
		expect(pipeworkItem?.data.internalDiameter).toBe(10);
	});

	test("default name is used if name is added then deleted", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await user.type(screen.getByTestId("internalDiameter"), "10"); // set another value on form in order to count as a partial we want to keep
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByTestId("saveProgress"));

		const pipeworkItem = store.domesticHotWater.pipework.data[0];
	
		expect(pipeworkItem?.data.name).toBe("Pipework");
	});

	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));

		expect(store.domesticHotWater.pipework.data[0]!.data.name).toBe("Pipework");
	});

	test("creates a new pipework automatically when a user adds only the name value", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");

		await user.tab();
		const pipeworkItem = store.domesticHotWater.pipework.data[0];
		expect(pipeworkItem!.data.name).toBe("Pipework Kitchen Sink");
		expect(pipeworkItem!.data.internalDiameter).toBeUndefined();

	});

	test("updated form data is automatically saved to the correct store object when there are multiple pipeworks added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			domesticHotWater: {
				pipework: {
					data: [pipework1, pipework2],
				},
			},
		});    
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipework: "1" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("internalDiameter"));
		
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink 2");
		await user.type(screen.getByTestId("internalDiameter"), "1");
		await user.tab();
		const { data } = store.domesticHotWater.pipework;

		expect(data[1]?.data.name).toBe("Pipework Kitchen Sink 2");
		expect(data[0]?.data.name).toBe("Pipework Kitchen Sink");

		expect(data[1]?.data.internalDiameter).toBe(1);
		expect(data[0]?.data.internalDiameter).toBe(10);

	});
});
