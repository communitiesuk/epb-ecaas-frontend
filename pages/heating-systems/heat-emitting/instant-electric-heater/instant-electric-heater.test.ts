import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import InstantElectricHeater from "./[heater].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("instantElectricHeater", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const instantElectricHeater: EcaasForm<InstantElectricStorageData> = {
		data: {
			name: "Instant electric heater 1",
			ratedPower: 3,
			convectionFractionInstant: 0.2,
		},
	};

	const instantElectricHeater2: EcaasForm<InstantElectricStorageData> = {
		data: {
			name: "Instant electric heater 2",
			ratedPower: 14,
			convectionFractionInstant: 1,
		},
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "Instant electric heater 1");
		await user.type(screen.getByTestId("ratedPower"), "3");
		await user.type(screen.getByTestId("convectionFractionInstant"), "0.2");
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "create" },
			},
		});

		await populateValidForm();

		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.heatingSystems.heatEmitting.instantElectricHeater;

		expect(data[0]).toEqual({
			...instantElectricHeater,
			complete: true,
		});
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater],
					},
				},
			},
		});

		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "0" },
			},
		});

		expect(
			((await screen.findByTestId<HTMLInputElement>("name"))).value,
		).toBe("Instant electric heater 1");
		expect(
			((await screen.findByTestId<HTMLInputElement>("ratedPower"))).value,
		).toBe("3");
		expect(
			(
				(await screen.findByTestId<HTMLInputElement>(
					"convectionFractionInstant",
				))
			).value,
		).toBe("0.2");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("ratedPower_error")).toBeDefined();
		expect(
			await screen.findByTestId("convectionFractionInstant_error"),
		).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(
			await screen.findByTestId("instantElectricHeaterErrorSummary"),
		).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater],
					},		
				},
			},
		});

		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "0" },
			},
		});
		
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("ratedPower"));

		await user.type(screen.getByTestId("name"), "Updated Instant electric heater 1");
		await user.type(screen.getByTestId("ratedPower"), "5");
		await user.tab();

		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.name).toBe("Updated Instant electric heater 1");
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.ratedPower).toBe(5);
	});
	
	test("partial form data is saved automatically with default name to store when adding new heater", async () => {
		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "create" },
			},
		});
		
		await user.type(screen.getByTestId("ratedPower"), "5");
		await user.type(screen.getByTestId("convectionFractionInstant"), "1");
		await user.tab();

		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.name).toBe("Instant electric heater");
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.ratedPower).toBe(5);
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.convectionFractionInstant).toBe(1);
	});

	test("creates a new heater automatically with given name", async () => {
		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "create" },
			},
		});
		
		await user.type(screen.getByTestId("name"), "Heater 1");
		await user.tab();

		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.name).toBe("Heater 1");
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.ratedPower).toBeUndefined();
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.data.convectionFractionInstant).toBeUndefined();
	});

	test("updated form data is automatically saved to the correct store object when there are multiple instant electric heaters added", async () => {
		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater, instantElectricHeater2],
					},		
				},
			},
		});

		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { heater: "1" },
			},
		});
			
		await user.clear(screen.getByTestId("name"));
		await user.clear(screen.getByTestId("ratedPower"));

		await user.type(screen.getByTestId("name"), "Updated Instant electric heater 2");
		await user.type(screen.getByTestId("ratedPower"), "1");
		await user.tab();

		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[1]?.data.name).toBe("Updated Instant electric heater 2");
		expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[1]?.data.ratedPower).toBe(1);
	});
});
