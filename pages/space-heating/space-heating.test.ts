import {
	mockNuxtImport,
	renderSuspended,
} from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import SpaceHeating from "./index.vue";
import formStatus from "~/constants/formStatus";
import HeatSourceForm from "./heat-source/[heatSource]/index.vue";
import { litre } from "~/utils/units/volume";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

describe("space heating", () => {

	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const heatSource1: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
		name: "Heat source 1",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_SMALL",
		locationOfBoiler: "heatedSpace",
	};

	const heatSource2: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
		name: "Heat source 2",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_MEDIUM",
		locationOfBoiler: "heatedSpace",
	};

	const heatSource3: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8c",
		name: "Heat source 3",
		typeOfHeatSource: "boiler",
		typeOfBoiler: "regularBoiler",
		productReference: "BOILER_LARGE",
		locationOfBoiler: "heatedSpace",
	};

	describe("heat source", () => {

		it("heat source is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatSource1 },
							{ data: heatSource2 },

						],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			await userEvent.click(screen.getByTestId("heatSource_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatSource_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatSource_duplicate_2"));
			await userEvent.click(screen.getByTestId("heatSource_duplicate_2"));

			expect(screen.queryAllByTestId("heatSource_item").length).toBe(6);
			expect(screen.getByText("Heat source 1")).toBeDefined();
			expect(screen.getByText("Heat source 1 (1)")).toBeDefined();
			expect(screen.getByText("Heat source 1 (2)")).toBeDefined();
			expect(screen.getByText("Heat source 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Heat source 1 (1) (2)")).toBeDefined();
		});

		it("duplicated heat source has a unique id", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatSource1 },
						],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			await userEvent.click(screen.getByTestId("heatSource_duplicate_0"));

			const heatSources = store.spaceHeating.heatSource.data;
			expect(heatSources[1]?.data.id).not.toBe(heatSource1.id);
		});

		it("removes an item when remove link is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatSource1 }],
					},
				},
			});

			await renderSuspended(SpaceHeating);

			expect(screen.getAllByTestId("heatSource_items")).toBeDefined();
			await user.click(await screen.findByTestId("heatSource_remove_0"));
			expect(screen.queryByTestId("heatSource_items")).toBeNull();
		});

		it("only removes the heat source that is clicked when multiple exist", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatSource1 },
							{ data: heatSource2 },
							{ data: heatSource3 },
						],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			await user.click(await screen.findByTestId("heatSource_remove_1"));

			const populatedList = screen.getByTestId("heatSource_items");
			expect(within(populatedList).getByText("Heat source 1")).toBeDefined();
			expect(within(populatedList).getByText("Heat source 3")).toBeDefined();
			expect(within(populatedList).queryByText("Heat source 2")).toBeNull();
		});

		describe("when a heat source is removed", () => {
			it("references to the deleted heat source are removed from heat emitters", async () => {
				const heatPump1: HeatSourceData = {
					id: "0b77e247-53c5-42b8-9dbd-83cbfc811111",
					name: "Heat source 1",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP_LARGE",
				};
			
				const radiator: HeatEmittingData = {
					name: "Radiator 1",
					typeOfHeatEmitter: "radiator",
					typeOfRadiator: "towel",
					heatSource: heatPump1.id,
					productReference: "RADIATOR_STANDARD",
					designFlowTemp: 45,
					designTempDiffAcrossEmitters: 10,
					ecoDesignControllerClass: "4",
					hasVariableFlowRate: true,
					maxFlowRate: 200,
					minFlowRate: 50,
					id: "radiator-1",
					numOfRadiators: 5,
				};

				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: heatPump1 },
							],
						},
						heatEmitters: {
							data: [{ data: radiator }],
						},
					},
				});
			
				await renderSuspended(SpaceHeating);
				await user.click(await screen.findByTestId("heatSource_remove_0"));

				const emitterItem = store.spaceHeating.heatEmitters.data[0]?.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "radiator" }>;
				expect(emitterItem.heatSource).toBe(undefined);
			});

			it("domestic hot water heat sources that reference the deleted heat source are removed entirely", async () => {
			
				const heatPump1: HeatSourceData = {
					id: "0b77e247-53c5-42b8-9dbd-83cbfc811111",
					name: "Heat source 1",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP_LARGE",
				};

				const dhwWithExistingHeatSource: DomesticHotWaterHeatSourceData = {
					coldWaterSource: "headerTank",
					isExistingHeatSource: true,
					heatSourceId: heatPump1.id,
					id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
				};

				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: heatPump1 },
							],
						},
					},
					domesticHotWater: {
						heatSources: {
							data: [{ data: dhwWithExistingHeatSource }],
						},
					},
				});
				await renderSuspended(SpaceHeating);

				await user.click(await screen.findByTestId("heatSource_remove_0"));
				const { heatSources } = store.domesticHotWater;

				expect(heatSources.data.length).toBe(0);
			});

			it("references to the domestic hot water heat sources that reference the deleted heat source are themselves removed", async () => {
			
				const heatPump1: HeatSourceData = {
					id: "0b77e247-53c5-42b8-9dbd-83cbfc811111",
					name: "Heat source 1",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP_LARGE",
				};

				const dhwWithExistingHeatSource1: DomesticHotWaterHeatSourceData = {
					coldWaterSource: "headerTank",
					isExistingHeatSource: true,
					heatSourceId: heatPump1.id,
					id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
				};

				const heatPump2: HeatSourceData = {
					id: "0b77e247-53c5-42b8-9dbd-83cbfc822222",
					name: "Heat source 2",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "airSource",
					productReference: "HEATPUMP_LARGE",
				};

				const dhwWithExistingHeatSource2: DomesticHotWaterHeatSourceData = {
					coldWaterSource: "mainsWater",
					isExistingHeatSource: true,
					heatSourceId: heatPump2.id,
					id: "1b73e247-57c5-26b8-1tbd-83tdkc8c2222",
				};

				const cylinder1: WaterStorageData = {
					name: "Hot water cylinder 1",
					id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
					typeOfWaterStorage: "hotWaterCylinder",
					storageCylinderVolume: unitValue(5, litre),
					initialTemperature: 60,
					dailyEnergyLoss: 1,
					dhwHeatSourceId: dhwWithExistingHeatSource2.id,
					areaOfHeatExchanger: 1000,
					heaterPosition: 0.8,
					thermostatPosition: 0.5,
				};

				const cylinder2: WaterStorageData = {
					name: "Smart Hot Water Tank 2",
					id: "c84528bb-f805-4f1e-95d3-2bd1717deca2",
					typeOfWaterStorage: "smartHotWaterTank",
					dhwHeatSourceId: dhwWithExistingHeatSource1.id,
					heaterPosition: 0.8,
					productReference: "SMRT-12345",
				};

				const mixerShower: MixedShowerDataNew = {
					name: "Mixer shower 1",
					id: "c84528bb-f805-4f1e-95d3-2bd1717deca3",
					typeOfHotWaterOutlet: "mixedShower",
					flowRate: 10,
					dhwHeatSourceId: dhwWithExistingHeatSource1.id,
					wwhrs: false,
				};

				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: heatPump1 },
								{ data: heatPump2 },
							],
						},
					},
					domesticHotWater: {
						heatSources: {
							data: [
								{ data: dhwWithExistingHeatSource1 },
								{ data: dhwWithExistingHeatSource2 },
							],
						},
						hotWaterOutlets: {
							data: [
								{ data: mixerShower },
							],
						},
						waterStorage: {
							data: [
								{ data: cylinder1 },
								{ data: cylinder2 },
							],
						},
					},
				});
				await renderSuspended(SpaceHeating);

				await user.click(await screen.findByTestId("heatSource_remove_0"));
				const { heatSources, hotWaterOutlets, waterStorage } = store.domesticHotWater;

				expect(heatSources.data.length).toBe(1);
				expect((hotWaterOutlets.data[0]!.data as MixedShowerDataNew).dhwHeatSourceId).toBe(undefined);
				expect(waterStorage.data[0]!.data.dhwHeatSourceId).toBe(dhwWithExistingHeatSource2.id);
				expect(waterStorage.data[1]!.data.dhwHeatSourceId).toBe(undefined);

			});
		});

		it("displays an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{
								data: heatSource1,
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeating);

			expect(screen.getByTestId("heatSource_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("displays a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{
								data: heatSource1,
								complete: true,
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeating);

			expect(screen.getByTestId("heatSource_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("heat emitters", async () => {

		const heatEmitter1 = {
			data: {
				name: "Heat emitter 1",
			},
			complete: false,
		};
		const heatEmitter2 = {
			data: {
				name: "Heat emitter 2",
			},
			complete: false,
		};
		const heatEmitter3 = {
			data: {
				name: "Heat emitter 3",
			},
			complete: false,
		};

		afterEach(() => {
			store.$reset();
		});

		it("should remove heat emitter when remove link is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [heatEmitter1],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			expect(screen.getAllByTestId("heatEmitters_items")).toBeDefined();

			await user.click(screen.getByTestId("heatEmitters_remove_0"));
			expect(screen.queryByTestId("heatEmitters_items")).toBeNull();
		});

		it("should only remove the heat emitter that is clicked if there are multiple heat emitters", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [heatEmitter1, heatEmitter2, heatEmitter3],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			await user.click(screen.getByTestId("heatEmitters_remove_1"));

			expect(screen.getByText("Heat emitter 1")).toBeDefined();
			expect(screen.getByText("Heat emitter 3")).toBeDefined();
			expect(screen.queryByText("Heat emitter 2")).toBeNull();
		});

		it("should duplicate the correct heat emitter when duplicate link is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [heatEmitter1, heatEmitter2],
					},
				},
			});
			await renderSuspended(SpaceHeating);
			await userEvent.click(screen.getByTestId("heatEmitters_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatEmitters_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatEmitters_duplicate_2"));
			await userEvent.click(screen.getByTestId("heatEmitters_duplicate_2"));

			expect(screen.queryAllByTestId("heatEmitters_item").length).toBe(6);
			expect(screen.getByText("Heat emitter 1")).toBeDefined();
			expect(screen.getByText("Heat emitter 1 (1)")).toBeDefined();
			expect(screen.getByText("Heat emitter 1 (2)")).toBeDefined();
			expect(screen.getByText("Heat emitter 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Heat emitter 1 (1) (2)")).toBeDefined();
		});
	});

	describe("mark space heating as complete", () => {
		beforeEach(async () => {
			await renderSuspended(SpaceHeating);
		});

		it("shows the 'mark as complete' button initially", async () => {

			expect(screen.getByTestId("markAsCompleteButton")?.style.display).not.toBe("none");
			expect(screen.getByTestId("completeSectionCompleted")?.style.display).toBe("none");
		});

		it("shows 'section completed' button after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			expect(screen.getByTestId("markAsCompleteButton")?.style.display).toBe("none");
			expect(screen.getByTestId("completeSectionCompleted")?.style.display).not.toBe("none");
			expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
		});

		it("marks space heating section as complete after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			type SpaceHeatingType = keyof typeof store.spaceHeating;
			const spaceHeating = store.spaceHeating;
			for (const key in spaceHeating) {
				expect(spaceHeating[key as SpaceHeatingType]?.complete).toBe(true);
			};
		});

		it("disables the mark section as complete button when data is incomplete", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{
								data: { name: "Heat source 1" },
								complete: false,
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeating);

			const markAsCompleteButton = screen.getByRole("button", { name: "Mark section as complete" });
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});
	});

	describe("mark space heating as not complete", async () => {
		it("marks section as not complete if a heat source is removed after marking complete", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ ...heatSource1, complete: false },
						],
					},
				},
			});

			await renderSuspended(SpaceHeating);
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			expect(store.spaceHeating.heatSource?.complete).toBe(true);

			await user.click(await screen.findByTestId("heatSource_remove_0"));

			expect(store.spaceHeating.heatSource?.complete).toBe(false);
			expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
		});

		it("marks heat sources section as not complete after saving an existing heat source", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatSource1, complete: true }],
					},
				},
			});


			await renderSuspended(SpaceHeating);
			await user.click(await screen.findByTestId("markAsCompleteButton"));
			expect(store.spaceHeating.heatSource?.complete).toBe(true);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.click(await screen.findByTestId("saveAndComplete"));
			expect(store.spaceHeating.heatSource?.complete).toBe(false);

			await renderSuspended(SpaceHeating);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
	});
});