import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import InstantElectricHeater from "./[heater].vue";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("instantElectricHeater", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const instantElectricHeater: InstantElectricStorageData = {
		name: "Instant electric heater 1",
		ratedPower: 3,
		convectionFractionInstant: 0.2
	};

	const instantElectricHeater2: InstantElectricStorageData = {
		name: "Instant electric heater 2",
		ratedPower: 14,
		convectionFractionInstant: 1
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
		await renderSuspended(InstantElectricHeater);

		await populateValidForm();
		await user.click(screen.getByRole("button"));

		const { data } = store.heatingSystems.heatEmitting.instantElectricHeater;

		expect(data[0]).toEqual(instantElectricHeater);
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
			((await screen.findByTestId("name")) as HTMLInputElement).value
		).toBe("Instant electric heater 1");
		expect(
			((await screen.findByTestId("ratedPower")) as HTMLInputElement).value
		).toBe("3");
		expect(
			(
				(await screen.findByTestId(
					"convectionFractionInstant"
				)) as HTMLInputElement
			).value
		).toBe("0.2");
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByRole("button"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("ratedPower_error")).toBeDefined();
		expect(
			await screen.findByTestId("convectionFractionInstant_error")
		).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByRole("button"));

		expect(
			await screen.findByTestId("instantElectricHeaterErrorSummary")
		).toBeDefined();
	});

	test("updated form data is automatically saved to store", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater]
					}		
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
		waitFor(() => {
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.name).toBe("Updated Instant electric heater 1");
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.ratedPower).toBe(5);
		});
	});
	
	test("updated form data is automatically saved to store when there is one instant electric heater added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater]
					}		
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
		waitFor(() => {
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.name).toBe("Updated Instant electric heater 1");
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[0]?.ratedPower).toBe(5);
		});
	});


	test("updated form data is automatically saved to the correct store object when there are multiple instant electric heaters added", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater, instantElectricHeater2]
					}		
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

		waitFor(() => {
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[1]?.name).toBe("Updated Instant electric heater 2");
			expect(store.heatingSystems.heatEmitting.instantElectricHeater.data[1]?.ratedPower).toBe(1);
		});
	});
});
