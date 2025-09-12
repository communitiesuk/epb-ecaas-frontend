import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import MechanicalVentilationForm from "./[mechanical].vue";
import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units/types";

describe("mechanical ventilation form", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();
	
	const navigateToMock = vi.hoisted(() => vi.fn());
	vi.mock("uuid");

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "MVHR",
		airFlowRate: unitValue(12, litrePerSecond),
		mvhrLocation: "inside",
		mvhrEfficiency: 0.2,
	};

	const mechanicalVentilation2: MechanicalVentilationData = {
		id: "7184f2fe-a78f-4a56-ba5a-1a7751ac506d",
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "Intermittent MEV",
		airFlowRate: unitValue(14, litrePerSecond),
	};

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions_MVHR is MVHR", async () => {
		vi.mocked(uuidv4).mockReturnValue("5124f2fe-f15b-4a56-ba5a-1a7751ac506f" as unknown as Buffer);

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Mechanical name 1");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_MVHR"),
		);
		await user.type(screen.getByTestId("airFlowRate"), "12");
		await user.click(screen.getByTestId("mvhrLocation_inside"));
		await user.type(screen.getByTestId("mvhrEfficiency"), "0.2");
		await user.tab();

		await user.click(screen.getByTestId("saveAndComplete"));
		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(data[0]?.data).toEqual(mechanicalVentilation1);
		expect(navigateToMock).toHaveBeenCalledWith(
			"/infiltration-and-ventilation/mechanical-ventilation",
		);
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is not mvhr", async () => {
		vi.mocked(uuidv4).mockReturnValue("7184f2fe-a78f-4a56-ba5a-1a7751ac506d" as unknown as Buffer);

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Mechanical name 2");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Intermittent_MEV"),
		);
		await user.type(screen.getByTestId("airFlowRate"), "14");

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

		expect(data[0]?.data).toEqual(mechanicalVentilation2);
		expect(navigateToMock).toHaveBeenCalledWith(
			"/infiltration-and-ventilation/mechanical-ventilation",
		);
	});

	test("data is saved to correct object in store state when form is valid", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						data: mechanicalVentilation1,
					}, {
						data: mechanicalVentilation2,
					}],
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
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

		expect(data[0]?.data).toEqual(mechanicalVentilation1);
		expect(data[1]?.data.name).toBe("new name");
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						data: mechanicalVentilation1,
					}],
				},
			},
		});

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "0" },
			},
		});

		expect(
			((await screen.findByTestId<HTMLInputElement>("name"))).value,
		).toBe("Mechanical name 1");
		expect(
			(
				(await screen.findByTestId<HTMLInputElement>(
					"typeOfMechanicalVentilationOptions_MVHR",
				))
			).checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("airFlowRate"))).value,
		).toBe("12");
		expect(
			((await screen.findByTestId<HTMLInputElement>("mvhrLocation_inside")))
				.checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("mvhrEfficiency"))).value,
		).toBe("0.2");
   
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.click(screen.getByTestId("saveAndComplete"));

		const initialErrorIds: string[] = [
			"name_error",
			"typeOfMechanicalVentilationOptions_error",
			"airFlowRate_error",
		];
		for (const error of initialErrorIds) {
			expect(screen.getByTestId(error)).toBeDefined();
		}
		const mvhrErrorIds: string[] = [
			"mvhrLocation_error",
			"mvhrEfficiency_error",
		];

		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_MVHR"),
		);
		await user.click(screen.getByTestId("saveAndComplete"));

		for (const error of mvhrErrorIds) {
			const mhvrErrors = screen.getByTestId(error);
			expect(mhvrErrors).toBeDefined();
		}
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(MechanicalVentilationForm);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(
			await screen.findByTestId("mechanicalVentilationErrorSummary"),
		).toBeDefined();
	});
});
