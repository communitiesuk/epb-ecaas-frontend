import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import MechanicalVentilationForm from "./[mechanical].vue";
import { userEvent } from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";

describe("mechanical ventilation form", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();
	const navigateToMock = vi.hoisted(() => vi.fn());

	const mechanicalVentilation1: MechanicalVentilationData = {
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDucwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: "reflective",
	};

	const mechanicalVentilation2: MechanicalVentilationData = {
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "intermittent",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14
	};

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	it("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions_mvhr is mvhr", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.type(screen.getByTestId("name"), "Mechanical name 1");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_mvhr")
		);
		await user.click(screen.getByTestId("controlForSupplyAirflow_load"));
		await user.click(screen.getByTestId("supplyAirTemperatureControl_odaComp"));
		await user.type(screen.getByTestId("airFlowRate"), "12");
		await user.click(screen.getByTestId("mvhrLocation_inside"));
		await user.type(screen.getByTestId("mvhrEfficiency"), "0.2");
		await user.click(
			screen.getByTestId("ductworkCrossSectionalShape_circular")
		);
		await user.click(screen.getByTestId("ductType_intake"));
		await user.type(screen.getByTestId("internalDiameterOfDuctwork"), "300");
		await user.type(screen.getByTestId("externalDiameterOfDuctwork"), "1000");
		await user.type(screen.getByTestId("insulationThickness"), "100");
		await user.type(screen.getByTestId("lengthOfDucwork"), "100");
		await user.type(
			screen.getByTestId("thermalInsulationConductivityOfDuctwork"),
			"10"
		);
		await user.click(screen.getByTestId("surfaceReflectivity_reflective"));
		await user.click(screen.getByRole("button"));

		const { data, complete } = store.infiltrationAndVentilation.mechanicalVentilation;

		expect(complete).toBe(true);
		expect(data[0]).toEqual(mechanicalVentilation1);
		expect(navigateToMock).toHaveBeenCalledWith(
			"/infiltration-and-ventilation/mechanical-ventilation"
		);
	});

	it("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is not mvhr", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.type(screen.getByTestId("name"), "Mechanical name 2");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_intermittent")
		);
		await user.click(screen.getByTestId("controlForSupplyAirflow_oda"));
		await user.click(screen.getByTestId("supplyAirTemperatureControl_odaComp"));
		await user.type(screen.getByTestId("airFlowRate"), "14");

		await user.click(screen.getByRole("button"));

		await waitFor(() => {
			const { data, complete } = store.infiltrationAndVentilation.mechanicalVentilation;
			expect(complete).toBe(true);
			expect(data[0]).toEqual(mechanicalVentilation2);
			expect(navigateToMock).toHaveBeenCalledWith(
				"/infiltration-and-ventilation/mechanical-ventilation"
			);
		});
	});

	it("data is saved to correct object in store state when form is valid", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1, mechanicalVentilation2]
				},
			},
		});

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "1" },
			},
		});

		await user.tab();
		await user.clear(screen.getByTestId("name"));
		await user.type(screen.getByTestId("name"), "new name");
		await user.tab();
		await user.click(screen.getByRole("button"));

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

		expect(data[0]).toEqual(mechanicalVentilation1);
		expect(data[1].name).toBe("new name");
	});

	it("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1]
				},
			},
		});

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "0" },
			},
		});
		
		expect(
			((await screen.findByTestId("name")) as HTMLInputElement).value
		).toBe("Mechanical name 1");
		expect(
			(
				(await screen.findByTestId(
					"typeOfMechanicalVentilationOptions_mvhr"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			(
				(await screen.findByTestId(
					"controlForSupplyAirflow_load"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			(
				(await screen.findByTestId(
					"supplyAirTemperatureControl_odaComp"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			((await screen.findByTestId("airFlowRate")) as HTMLInputElement).value
		).toBe("12");
		expect(
			((await screen.findByTestId("mvhrLocation_inside")) as HTMLInputElement)
				.checked
		).toBe(true);
		expect(
			((await screen.findByTestId("mvhrEfficiency")) as HTMLInputElement).value
		).toBe("0.2");
		expect(
			(
				(await screen.findByTestId(
					"ductworkCrossSectionalShape_circular"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			((await screen.findByTestId("ductType_intake")) as HTMLInputElement)
				.checked
		).toBe(true);
		expect(
			(
				(await screen.findByTestId(
					"internalDiameterOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("300");
		expect(
			(
				(await screen.findByTestId(
					"externalDiameterOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("1000");
		expect(
			((await screen.findByTestId("insulationThickness")) as HTMLInputElement)
				.value
		).toBe("100");
		expect(
			((await screen.findByTestId("lengthOfDucwork")) as HTMLInputElement).value
		).toBe("100");
		expect(
			(
				(await screen.findByTestId(
					"thermalInsulationConductivityOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("10");
		expect(
			(
				(await screen.findByTestId(
					"surfaceReflectivity_reflective"
				)) as HTMLInputElement
			).checked
		).toBe(true);
	});

	it("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.click(screen.getByRole("button"));

		const initialErrorIds: string[] = [
			"name_error",
			"typeOfMechanicalVentilationOptions_error",
			"controlForSupplyAirflow_error",
			"supplyAirTemperatureControl_error",
			"airFlowRate_error",
		];
		for (const error in initialErrorIds) {
			const initialErrors = screen.getByTestId(initialErrorIds[error]);
			expect(initialErrors).toBeDefined();
		}
		const mvhrErrorIds: string[] = [
			"mvhrLocation_error",
			"mvhrEfficiency_error",
			"ductworkCrossSectionalShape_error",
			"ductType_error",
			"internalDiameterOfDuctwork_error",
			"externalDiameterOfDuctwork_error",
			"insulationThickness_error",
			"lengthOfDucwork_error",
			"thermalInsulationConductivityOfDuctwork_error",
			"surfaceReflectivity_error",
		];

		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_mvhr")
		);
		await user.click(screen.getByRole("button"));

		for (const error in mvhrErrorIds) {
			const mhvrErrors = screen.getByTestId(mvhrErrorIds[error]);
			expect(mhvrErrors).toBeDefined();
		}
	});

	it("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.click(screen.getByRole("button"));

		expect(
			await screen.findByTestId("mechanicalVentilationErrorSummary")
		).toBeDefined();
	});
});
