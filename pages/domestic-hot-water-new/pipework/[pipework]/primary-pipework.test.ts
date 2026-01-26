import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import PipeworkForm from "./index.vue";
import type { EcaasForm, PipeworkData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const pipework1: EcaasForm<PipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink",
		internalDiameter: 10,
		externalDiameter: 10,
		length: 3,
		insulationThickness: 5,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		location: "internal",
	},
};

const pipework2: EcaasForm<PipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink 2",
		internalDiameter: 11,
		externalDiameter: 11,
		length: 2,
		insulationThickness: 4,
		thermalConductivity: 1,
		surfaceReflectivity: true,
		pipeContents: "water",
		location: "internal",
	},
};

const store = useEcaasStore();
const user = userEvent.setup();

afterEach(() => {
	store.$reset();
});



const populateValidForm = async ({ reflectivity = true, location = "internal" }: { reflectivity?: boolean; location?: "internal" | "external" } = {}) => {
	await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
	await user.click(screen.getByTestId(`location_${location}`));
	await user.click(screen.getByTestId("pipeContents_water"));
	await user.type(screen.getByTestId("internalDiameter"), "10");
	await user.type(screen.getByTestId("externalDiameter"), "10");
	await user.type(screen.getByTestId("length"), "3");
	await user.type(screen.getByTestId("insulationThickness"), "5");
	await user.type(screen.getByTestId("thermalConductivity"), "1");
	await user.click(screen.getByTestId(`surfaceReflectivity_${reflectivity ? "yes" : "no"}`));
};

describe("Primary pipework form", () => {
	test.only("data is saved to store state when form is valid", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await populateValidForm();

		await (user.click(screen.getByTestId("saveAndComplete")));


		const { data } = store.domesticHotWaterNew.pipework;
		expect(data[0]).toEqual({
			...pipework1,
			complete: true,
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWaterNew: {
				pipework: {
					data: [pipework1],
				},
			},
		});

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Pipework Kitchen Sink");
		expect((await screen.findByTestId<HTMLInputElement>("internalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("externalDiameter")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("3");
		expect((await screen.findByTestId<HTMLInputElement>("insulationThickness")).value).toBe("5");
		expect((await screen.findByTestId<HTMLInputElement>("thermalConductivity")).value).toBe("1");
		expect((await screen.findByTestId("surfaceReflectivity_yes")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("pipeContents_water")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId("location_internal")).hasAttribute("checked")).toBe(true);
	});


	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PipeworkForm);

		await (user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
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
				params: { pipe: "create" },
			},
		});

		await (user.click(screen.getByTestId("saveAndComplete")));
		expect((await screen.findByTestId("pipeworkErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the pipework overview page", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveProgress"));
		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/pipework");
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
		const { data } = store.domesticHotWaterNew.pipework;

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
		const { data } = store.domesticHotWaterNew.pipework;

		expect(data[0]!.data.name).toBe("Primary pipework");
		expect(data[0]!.data.internalDiameter).toBe(10);
	});

	test("default name is used if name is added then deleted", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("internalDiameter"), "10"); // set another value on form in order to count as a partial we want to keep
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.clear(screen.getByTestId("name"));
		await user.tab();
		await user.click(screen.getByTestId("saveProgress"));

		const { data } = store.domesticHotWaterNew.pipework;

		expect(data[0]!.data.name).toBe("Primary pipework");
	});

	test("default name is used if name added is whitespace", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), " ");
		await user.click(screen.getByTestId("saveProgress"));


		expect(store.domesticHotWaterNew.pipework.data[0]!.data.name).toBe("Primary pipework");

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" },
			},
		});

		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), " ");
		await user.tab();

		expect(store.domesticHotWaterNew.pipework.data[0]!.data.name).toBe("Primary pipework");
	});

	test("creates a new primary pipework automatically when a user adds only the name value", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");

		await user.tab();
		const { data } = store.domesticHotWaterNew.pipework;

		expect(data[0]!.data.name).toBe("Pipework Kitchen Sink");
		expect(data[0]!.data.internalDiameter).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple primary pipeworks added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			domesticHotWaterNew: {
				pipework: {
					data: [pipework1, pipework2],
				},
			},
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
		const { data } = store.domesticHotWaterNew.pipework;

		expect(data[1]?.data.name).toBe("Pipework Kitchen Sink 2");
		expect(data[1]?.data.internalDiameter).toBe(1);
	});
});
