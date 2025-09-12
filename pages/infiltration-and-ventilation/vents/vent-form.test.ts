import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import Vent from "./[vent].vue";
import type { VentData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("vent", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: VentData = {
		name: "Vent 1",
		typeOfVent: "trickle",
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
		orientation: 0,
		pitch: 0,
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Vent 1");
		await user.click(screen.getByTestId("typeOfVent_trickle"));
		await user.type(screen.getByTestId("effectiveVentilationArea"), "10");
		await user.type(screen.getByTestId("midHeightOfZone"), "1");
		await user.type(screen.getByTestId("orientation"), "0");
		await user.type(screen.getByTestId("pitch"), "0");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});
		
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));
		
		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data).toEqual(state);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: state }],
				},
			},
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: "0" },
			},
		});

		expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe("Vent 1");
		expect((await screen.findByTestId<HTMLInputElement>("typeOfVent_trickle")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("effectiveVentilationArea")).value).toBe("10");
		expect((await screen.findByTestId<HTMLInputElement>("midHeightOfZone")).value).toBe("1");
		expect((await screen.findByTestId<HTMLInputElement>("orientation")).value).toBe("0");
		expect((await screen.findByTestId<HTMLInputElement>("pitch")).value).toBe("0");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("name_error"))).toBeDefined();
		expect((await screen.findByTestId("typeOfVent_error"))).toBeDefined();
		expect((await screen.findByTestId("effectiveVentilationArea_error"))).toBeDefined();
		expect((await screen.findByTestId("midHeightOfZone_error"))).toBeDefined();
		expect((await screen.findByTestId("orientation_error"))).toBeDefined();
		expect((await screen.findByTestId("pitch_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("ventErrorSummary"))).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [{
						data: { ...state },
					}],
				},
			},
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: "0" },
			},
		});
	
		await user.clear(screen.getByTestId("name"));

		await user.type(screen.getByTestId("name"), "Vent 2");
		await user.click(screen.getByTestId("typeOfVent_airBrick"));
		await user.tab();

		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data.name).toBe("Vent 2");
		expect(data[0]?.data.typeOfVent).toBe("airBrick");
	});
	
	test("partial form data is saved automatically with default name to store when adding new heater", async () => {
		await renderSuspended(Vent, {
			route: {
				params: { vent: "create" },
			},
		});
		
		await user.click(screen.getByTestId("typeOfVent_airBrick"));
		await user.tab();

		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]?.data.name).toBe("Vent");
	});
});
