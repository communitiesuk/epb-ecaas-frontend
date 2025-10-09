import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import HeatEmitting from "./index.vue";
import WetDistributionForm from "./wet-distribution/[distribution].vue";
import InstantElectricHeaterForm from "./instant-electric-heater/[heater].vue";
// import ElectricStorageHeaterForm from "./electric-storage-heater/[heater].vue";
// import WarmAirHeatPumpForm from "./warm-air-heat-pump/[pump].vue";

import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import formStatus from "~/constants/formStatus";

describe("heat emitting", () => {
	describe("wet distribution", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const wetDistribution1 = {
			data: {
				name: "Wet Distribution 1",
			},
			complete: false,
		};
		const wetDistribution2 = {
			data: {
				name: "Wet Distribution 2",
			},
			complete: false,
		};
		const wetDistribution3 = {
			data: {
				name: "Wet Distribution 3",
			},
			complete: false,
		};
		afterEach(() => {
			store.$reset();
		});

		it("should remove wet distribution when remove link is clicked", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(screen.getAllByTestId("wetDistribution_items")).toBeDefined();

			await user.click(screen.getByTestId("wetDistribution_remove_0"));
			expect(screen.queryByTestId("wetDistribution_items")).toBeNull();
		});

		it("should only remove the wet distribution that is clicked if there are multiple wet distributions", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1, wetDistribution2, wetDistribution3],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId("wetDistribution_remove_1"));

			expect(screen.getByText("Wet Distribution 1")).toBeDefined();
			expect(screen.getByText("Wet Distribution 3")).toBeDefined();
			expect(screen.queryByText("Wet Distribution 2")).toBeNull();
		});

		it("should duplicate the correct wet distribution when duplicate link is clicked", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1, wetDistribution2],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(screen.getByTestId("wetDistribution_duplicate_0"));
			await userEvent.click(screen.getByTestId("wetDistribution_duplicate_0"));
			await userEvent.click(screen.getByTestId("wetDistribution_duplicate_2"));
			await userEvent.click(screen.getByTestId("wetDistribution_duplicate_2"));

			expect(screen.queryAllByTestId("wetDistribution_item").length).toBe(6);
			expect(screen.getByText("Wet Distribution 1")).toBeDefined();
			expect(screen.getByText("Wet Distribution 1 (1)")).toBeDefined();
			expect(screen.getByText("Wet Distribution 1 (2)")).toBeDefined();
			expect(screen.getByText("Wet Distribution 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Wet Distribution 1 (1) (2)")).toBeDefined();
		});
	});

	describe("instant electric heater", async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const instantElectricHeater1 = {
			data: {
				name: "Instant Electric Heater 1",
			},
		};
		const instantElectricHeater2 = {
			data: {
				name: "Instant Electric Heater 2",
			},
		};
		const instantElectricHeater3 = {
			data: {
				name: "Instant Electric Heater 3",
			},
		};

		it("should remove instant electric heater when remove link is clicked", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(
				screen.getAllByTestId("instantElectricHeater_items"),
			).toBeDefined();

			await user.click(screen.getByTestId("instantElectricHeater_remove_0"));
			expect(screen.queryByTestId("instantElectricHeater_items")).toBeNull();
		});

		it("should only remove the instant electric heater that is clicked if there are multiple instant electric heaters", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [
								instantElectricHeater1,
								instantElectricHeater2,
								instantElectricHeater3,
							],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId("instantElectricHeater_remove_1"));

			expect(screen.getByText("Instant Electric Heater 1")).toBeDefined();
			expect(screen.getByText("Instant Electric Heater 3")).toBeDefined();
			expect(screen.queryByText("Instant Electric Heater 2")).toBeNull();
		});

		it("should duplicate the correct instant electric heater when duplicate link is clicked", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater1, instantElectricHeater2],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(
				screen.getByTestId("instantElectricHeater_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("instantElectricHeater_duplicate_0"),
			);
			await userEvent.click(
				screen.getByTestId("instantElectricHeater_duplicate_2"),
			);
			await userEvent.click(
				screen.getByTestId("instantElectricHeater_duplicate_2"),
			);

			expect(screen.queryAllByTestId("instantElectricHeater_item").length).toBe(
				6,
			);
			expect(screen.getByText("Instant Electric Heater 1")).toBeDefined();
			expect(screen.getByText("Instant Electric Heater 1 (1)")).toBeDefined();
			expect(screen.getByText("Instant Electric Heater 1 (2)")).toBeDefined();
			expect(
				screen.getByText("Instant Electric Heater 1 (1) (1)"),
			).toBeDefined();
			expect(
				screen.getByText("Instant Electric Heater 1 (1) (2)"),
			).toBeDefined();
		});

		it("should display an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [
								{
									data: {
										name: "Instant electric heater",
									},
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatEmitting);

			expect(
				screen.getByTestId("instantElectricHeater_status_0").textContent,
			).toBe(formStatus.inProgress.text);
		});

		it("should display a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [
								{
									data: {
										name: "Instant electric heater",
										ratedPower: 10,
										convectionFractionInstant: 0.5,
									},
									complete: true,
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatEmitting);

			expect(
				screen.getByTestId("instantElectricHeater_status_0").textContent,
			).toBe(formStatus.complete.text);
		});
	});

	// describe("electric storage heater", async () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();

	// 	const storageHeater1 = {
	// 		name: "Storage heater 1",
	// 	};
	// 	const storageHeater2 = {
	// 		name: "Storage heater 2",
	// 	};
	// 	const storageHeater3 = {
	// 		name: "Storage heater 3",
	// 	};
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});

	// 	it("should remove electric storage heater when remove link is clicked", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					electricStorageHeater: {
	// 						data: [storageHeater1],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		expect(
	// 			screen.getAllByTestId("electricStorageHeater_items")
	// 		).toBeDefined();

	// 		await user.click(screen.getByTestId("electricStorageHeater_remove_0"));
	// 		expect(screen.queryByTestId("electricStorageHeater_items")).toBeNull();
	// 	});

	// 	it("should only remove the heater thats is clicked if there are multiple heaters", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					electricStorageHeater: {
	// 						data: [storageHeater1, storageHeater2, storageHeater3],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		await user.click(screen.getByTestId("electricStorageHeater_remove_1"));

	// 		expect(screen.getByText("Storage heater 1")).toBeDefined();
	// 		expect(screen.getByText("Storage heater 3")).toBeDefined();
	// 		expect(screen.queryByText("Storage heater 2")).toBeNull();
	// 	});
	// 	it("should duplicate the correct heater when duplicate link is clicked", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					electricStorageHeater: {
	// 						data: [storageHeater1, storageHeater2],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		await userEvent.click(
	// 			screen.getByTestId("electricStorageHeater_duplicate_0")
	// 		);
	// 		await userEvent.click(
	// 			screen.getByTestId("electricStorageHeater_duplicate_0")
	// 		);
	// 		await userEvent.click(
	// 			screen.getByTestId("electricStorageHeater_duplicate_2")
	// 		);
	// 		await userEvent.click(
	// 			screen.getByTestId("electricStorageHeater_duplicate_2")
	// 		);

	// 		expect(screen.queryAllByTestId("electricStorageHeater_item").length).toBe(
	// 			6
	// 		);
	// 		expect(screen.getByText("Storage heater 1")).toBeDefined();
	// 		expect(screen.getByText("Storage heater 1 (1)")).toBeDefined();
	// 		expect(screen.getByText("Storage heater 1 (2)")).toBeDefined();
	// 		expect(screen.getByText("Storage heater 1 (1) (1)")).toBeDefined();
	// 		expect(screen.getByText("Storage heater 1 (1) (2)")).toBeDefined();
	// 	});
	// });
	// describe("warm air heat pump", async () => {
	// 	const store = useEcaasStore();
	// 	const user = userEvent.setup();

	// 	const warmAirHeatPump1 = {
	// 		name: "Warm Air Heat Pump 1",
	// 	};
	// 	const warmAirHeatPump2 = {
	// 		name: "Warm Air Heat Pump 2",
	// 	};
	// 	const warmAirHeatPump3 = {
	// 		name: "Warm Air Heat Pump 3",
	// 	};
	// 	afterEach(() => {
	// 		store.$reset();
	// 	});
	// 	it("should remove warm air heat pump when remove link is clicked", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					warmAirHeatPump: {
	// 						data: [warmAirHeatPump1],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		expect(screen.getAllByTestId("warmAirHeatPump_items")).toBeDefined();

	// 		await user.click(screen.getByTestId("warmAirHeatPump_remove_0"));
	// 		expect(screen.queryByTestId("warmAirHeatPump_items")).toBeNull();
	// 	});

	// 	it("should only remove the heat pump that is clicked if there are multiple heat pumps", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					warmAirHeatPump: {
	// 						data: [warmAirHeatPump1, warmAirHeatPump2, warmAirHeatPump3],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		await user.click(screen.getByTestId("warmAirHeatPump_remove_1"));

	// 		expect(screen.getByText("Warm Air Heat Pump 1")).toBeDefined();
	// 		expect(screen.getByText("Warm Air Heat Pump 3")).toBeDefined();
	// 		expect(screen.queryByText("Warm Air Heat Pump 2")).toBeNull();
	// 	});

	// 	it("should duplicate the correct heat pump when duplicate link is clicked", async () => {
	// 		store.$patch({
	// 			heatingSystems: {
	// 				heatEmitting: {
	// 					warmAirHeatPump: {
	// 						data: [warmAirHeatPump1, warmAirHeatPump2],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		await renderSuspended(HeatEmitting);
	// 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_0"));
	// 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_0"));
	// 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_2"));
	// 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_2"));

	// 		expect(screen.queryAllByTestId("warmAirHeatPump_item").length).toBe(6);
	// 		expect(screen.getByText("Warm Air Heat Pump 1")).toBeDefined();
	// 		expect(screen.getByText("Warm Air Heat Pump 1 (1)")).toBeDefined();
	// 		expect(screen.getByText("Warm Air Heat Pump 1 (2)")).toBeDefined();
	// 		expect(screen.getByText("Warm Air Heat Pump 1 (1) (1)")).toBeDefined();
	// 		expect(screen.getByText("Warm Air Heat Pump 1 (1) (2)")).toBeDefined();
	// 	});
	// });
	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});
		const wetDistribution1: EcaasForm<WetDistributionData> = {
			data: {
				name: "Wet distribution 1",
				heatSource: "463c94f6-566c-49b2-af27-57e5c68b5c30",
				thermalMass: 2,
				designTempDiffAcrossEmitters: 0.4,
				designFlowTemp: 32,
				designFlowRate: 4,
				typeOfSpaceHeater: "radiator",
				exponent: 1.3,
				constant: 0.08,
				convectionFractionWet: 0.2,
				ecoDesignControllerClass: "1",
				minimumFlowTemp: 20,
				minOutdoorTemp: 0,
				maxOutdoorTemp: 15,
				numberOfRadiators: 1,
			},
			complete: true,
		};

		const instantElectricHeater1 = {
			data: {
				name: "Instant Electric Heater 1",
				ratedPower: 30,
				convectionFractionInstant: 1,
			},
			complete: true,
		};
		const addHeatEmittingDataToStore = async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: { data: [wetDistribution1] },
						instantElectricHeater: { data: [instantElectricHeater1] },
						// electricStorageHeater: { data: [{ name: "storage 1" }] },
						// warmAirHeatPump: { data: [{ name: "warm air 1" }] },
					},
					heatGeneration: {
						heatPump: {
							data: [
								{
									data: {
										id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
										name: "Heat pump 1",
									},
								},
							],
						},
					},
				},
			});
		};

		const heatEmittersSections = {
			wetDistribution: {
				id: "distribution",
				form: WetDistributionForm,
			},
			instantElectricHeater: {
				id: "heater",
				form: InstantElectricHeaterForm,
			},
			// electricStorageHeater: { id: "storage", form: ElectricStorageHeaterForm },
			// warmAirHeatPump: { id: "pump", form: WarmAirHeatPumpForm },
		};


		type HeatEmittingPicked = Pick<
			typeof store.heatingSystems.heatEmitting,
			"wetDistribution" | "instantElectricHeater"
		>;
		type HeatEmittingType = keyof HeatEmittingPicked;

		// const addHeatEmittingDataToStore = async () => {
		// 	store.$patch({
		// 		heatingSystems: {
		// 			heatEmitting: {
		// 				wetDistribution: { data: [wetDistribution1] },
		// 				instantElectricHeater: { data: [instantElectricHeater1] },
		// 			},
		// 		},
		// 	});
		// };

		beforeEach(async () => {
			await addHeatEmittingDataToStore();
			await renderSuspended(HeatEmitting);
		});

		afterEach(() => {
			store.$reset();
		});

		it("disables the Mark section as complete button when an emitter is incomplete", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: { data: [{ ...instantElectricHeater1, complete: false }] },
					},
				},
			});

			await renderSuspended(HeatEmitting);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
		});

		it("enables the Mark section as complete button when all emitters are complete", async () => {
			await addHeatEmittingDataToStore();
			await renderSuspended(HeatEmitting);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeFalsy();
		});

		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addHeatEmittingDataToStore();
				await renderSuspended(HeatEmitting);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to the heating systems page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/heating-and-cooling-systems");
			});

			it("marks all heat emitters as complete", async () => {
				const { wetDistribution, instantElectricHeater } = store.heatingSystems.heatEmitting;
				expect(wetDistribution?.complete).toBe(true);
				expect(instantElectricHeater?.complete).toBe(true);
			});

			it("marks heat emitters as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("wetDistribution_remove_0"));
				await user.click(screen.getByTestId("instantElectricHeater_remove_0"));

				const { wetDistribution, instantElectricHeater } = store.heatingSystems.heatEmitting;
				expect(wetDistribution?.complete).toBe(false);
				expect(instantElectricHeater?.complete).toBe(false);
				expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
			});

			it("marks heat emitters as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("wetDistribution_duplicate_0"));
				await user.click(screen.getByTestId("instantElectricHeater_duplicate_0"));

				const { wetDistribution, instantElectricHeater } = store.heatingSystems.heatEmitting;
				expect(wetDistribution?.complete).toBe(false);
				expect(instantElectricHeater?.complete).toBe(false);
				expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
			});

			it("marks heat emitters as not complete after adding a new emitter", async () => {
				const heatEmittersKeys: HeatEmittingType[] = ["wetDistribution", "instantElectricHeater"];

				for (const heatEmittersType of heatEmittersKeys) {
					await renderSuspended(heatEmittersSections[heatEmittersType].form, { route: { params: { [heatEmittersSections[heatEmittersType].id]: "create" } } });
					await user.type(screen.getByTestId("name"), "New emitter");
					await user.tab();
					await user.click(screen.getByTestId("saveAndComplete"));

					expect(store.heatingSystems.heatEmitting[heatEmittersType]?.complete).toBe(false);
				}
			});

			it("marks heat emitters as not complete after editing an existing emitter", async () => {
				const heatEmittersKeys: HeatEmittingType[] = ["wetDistribution", "instantElectricHeater"];

				for (const heatEmittersType of heatEmittersKeys) {
					await renderSuspended(heatEmittersSections[heatEmittersType].form, { route: { params: { [heatEmittersSections[heatEmittersType].id]: "0" } } });
					await user.clear(screen.getByTestId("name"));
					await user.type(screen.getByTestId("name"), "Updated emitter");
					await user.tab();

					expect(store.heatingSystems.heatEmitting[heatEmittersType]?.complete).toBe(false);
				}
			});
		});
	});

});
