import {
	mockNuxtImport,
	renderSuspended,
} from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import SpaceHeatingNew from "./index.vue";
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
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_SMALL",
		locationOfBoiler: AdjacentSpaceType.heatedSpace,
	};

	const heatSource2: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8b",
		name: "Heat source 2",
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_MEDIUM",
		locationOfBoiler: AdjacentSpaceType.heatedSpace,
	};

	const heatSource3: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8c",
		name: "Heat source 3",
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "regularBoiler",
		productReference: "BOILER_LARGE",
		locationOfBoiler: AdjacentSpaceType.heatedSpace,
	};

	describe("heat source", () => {

		it("heat source is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [
							{ data: heatSource1 },
							{ data: heatSource2 },

						],
					},
				},
			});
			await renderSuspended(SpaceHeatingNew);
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
				spaceHeatingNew: {
					heatSource: {
						data: [
							{ data: heatSource1 },
						],
					},
				},
			});
			await renderSuspended(SpaceHeatingNew);
			await userEvent.click(screen.getByTestId("heatSource_duplicate_0"));
	
	const heatSources = store.spaceHeatingNew.heatSource.data;
			expect(heatSources[1]?.data.id).not.toBe(heatSource1.id);
		});

		it("removes an item when remove link is clicked", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingNew);

			expect(screen.getAllByTestId("heatSource_items")).toBeDefined();
			await user.click(await screen.findByTestId("heatSource_remove_0"));
			expect(screen.queryByTestId("heatSource_items")).toBeNull();
		});

		it("only removes the heat source that is clicked when multiple exist", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [
							{ data: heatSource1 },
							{ data: heatSource2 },
							{ data: heatSource3 },
						],
					},
				},
			});
			await renderSuspended(SpaceHeatingNew);
			await user.click(await screen.findByTestId("heatSource_remove_1"));

			const populatedList = screen.getByTestId("heatSource_items");
			expect(within(populatedList).getByText("Heat source 1")).toBeDefined();
			expect(within(populatedList).getByText("Heat source 3")).toBeDefined();
			expect(within(populatedList).queryByText("Heat source 2")).toBeNull();
		});

		
		it.skip("when a heat pump is removed its also removed from store object which references it", async () => {


			const heatPump1: HeatSourceData = {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc811111",
				name: "Heat source 1",
				typeOfHeatSource: HeatSourceType.heatPump,
				typeOfHeatPump: "airSource",
				productReference: "HEATPUMP_LARGE",
			};
			
			const heatPump2: HeatSourceData = {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc8c22222",
				name: "Heat source 1",
				typeOfHeatSource: HeatSourceType.heatPump,
				typeOfHeatPump: "airSource",
				productReference: "HEATPUMP_LARGE",
			};

			const cylinder: HotWaterCylinderData = {
				id: "Any Id",
				heatSource: heatPump1.id,
				storageCylinderVolume: unitValue(150, litre),
				dailyEnergyLoss: 73,
				name: "Hot water cylinder 1",
			};

			const wetDistribution: WetDistributionData = {
				name: "Wet distribution 1",
				heatSource: heatPump1.id,
				thermalMass: 2,
				designTempDiffAcrossEmitters: 0.4,
				designFlowTemp: 32,
				designFlowRate: 5,
				typeOfSpaceHeater: "radiator",
				exponent: 1.3,
				constant: 0.08,
				convectionFractionWet: 0.2,
				ecoDesignControllerClass: "1",
				minimumFlowTemp: 20,
				minOutdoorTemp: 0,
				maxOutdoorTemp: 15,
				numberOfRadiators: 1,

			};

			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [
							{ data: heatPump1 },
							{ data: heatPump2 },
						],
					},
					// heatEmitting: {
					// 	wetDistribution: {
					// 		data: [
					// 			{ data: wetDistribution },
					// 		],
					// 	},
					// },
				},
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data: [{ data: cylinder }],
						},
					},
				},
			});

			await renderSuspended(SpaceHeatingNew);
			await user.click(await screen.findByTestId("heatSource_remove_1"));

			const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]?.data;
			expect(hotWaterCylinderData?.heatSource).toBeUndefined();

			const wetDistributionData = store.spaceHeating.heatEmitting.wetDistribution.data[0]?.data;
			expect(wetDistributionData?.heatSource).toBeUndefined();
		});

		it("displays an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [
							{
								data: heatSource1,
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeatingNew);

			expect(screen.getByTestId("heatSource_status_0").textContent).toBe(formStatus.inProgress.text);
		});

		it("displays a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				spaceHeatingNew: {
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

			await renderSuspended(SpaceHeatingNew);

			expect(screen.getByTestId("heatSource_status_0").textContent).toBe(formStatus.complete.text);
		});
	});

	describe("mark space heating as complete", () => {
		beforeEach(async () => {
			await renderSuspended(SpaceHeatingNew);
		});

		it("shows the 'mark as complete' button initially", async () => {

			expect(screen.getByTestId("markAsCompleteButton")?.style.display).not.toBe("none");
			expect(screen.getByTestId("completeSectionCompleted")?.style.display).toBe("none");
		});

		it("shows 'section completed' button after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			expect(screen.getByTestId("markAsCompleteButton")?.style.display).toBe("none");
			expect(screen.getByTestId("completeSectionCompleted")?.style.display).not.toBe("none");
			expect(navigateToMock).toHaveBeenCalledWith("/space-heating-new");
		});

		it("marks space heating section as complete after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			type SpaceHeatingType = keyof typeof store.spaceHeatingNew;
			const spaceHeating = store.spaceHeatingNew;
			for (const key in spaceHeating) {
				expect(spaceHeating[key as SpaceHeatingType]?.complete).toBe(true);
			};
		});

		it("disables the mark section as complete button when data is incomplete", async () => {
			store.$patch({
				spaceHeatingNew: {
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

			await renderSuspended(SpaceHeatingNew);

			const markAsCompleteButton = screen.getByRole("button", { name: "Mark section as complete" });
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});
	});

	describe("mark space heating as not complete", async () => {
		it("marks section as not complete if a heat source is removed after marking complete", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [
							{ ...heatSource1, complete: false },
						],
					},
				},
			});
			
			await renderSuspended(SpaceHeatingNew);
			await user.click(await screen.findByTestId("markAsCompleteButton"));
			
			expect(store.spaceHeatingNew.heatSource?.complete).toBe(true);

			await user.click(await screen.findByTestId("heatSource_remove_0"));

			expect(store.spaceHeatingNew.heatSource?.complete).toBe(false);
			expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
		});
		
		it("marks heat sources section as not complete after saving an existing heat source", async () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource1, complete: true }],
					},
				},
			});


			await renderSuspended(SpaceHeatingNew);
			await user.click(await screen.findByTestId("markAsCompleteButton"));
			expect(store.spaceHeatingNew.heatSource?.complete).toBe(true);

			await renderSuspended(HeatSourceForm, {
				route: {
					params: { "heatSource": "0" },
				},
			});

			await user.click(await screen.findByTestId("saveAndComplete"));
			expect(store.spaceHeatingNew.heatSource?.complete).toBe(false);

			await renderSuspended(SpaceHeatingNew);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
	});
});