import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import MechanicalVentilationForm from "./[mechanical]/index.vue";
import { userEvent } from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units";

describe("mechanical ventilation form", () => {
	const user = userEvent.setup();
	const store = useEcaasStore();

	const navigateToMock = vi.hoisted(() => vi.fn());
	vi.mock("uuid");

	const mechanicalVentilation1: Partial<MechanicalVentilationData> = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: "MVHR",
		measuredFanPowerAndAirFlowRateKnown: true,
		measuredFanPower: 40,
		measuredAirFlowRate: 10,
		airFlowRate: unitValue(12, litrePerSecond),
		mvhrLocation: "inside",
		pitch: 90,
		orientation: 90,
		installedUnderApprovedScheme: true,
		midHeightOfAirFlowPathForExhaust: 1.5,
		orientationOfExhaust: 90,
		pitchOfExhaust: 30,
		midHeightOfAirFlowPathForIntake: 1.5,
		orientationOfIntake: 80,
		pitchOfIntake: 10,
	};

	const mechanicalVentilation2: Partial<MechanicalVentilationData> = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: "Intermittent MEV",
		airFlowRate: unitValue(14, litrePerSecond),
		specificFanPower: 40,
		pitch: 90,
		orientation: 90,
		midHeightOfAirFlowPath: 2,
	};

	const mechanicalVentilation3: Partial<MechanicalVentilationData> = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 3",
		typeOfMechanicalVentilationOptions: "Centralised continuous MEV",
		measuredFanPowerAndAirFlowRateKnown: true,
		measuredFanPower: 20,
		measuredAirFlowRate: 12,
		airFlowRate: unitValue(14, litrePerSecond),
		pitch: 90,
		orientation: 90,
		midHeightOfAirFlowPath: 2,
		installedUnderApprovedScheme: true,
	};

	const mechanicalVentilation4: Partial<MechanicalVentilationData> = {
		id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		name: "Mechanical name 4",
		typeOfMechanicalVentilationOptions: "Decentralised continuous MEV",
		installationType: "in_ceiling",
		installationLocation: "kitchen",
		airFlowRate: unitValue(14, litrePerSecond),
		pitch: 90,
		orientation: 90,
		midHeightOfAirFlowPath: 2,
		installedUnderApprovedScheme: true,
	};

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is MVHR", async () => {
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
		await user.click(screen.getByTestId("measuredFanPowerAndAirFlowRateKnown_yes"));
		await user.type(screen.getByTestId("measuredFanPower"), "40");
		await user.type(screen.getByTestId("measuredAirFlowRate"), "10");
		await user.type(screen.getByTestId("airFlowRate"), "12");
		await user.click(screen.getByTestId("mvhrLocation_inside"));
		await user.type(screen.getByTestId("orientation"), "90");
		await user.type(screen.getByTestId("pitch"), "90");
		await user.click(screen.getByTestId("installedUnderApprovedScheme_yes"));
		await user.type(screen.getByTestId("midHeightOfAirFlowPathForIntake"), "1.5");
		await user.type(screen.getByTestId("orientationOfIntake"), "80");
		await user.type(screen.getByTestId("pitchOfIntake"), "10");
		await user.type(screen.getByTestId("midHeightOfAirFlowPathForExhaust"), "1.5");
		await user.type(screen.getByTestId("orientationOfExhaust"), "90");
		await user.type(screen.getByTestId("pitchOfExhaust"), "30");
		await user.tab();

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(data[0]?.data).toEqual(expect.objectContaining(mechanicalVentilation1));
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is Intermittent MEV", async () => {
		vi.mocked(uuidv4).mockReturnValue("5124f2fe-f15b-4a56-ba5a-1a7751ac506f" as unknown as Buffer);

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Mechanical name 2");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Intermittent_MEV"),
		);
		await user.type(screen.getByTestId("specificFanPower"), "40");
		await user.type(screen.getByTestId("airFlowRate"), "14");
		await user.type(screen.getByTestId("orientation"), "90");
		await user.type(screen.getByTestId("pitch"), "90");
		await user.type(screen.getByTestId("midHeightOfAirFlowPath"), "2");
		await user.tab();

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(data[0]?.data).toEqual(expect.objectContaining(mechanicalVentilation2));
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is Centralised continuous MEV", async () => {
		vi.mocked(uuidv4).mockReturnValue("5124f2fe-f15b-4a56-ba5a-1a7751ac506f" as unknown as Buffer);

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Mechanical name 3");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Centralised_continuous_MEV"),
		);
		await user.click(screen.getByTestId("measuredFanPowerAndAirFlowRateKnown_yes"));
		await user.type(screen.getByTestId("measuredFanPower"), "20");
		await user.type(screen.getByTestId("measuredAirFlowRate"), "12");
		await user.type(screen.getByTestId("airFlowRate"), "14");
		await user.type(screen.getByTestId("orientation"), "90");
		await user.type(screen.getByTestId("pitch"), "90");
		await user.type(screen.getByTestId("midHeightOfAirFlowPath"), "2");
		await user.click(screen.getByTestId("installedUnderApprovedScheme_yes"));
		await user.tab();

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(data[0]?.data).toEqual(expect.objectContaining(mechanicalVentilation3));
	});

	test("data is saved to store state when form is valid and typeOfMechanicalVentilationOptions is Decentralised continuous MEV", async () => {
		vi.mocked(uuidv4).mockReturnValue("5124f2fe-f15b-4a56-ba5a-1a7751ac506f" as unknown as Buffer);

		await renderSuspended(MechanicalVentilationForm, {
			route: {
				params: { mechanical: "create" },
			},
		});

		await user.type(screen.getByTestId("name"), "Mechanical name 4");
		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Decentralised_continuous_MEV"),
		);
		await user.type(screen.getByTestId("airFlowRate"), "14");
		await user.click(screen.getByTestId("installationType_in_ceiling"));
		await user.click(screen.getByTestId("installationLocation_kitchen"));
		await user.type(screen.getByTestId("orientation"), "90");
		await user.type(screen.getByTestId("pitch"), "90");
		await user.type(screen.getByTestId("midHeightOfAirFlowPath"), "2");
		await user.click(screen.getByTestId("installedUnderApprovedScheme_yes"));
		await user.tab();

		const { data } = store.infiltrationAndVentilation.mechanicalVentilation;
		expect(data[0]?.data).toEqual(expect.objectContaining(mechanicalVentilation4));
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
			(await screen.findByTestId<HTMLInputElement>("measuredFanPowerAndAirFlowRateKnown_yes")).checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("measuredFanPower"))).value,
		).toBe("40");
		expect(
			((await screen.findByTestId<HTMLInputElement>("measuredAirFlowRate"))).value,
		).toBe("10");
		expect(
			((await screen.findByTestId<HTMLInputElement>("airFlowRate"))).value,
		).toBe("12");
		expect(
			((await screen.findByTestId<HTMLInputElement>("mvhrLocation_inside")))
				.checked,
		).toBe(true);
		expect(
			(await screen.findByTestId<HTMLInputElement>("installedUnderApprovedScheme_yes")).checked,
		).toBe(true);
		expect(
			((await screen.findByTestId<HTMLInputElement>("midHeightOfAirFlowPathForIntake"))).value,
		).toBe("1.5");
		expect(
			((await screen.findByTestId<HTMLInputElement>("orientationOfIntake"))).value,
		).toBe("80");
		expect(
			((await screen.findByTestId<HTMLInputElement>("pitchOfIntake"))).value,
		).toBe("10");
		expect(
			((await screen.findByTestId<HTMLInputElement>("midHeightOfAirFlowPathForExhaust"))).value,
		).toBe("1.5");
		expect(
			((await screen.findByTestId<HTMLInputElement>("orientationOfExhaust"))).value,
		).toBe("90");
		expect(
			((await screen.findByTestId<HTMLInputElement>("pitchOfExhaust"))).value,
		).toBe("30");
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
	});

	test("required error messages are displayed when typeOfMechanicalVentilationOptions is MVHR", async () => {
		await renderSuspended(MechanicalVentilationForm);

		const mvhrErrorIds: string[] = [
			"selectMvhr_error",
			"measuredFanPowerAndAirFlowRateKnown_error",
			"mvhrLocation_error",
			"installedUnderApprovedScheme_error",
			"midHeightOfAirFlowPathForIntake_error",
			"orientationOfIntake_error",
			"pitchOfIntake_error",
			"midHeightOfAirFlowPathForExhaust_error",
			"orientationOfExhaust_error",
			"pitchOfExhaust_error",
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

	test("required error messages are displayed when typeOfMechanicalVentilationOptions is Intermittent MEV", async () => {
		await renderSuspended(MechanicalVentilationForm);

		const intermittentMevErrorIds: string[] = [
			"specificFanPower_error",
			"midHeightOfAirFlowPath_error",
		];

		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Intermittent_MEV"),
		);
		await user.click(screen.getByTestId("saveAndComplete"));

		for (const error of intermittentMevErrorIds) {
			const mhvrErrors = screen.getByTestId(error);
			expect(mhvrErrors).toBeDefined();
		}
	});

	test("required error messages are displayed when typeOfMechanicalVentilationOptions is Centralised continuous MEV", async () => {
		await renderSuspended(MechanicalVentilationForm);

		const centralisedContinuousMevErrorIds: string[] = [
			"selectCentralisedContinuousMev_error",
			"measuredFanPowerAndAirFlowRateKnown_error",
			"midHeightOfAirFlowPath_error",
			"installedUnderApprovedScheme_error",
		];

		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Centralised_continuous_MEV"),
		);
		await user.click(screen.getByTestId("saveAndComplete"));

		for (const error of centralisedContinuousMevErrorIds) {
			const mhvrErrors = screen.getByTestId(error);
			expect(mhvrErrors).toBeDefined();
		}
	});

	test("required error messages are displayed when typeOfMechanicalVentilationOptions is Decentralised continuous MEV", async () => {
		await renderSuspended(MechanicalVentilationForm);

		const decentralisedContinuousMevErrorIds: string[] = [
			"selectDecentralisedContinuousMev_error",
			"installationType_error",
			"installationLocation_error",
			"midHeightOfAirFlowPath_error",
			"installedUnderApprovedScheme_error",
		];

		await user.click(
			screen.getByTestId("typeOfMechanicalVentilationOptions_Decentralised_continuous_MEV"),
		);
		await user.click(screen.getByTestId("saveAndComplete"));

		for (const error of decentralisedContinuousMevErrorIds) {
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
