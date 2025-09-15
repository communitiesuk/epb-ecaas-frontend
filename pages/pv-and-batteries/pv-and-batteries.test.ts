import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import PvAndBatteries from "./index.vue";
import PvSystemForm from "./pv-systems/[system].vue";
import ElectricBatteryForm from "./electric-battery/index.vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

const baseForm = {
	data: [],
	complete: true,
};

describe("pv systems and electric battery", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const pvSystem1: EcaasForm<PvSystemData> = {
		data: {
			name: "PV System 1",
			peakPower: 4,
			ventilationStrategy: "unventilated",
			pitch: 45,
			orientation: 20,
			elevationalHeight: 100,
			lengthOfPV: 20,
			widthOfPV: 20,
			inverterPeakPowerAC: 4,
			inverterPeakPowerDC: 5,
			inverterIsInside: true,
			inverterType: "string_inverter",
			// aboveDepth: 20,
			// aboveDistance: 4,
			// leftDepth: 10,
			// leftDistance: 7,
			// rightDepth: 2,
			// rightDistance: 10
		},
	};

	const pvSystem2: EcaasForm<PvSystemData> = {
		data: {
			...pvSystem1.data,
			name: "PV System 2",
		},
	};

	const pvSystem3: EcaasForm<PvSystemData> = {
		data: {
			...pvSystem1.data,
			name: "PV System 3",
		},
	};

	const electricBattery: EcaasForm<ElectricBatteryData> = {
		data: {
			name: "Electric Battery 1",
			capacity: 2,
			chargeEfficiency: 0.8,
			batteryAge: 0,
			minimumChargeRate: 0.001,
			maximumChargeRate: 1.5,
			maximumDischargeRate: 1.25,
			location: "outside",
			gridChargingPossible: false,
		},
	};

	describe("pv systems", () => {
		test("pv system is removed when remove link is clicked", async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						...baseForm,
						data: [pvSystem1],
					},
				},
			});

			await renderSuspended(PvAndBatteries);

			expect(screen.getAllByTestId("pvSystems_items")).toBeDefined();

			await user.click(screen.getByTestId("pvSystems_remove_0"));

			expect(screen.queryByTestId("pvSystems_items")).toBeNull();
		});

		it("should only remove the pv system object that is clicked", async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						...baseForm,
						data: [pvSystem1, pvSystem2, pvSystem3],
					},
				},
			});

			await renderSuspended(PvAndBatteries);
			await user.click(screen.getByTestId("pvSystems_remove_1"));

			const populatedList = screen.getByTestId("pvSystems_items");

			expect(within(populatedList).getByText("PV System 1")).toBeDefined();
			expect(within(populatedList).getByText("PV System 3")).toBeDefined();
			expect(within(populatedList).queryByText("PV System 2")).toBeNull();
		});

		test("pv system is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data: [pvSystem1, pvSystem2],
					},
				},
			});

			await renderSuspended(PvAndBatteries);
			await userEvent.click(screen.getByTestId("pvSystems_duplicate_0"));
			await userEvent.click(screen.getByTestId("pvSystems_duplicate_0"));
			await userEvent.click(screen.getByTestId("pvSystems_duplicate_2"));
			await userEvent.click(screen.getByTestId("pvSystems_duplicate_2"));

			expect(screen.queryAllByTestId("pvSystems_item").length).toBe(6);
			expect(screen.getByText("PV System 1")).toBeDefined();
			expect(screen.getByText("PV System 1 (1)")).toBeDefined();
			expect(screen.getByText("PV System 1 (2)")).toBeDefined();
			expect(screen.getByText("PV System 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("PV System 1 (1) (2)")).toBeDefined();
		});
	});

	describe("electric batteries", () => {
		test("battery is removed when remove link is clicked", async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery],
					},
				},
			});

			await renderSuspended(PvAndBatteries);

			expect(screen.getAllByTestId("electricBattery_items")).toBeDefined();
			expect(screen.getAllByTestId("electricBattery_item").length).toBe(1);

			await user.click(screen.getByTestId("electricBattery_remove_0"));

			expect(screen.queryByTestId("electricBattery_items")).toBeNull();
		});

		test("only one battery can be added", async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery],
					},
				},
			});

			await renderSuspended(PvAndBatteries);
			expect(screen.queryByTestId("electricBattery_add")).toBeNull();
			expect(screen.queryByTestId("electricBattery_duplicate_0")).toBeNull();
		});
	});

	it("disables the mark section as complete button when item is incomplete", async () => {
		store.$patch({
			pvAndBatteries: {
				electricBattery: {
					data: [{ data: { name: "Battery", capacity: 2 }, complete: false }],
				},
			},
		});

		await renderSuspended(PvAndBatteries);
		const markAsCompleteButton = screen.getByRole("button", {
			name: "Mark section as complete",
		});
		expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
	});

	test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
		store.$patch({
			pvAndBatteries: {
				pvSystems: {
					data: [pvSystem1],
				},
			},
		});

		await renderSuspended(PvAndBatteries);

		expect(screen.getByTestId("pvSystems_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});
	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		mockNuxtImport("navigateTo", () => navigateToMock);

		const addCompletePvAndBatteryToStore = async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: { data: [{ ...pvSystem1, complete: true }] },
					electricBattery: { data: [{ ...electricBattery, complete: true }] },
				},
			});
		};

		beforeEach(async () => {
			await renderSuspended(PvAndBatteries);
		});

		afterEach(() => {
			store.$reset();
		});

		const pvAndBatteryForms = {
			pvSystems: PvSystemForm,
			electricBattery: ElectricBatteryForm,
		};

  type SectionKey = keyof typeof store.pvAndBatteries;
  
  it("disables the Mark section as complete button when a section is incomplete", async () => {
  	store.$patch({
  		pvAndBatteries: {
  			pvSystems: { data: [{ ...pvSystem1, complete: false }] },
  			electricBattery: { data: [{ ...electricBattery, complete: false }] },
  		},
  	});

  	await renderSuspended(PvAndBatteries);
  	expect(
  		screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
  	).toBeTruthy();
  });

  it("enables the Mark section as complete button when all sections are complete", async () => {
  	await addCompletePvAndBatteryToStore();
  	await renderSuspended(PvAndBatteries);

  	expect(
  		screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
  	).toBeFalsy();
  });

  it("displays a 'Completed' status indicator when section is marked as complete", async () => {
  	await addCompletePvAndBatteryToStore();
  	await renderSuspended(PvAndBatteries);
  	await user.click(screen.getByTestId("markAsCompleteButton"));

  	const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
  	expect(completedStatusElement?.style.display).not.toBe("none");
  });

  describe("after section has been marked as complete", () => {
  	beforeEach(async () => {
  		await addCompletePvAndBatteryToStore();
  		await renderSuspended(PvAndBatteries);
  		await user.click(screen.getByTestId("markAsCompleteButton"));
  	});

  	it("displays the 'Completed' section status indicator", async () => {
  		const completed = screen.queryByTestId("completeSectionCompleted");
  		expect(completed?.style.display).not.toBe("none");
  	});

  	it("navigates to the home page", async () => {
  		expect(navigateToMock).toHaveBeenCalledWith("/");
  	});

  	it("marks each PV and battery section as complete", () => {
  		const { pvSystems, electricBattery } = store.pvAndBatteries;
  		expect(pvSystems?.complete).toBe(true);
  		expect(electricBattery?.complete).toBe(true);
  	});

  	it("marks section as not complete if an item is removed", async () => {
  		await user.click(screen.getByTestId("pvSystems_remove_0"));
  		await user.click(screen.getByTestId("electricBattery_remove_0"));

  		const { pvSystems, electricBattery } = store.pvAndBatteries;
  		expect(pvSystems?.complete).toBe(false);
  		expect(electricBattery?.complete).toBe(false);
  	});

  	it("marks section as not complete if an item is duplicated", async () => {
  		await user.click(screen.getByTestId("pvSystems_duplicate_0"));
  		// await user.click(screen.getByTestId("electricBattery_duplicate_0"));

  		const { pvSystems } = store.pvAndBatteries;
  		expect(pvSystems?.complete).toBe(false);
  		// expect(electricBattery?.complete).toBe(false);
  	});

  	it("marks section as not complete after adding a new item", async () => {
  		for (const section of Object.keys(store.pvAndBatteries) as SectionKey[]) {
  			await renderSuspended(pvAndBatteryForms[section], {
  				route: { params: { [section === "pvSystems" ? "system" : "battery"]: "create" } },
  			});

  			await user.type(screen.getByTestId("name"), "New item");
  			await user.tab();
  			await user.click(screen.getByTestId("saveAndComplete"));

  			expect(store.pvAndBatteries[section]?.complete).toBe(false);
  		}
  	});

  	it("marks section as not complete after editing an existing item", async () => {
  		for (const section of Object.keys(store.pvAndBatteries) as SectionKey[]) {
  			await renderSuspended(pvAndBatteryForms[section], {
  				route: { params: { [section === "pvSystems" ? "system" : "battery"]: "0" } },
  			});

  			await user.clear(screen.getByTestId("name"));
  			await user.type(screen.getByTestId("name"), "Updated item");
  			await user.tab();

  			expect(store.pvAndBatteries[section]?.complete).toBe(false);
  		}
  	});
  });
	});
});

