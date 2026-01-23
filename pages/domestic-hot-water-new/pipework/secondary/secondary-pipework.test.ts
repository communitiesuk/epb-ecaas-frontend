import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import PipeworkForm from "./[pipe].vue";
import type { SecondaryPipeworkData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const store = useEcaasStore();
const user = userEvent.setup();

afterEach(() => {
	store.$reset();
});

const pipework1: EcaasForm<SecondaryPipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink",
		length: 3,
		location: "internal",
		internalDiameter: 9,
	}, 
	complete: true,
};
const pipework2: EcaasForm<SecondaryPipeworkData> = {
	data: {
		name: "Pipework Kitchen Sink 2",
		length: 1,
		location: "internal",
		internalDiameter: 4,
	},
	complete: true,

};
describe("Secondary pipework form", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});
	
	const pipework1: EcaasForm<SecondaryPipeworkData> = {
		data: {
			name: "Pipework Kitchen Sink",
			length: 3,
			location: "internal",
			internalDiameter: 9,
		}, 
		complete: true,
	};

	test("data is saved to store state when form is valid", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
		await user.click(screen.getByTestId("location_internal"));
		await user.type(screen.getByTestId("length"), "3");
		await user.type(screen.getByTestId("internalDiameter"), "9");
		
		await user.tab();
		
		await(user.click(screen.getByTestId("saveAndComplete")));

		const { data } = store.domesticHotWater.pipework.secondaryPipework;

		expect(data[0]).toEqual(pipework1);
		expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water/pipework");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			domesticHotWater: {
				pipework: {
					secondaryPipework: {
						data: [pipework1],
					},
				},
			},
		});

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Pipework Kitchen Sink");
		expect((await screen.findByTestId("location_internal")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("length")).value).toBe("3");
		expect((await screen.findByTestId<HTMLInputElement>("internalDiameter")).value).toBe("9");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(PipeworkForm);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("location_error"))).toBeDefined();
		expect((await screen.findByTestId("length_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(PipeworkForm);

		await(user.click(screen.getByTestId("saveAndComplete")));

		expect((await screen.findByTestId("pipeworkErrorSummary"))).toBeDefined();
	});

	test("save progress button navigates user to the pipework overview page", async () => {

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});

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
		await user.click(screen.getByTestId("location_internal"));
		await user.tab();
		const { data } = store.domesticHotWater.pipework.secondaryPipework;
	
		expect(data[0]!.data.name).toBe("Pipework Kitchen Sink");
		expect(data[0]!.data.location).toBe("internal");
	});
	
	test("partial form data automatically saved to store with default name if no name has been added", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});
		await user.click(screen.getByTestId("location_internal"));
		await user.tab();
		const { data } = store.domesticHotWater.pipework.secondaryPipework;
	
		expect(data[0]!.data.name).toBe("Secondary pipework");
		expect(data[0]!.data.location).toBe("internal");
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

		const { data } = store.domesticHotWater.pipework.secondaryPipework;
	
		expect(data[0]!.data.name).toBe("Secondary pipework");
	});
	

	test("creates a new secondary pipework automatically when a user adds only the name value", async () => {
		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: "create" },
			},
		});
	
		await user.type(screen.getByTestId("name"), "Pipework Kitchen Sink");
	
		await user.tab();
		const { data } = store.domesticHotWater.pipework.secondaryPipework;
	
		expect(data[0]!.data.name).toBe("Pipework Kitchen Sink");
		expect(data[0]!.data.internalDiameter).toBeUndefined();
	});
	
	test("updated form data is automatically saved to the correct store object when there are multiple secondary pipeworks added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
	
		store.$patch({
			domesticHotWater: {
				pipework: {
					secondaryPipework: {
						data: [pipework1, pipework2],
					},
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
		await user.click(screen.getByTestId("location_internal"));

		await user.tab();
		const { data } = store.domesticHotWater.pipework.secondaryPipework;
	
		expect(data[1]?.data.name).toBe("Pipework Kitchen Sink 2");
		expect(data[1]?.data.location).toBe("internal");
	});
});
