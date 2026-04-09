import HeatingControls from "./index.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("Heating controls", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const heatingControl: HeatingControlData = {
		name: "Separate temperature control",
		heatingControlType: "separateTemperatureControl",
	};

	const populateValidForm = async () => {
		await user.click(screen.getByTestId("heatingControlType_separateTemperatureControl"));
		await user.tab();
	};

	test("data is saved to store state when form is valid", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});
		await populateValidForm();
		await user.click(screen.getByTestId("saveAndComplete"));

		const { data } = store.spaceHeating.heatingControls;

		expect(data[0]?.data).toEqual(heatingControl);
	});

	test("form is prepopulated when data exists in state", async () => {
		store.$patch({
			spaceHeating: {
				heatingControls: {
					data: [{ data: heatingControl }],
				},
			},
		});

		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "0" },
			},
		});

		expect((await screen.findByTestId("heatingControlType_separateTemperatureControl")).hasAttribute("checked")).toBe(true);
	});

	test("required error messages are displayed when empty form is submitted", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("heatingControlType_error"))).toBeDefined();
	});

	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(HeatingControls, {
			route: {
				params: { "heatingControl": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("heatingControlsErrorSummary"))).toBeDefined();
	});

	describe("partially saving data", () => {
		test("updated form data is automatically saved to store ", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: { data: [{ data: heatingControl }] },
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "0" },
				},
			});
			await user.click(screen.getByTestId("heatingControlType_separateTimeAndTemperatureControl"));
			await user.tab();

			expect(store.spaceHeating.heatingControls.data[0]?.data.name).toBe("Separate time and temperature control");
			expect(store.spaceHeating.heatingControls.data[0]?.data.heatingControlType).toBe("separateTimeAndTemperatureControl");
		});
	});
	describe("ranking heat emitters", () => {
		test("can set primary heat emitter when only one heat emitter exists", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{
							data: {
								name: "Lounge storage heater",
								typeOfHeatEmitter: "electricStorageHeater",
								productReference: "1234",
							},
						}],
					},
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "create" },
				},
			});
			await populateValidForm();
			expect(screen.getByText("Which is your primary heating system?")).toBeDefined();
			expect(screen.getByLabelText("Lounge storage heater")).toBeDefined();
			expect(screen.queryByText("Which is your second heating system?")).toBeNull();
			await user.click(screen.getByTestId("primaryHeatEmitter_0"));
			const electricStorageHeater = store.spaceHeating.heatEmitters.data[0]?.data;
			expect(electricStorageHeater?.heatingRank).toBe(1);
			await user.click(screen.getByTestId("saveAndComplete"));
		});
		test("shows only unranked heat emitters and reveals each question after the previous answer", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [
							{ data: { name: "Lounge storage heater", typeOfHeatEmitter: "electricStorageHeater" } },
							{ data: { name: "Hallway warm air", typeOfHeatEmitter: "warmAirHeater" } },
							{ data: { name: "Wet distribution radiators", typeOfHeatEmitter: "wetDistributionSystem" } },
							{ data: { name: "Bathroom panel heater", typeOfHeatEmitter: "instantElectricHeater" } },
						],
					},
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "create" },
				},
			});
			await populateValidForm();

			expect(screen.getByTestId("heatEmitterRanking")).toBeDefined();
			expect(screen.getByText("Which is your primary heating system?")).toBeDefined();
			expect(screen.queryByText("Which is your second heating system?")).toBeNull();
			expect(screen.queryByText("Which is your third heating system?")).toBeNull();
			expect(screen.queryByText("Which is your fourth heating system?")).toBeNull();

			await user.click(screen.getByTestId("primaryHeatEmitter_0"));

			expect(screen.getByText("Which is your second heating system?")).toBeDefined();
			expect(screen.queryByTestId("secondaryHeatEmitter_0")).toBeNull();
			expect(screen.getByTestId("secondaryHeatEmitter_1")).toBeDefined();
			expect(screen.getByTestId("secondaryHeatEmitter_2")).toBeDefined();
			expect(screen.getByTestId("secondaryHeatEmitter_3")).toBeDefined();
			expect(screen.queryByText("Which is your third heating system?")).toBeNull();

			await user.click(screen.getByTestId("secondaryHeatEmitter_1"));

			expect(screen.getByText("Which is your third heating system?")).toBeDefined();
			expect(screen.queryByTestId("heatEmitterRank_2_0")).toBeNull();
			expect(screen.queryByTestId("heatEmitterRank_2_1")).toBeNull();
			expect(screen.getByTestId("heatEmitterRank_2_2")).toBeDefined();
			expect(screen.getByTestId("heatEmitterRank_2_3")).toBeDefined();
			expect(screen.queryByText("Which is your fourth heating system?")).toBeNull();

			await user.click(screen.getByTestId("heatEmitterRank_2_2"));

			expect(screen.getByText("Which is your fourth heating system?")).toBeDefined();
			expect(screen.queryByTestId("heatEmitterRank_3_0")).toBeNull();
			expect(screen.queryByTestId("heatEmitterRank_3_1")).toBeNull();
			expect(screen.queryByTestId("heatEmitterRank_3_2")).toBeNull();
			expect(screen.getByTestId("heatEmitterRank_3_3")).toBeDefined();

			await user.click(screen.getByTestId("heatEmitterRank_3_3"));

			const electricStorageHeater = store.spaceHeating.heatEmitters.data[0]?.data;
			const warmAirHeater = store.spaceHeating.heatEmitters.data[1]?.data;
			const wetDistributionSystem = store.spaceHeating.heatEmitters.data[2]?.data;
			const instantElectricHeater = store.spaceHeating.heatEmitters.data[3]?.data;
			expect(electricStorageHeater?.heatingRank).toBe(1);
			expect(warmAirHeater?.heatingRank).toBe(2);
			expect(wetDistributionSystem?.heatingRank).toBe(3);
			expect(instantElectricHeater?.heatingRank).toBe(4);
			await user.click(screen.getByTestId("saveAndComplete"));
		});
		test("changing the first ranking clears subsequent rankings and re-asks follow-up questions", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [
							{ data: { name: "Lounge storage heater", typeOfHeatEmitter: "electricStorageHeater" } },
							{ data: { name: "Hallway warm air", typeOfHeatEmitter: "warmAirHeater" } },
							{ data: { name: "Wet distribution radiators", typeOfHeatEmitter: "wetDistributionSystem" } },
							{ data: { name: "Bathroom panel heater", typeOfHeatEmitter: "instantElectricHeater" } },
						],
					},
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "create" },
				},
			});
			await populateValidForm();

			await user.click(screen.getByTestId("primaryHeatEmitter_0"));
			await user.click(screen.getByTestId("secondaryHeatEmitter_1"));
			await user.click(screen.getByTestId("heatEmitterRank_2_2"));
			await user.click(screen.getByTestId("heatEmitterRank_3_3"));

			await user.click(screen.getByTestId("primaryHeatEmitter_1"));

			expect(screen.getByText("Which is your second heating system?")).toBeDefined();
			expect(screen.queryByText("Which is your third heating system?")).toBeNull();
			expect(screen.queryByText("Which is your fourth heating system?")).toBeNull();

			const firstEmitter = store.spaceHeating.heatEmitters.data[0]?.data;
			const secondEmitter = store.spaceHeating.heatEmitters.data[1]?.data;
			const thirdEmitter = store.spaceHeating.heatEmitters.data[2]?.data;
			const fourthEmitter = store.spaceHeating.heatEmitters.data[3]?.data;
			expect(firstEmitter?.heatingRank).toBeUndefined();
			expect(secondEmitter?.heatingRank).toBe(1);
			expect(thirdEmitter?.heatingRank).toBeUndefined();
			expect(fourthEmitter?.heatingRank).toBeUndefined();
		});
		test("updates second question options when primary answer changes with two emitters", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [
							{ data: { name: "Lounge storage heater", typeOfHeatEmitter: "electricStorageHeater" } },
							{ data: { name: "Hallway warm air", typeOfHeatEmitter: "warmAirHeater" } },
						],
					},
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "create" },
				},
			});
			await populateValidForm();

			await user.click(screen.getByTestId("primaryHeatEmitter_0"));
			expect(screen.getByText("Which is your second heating system?")).toBeDefined();
			expect(screen.getByTestId("secondaryHeatEmitter_1")).toBeDefined();
			expect(screen.queryByTestId("secondaryHeatEmitter_0")).toBeNull();

			await user.click(screen.getByTestId("primaryHeatEmitter_1"));
			expect(screen.getByTestId("secondaryHeatEmitter_0")).toBeDefined();
			expect(screen.queryByTestId("secondaryHeatEmitter_1")).toBeNull();
		});
		test("shows error if user tries to save without ranking heat emitters", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [
							{ data: { name: "Lounge storage heater", typeOfHeatEmitter: "electricStorageHeater" } },
							{ data: { name: "Hallway warm air", typeOfHeatEmitter: "warmAirHeater" } },
						],
					},
				},
			});

			await renderSuspended(HeatingControls, {
				route: {
					params: { "heatingControl": "create" },
				},
			});
			await populateValidForm();
			await user.click(screen.getByTestId("saveAndComplete"));
			expect(screen.getByTestId("primaryHeatEmitter_error")).toBeDefined();
		});
	});
});
