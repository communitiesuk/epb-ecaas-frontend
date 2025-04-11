import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import MechanicalVentilationForm from "./[mechanical].vue";
import { userEvent } from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import { v4 as uuidv4 } from 'uuid';

describe("mechanical ventilation form", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();
	
	const navigateToMock = vi.hoisted(() => vi.fn());
	vi.mock('uuid');

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "mvhr",
		controlForSupplyAirflow: "load",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 12,
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
	};

	const mechanicalVentilation2: MechanicalVentilationData = {
		id: '7184f2fe-a78f-4a56-ba5a-1a7751ac506d',
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "intermittent",
		controlForSupplyAirflow: "oda",
		supplyAirTemperatureControl: "odaComp",
		airFlowRate: 14,
	};

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	it("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions_mvhr is mvhr", async () => {
		vi.mocked(uuidv4).mockReturnValue('5124f2fe-f15b-4a56-ba5a-1a7751ac506f' as unknown as Buffer);

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

		await user.click(screen.getByRole("button"));
		const { data, complete } =
      store.infiltrationAndVentilation.mechanicalVentilation;
		expect(complete).toBe(true);
		expect(data[0]).toEqual(mechanicalVentilation1);
		expect(navigateToMock).toHaveBeenCalledWith(
			"/infiltration-and-ventilation/mechanical-ventilation"
		);
	});

	it("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is not mvhr", async () => {
		vi.mocked(uuidv4).mockReturnValue('7184f2fe-a78f-4a56-ba5a-1a7751ac506d' as unknown as Buffer);

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
			const { data, complete } =
        store.infiltrationAndVentilation.mechanicalVentilation;
			expect(complete).toBe(true);
			expect(data[0]).toEqual(mechanicalVentilation2);
			expect(navigateToMock).toHaveBeenCalledWith(
				"/infiltration-and-ventilation/mechanical-ventilation"
			);
		});
	});

	it("data is saved to correct object in store state when form is valid", async () => {
		vi.mocked(uuidv4).mockReturnValue('mechanicalVentilation1' as unknown as Buffer);

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1, mechanicalVentilation2],
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
					data: [mechanicalVentilation1],
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
