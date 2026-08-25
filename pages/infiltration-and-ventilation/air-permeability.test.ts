import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import type { AirPermeabilityData } from "~/stores/ecaasStore.schema";
import AirPermeability from "./air-permeability.vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Air permeability", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: AirPermeabilityData = {
		testPressure: "Pulse test only",
		airTightnessTestResult: 1,
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("testPressure_Pulse_test_only"));
		await user.type(screen.getByTestId("airTightnessTestResult"), "1");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(AirPermeability);

		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.infiltrationAndVentilation.airPermeability;
		
		expect(data).toEqual(state);
	});

	test("partial form data is automatically saved to store", async () => {
		await renderSuspended(AirPermeability);

		await user.click(screen.getByTestId("testPressure_Pulse_test_only"));
		await user.tab();

		const { data, complete } = store.infiltrationAndVentilation.airPermeability;
		
		expect(data.testPressure).toBe("Pulse test only");
		expect(complete).toBe(false);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					data: state,
				},
			},
		});

		await renderSuspended(AirPermeability);

		expect((await screen.findByTestId("testPressure_Pulse_test_only")).hasAttribute("checked")).toBe(true);
		expect((await screen.findByTestId<HTMLInputElement>("airTightnessTestResult")).value).toBe("1");
	});
		
	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(AirPermeability);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("testPressure_error"))).toBeDefined();
		expect((await screen.findByTestId("airTightnessTestResult_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(AirPermeability);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("airPermeabilityErrorSummary"))).toBeDefined();
	});

	test("navigates to infiltration and ventilation page when valid form is completed", async () => {
		await renderSuspended(AirPermeability);
	
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { complete } = store.infiltrationAndVentilation.airPermeability;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith("/infiltration-and-ventilation");
	});

	test("shows smart air bricks open during air tightness test field if smart air bricks set to true for suspended floors", async () => {
		const groundFloorWithSuspendedFloor: Partial<GroundFloorData> = {
			typeOfGroundFloor: "Suspended_floor",
			smartAirBricks: true,
		};
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{ data: groundFloorWithSuspendedFloor, complete: true }],
					},
				},
			},
		});

		await renderSuspended(AirPermeability);
		expect(await screen.findByTestId("smartAirBricksOpen")).toBeDefined();
	});

	test("does not show smart air bricks open during air tightness test field if smart air bricks are false", async () => {
		const groundFloorWithFixedAirBricks: Partial<GroundFloorData> = {
			typeOfGroundFloor: "Suspended_floor",
			smartAirBricks: false,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{ data: groundFloorWithFixedAirBricks, complete: true }],
					},
				},
			},
		});

		await renderSuspended(AirPermeability);

		expect(screen.queryByTestId("smartAirBricksOpen")).toBeNull();
	});
});
