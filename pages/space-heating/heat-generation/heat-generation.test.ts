import { litre } from "~/utils/units/volume";
import {
	mockNuxtImport,
	registerEndpoint,
	renderSuspended,
} from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/vue";
import HeatGeneration from "./index.vue";
import HeatPumpForm from "./heat-pump/[pump]/index.vue";
import BoilerForm from "./boiler/[boiler].vue";
import HeatBatteryForm from "./heat-battery/[battery].vue";
import HeatNetworkForm from "./heat-network/[network].vue";
import HeatInterfaceUnitForm from "./heat-interface-unit/[interface].vue";
import { getProducts } from "~/server/services/products";
import formStatus from "~/constants/formStatus";


registerEndpoint("/api/products", async () => getProducts("AirSourceHeatPump"));

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const heatGenerationData = (): Pick<spaceHeating, "heatGeneration"> => {
	return {
		heatGeneration: {
			heatPump: {
				data: [
					{
						data: {
							id: "1b6a1e50-0e1f-4bc1-b198-f84587a7fdf2",
							name: "Heat pump 1",
							productReference: "HEATPUMP-MEDIUM",
							typeOfHeatPump: "airSource",

						},
						complete: true,
					},
				],
			},
			boiler: {
				data: [
					{ id: "2eec2b28-7c7a-47c2-92bb-c13b1eaa9ae3", name: "Boiler 1" },
				],
			},
			heatBattery: {
				data: [
					{ id: "3c4bc9a3-2e7c-419a-86c9-0cb2f4768a1c", name: "Battery 1" },
				],
			},
			heatNetwork: {
				data: [
					{ id: "46d0c104-42a5-44f4-b250-f58c933b9f5e", name: "Network 1" },
				],
			},
			heatInterfaceUnit: {
				data: [
					{
						id: "55ab34d1-8238-4a90-bf3e-223a84c1f4dc",
						name: "Heat interface unit 1",
					},
				],
			},
		},
	};
};

const generatorFormAndParams = (generator: string) => {
	const data = [
		{ key: "heatPump", form: HeatPumpForm, params: "pump" },
		{ key: "boiler", form: BoilerForm, params: "boiler" },
		{ key: "heatBattery", form: HeatBatteryForm, params: "battery" },
		{ key: "heatNetwork", form: HeatNetworkForm, params: "network" },
		{
			key: "heatInterfaceUnit",
			form: HeatInterfaceUnitForm,
			params: "interface",
		},
	];

	return data.find((g) => g.key === generator);
};

const firstActionTestId = (generator: string, action: string) => {
	return `${generator}_${action}_0`;
};

describe("heat generation", () => {
	describe("heat pump", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatPump1: HeatPumpData = {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a1o",
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE",
			typeOfHeatPump: "airSource",

		};

		const heatPump2: HeatPumpData = {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a2q",
			name: "Heat pump 2",
			productReference: "HEATPUMP-MEDIUM",
			typeOfHeatPump: "airSource",
		};

		const heatPump3: HeatPumpData = {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a3f",
			name: "Heat pump 3",
			productReference: "HEATPUMP-SMALL",
			typeOfHeatPump: "airSource",
		};

		afterEach(() => {
			store.$reset();
		});

		test("heat pump is removed when remove link is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump1 }],
						},
					},
				},
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId("heatPump_items")).toBeDefined();
			await user.click(
				await screen.findByTestId(firstActionTestId("heatPump", "remove")),
			);
			expect(screen.queryByTestId("heatPump_items")).toBeNull();
		});

		it("only removes the heat pump thats is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [
								{ data: heatPump1 },
								{ data: heatPump2 },
								{ data: heatPump3 },
							],
						},
					},
				},
			});
			await renderSuspended(HeatGeneration);
			await user.click(await screen.findByTestId("heatPump_remove_1"));

			const populatedList = screen.getByTestId("heatPump_items");
			expect(within(populatedList).getByText("Heat pump 1")).toBeDefined();
			expect(within(populatedList).getByText("Heat pump 3")).toBeDefined();
			expect(within(populatedList).queryByText("Heat pump 2")).toBeNull();
		});

		it("when a heat pump is removed its also removed from store object which references it", async () => {

			const cylinder: HotWaterCylinderData = {
				id: "Any Id",
				heatSource: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a2q",
				storageCylinderVolume: unitValue(150, litre),
				dailyEnergyLoss: 73,
				name: "Hot water cylinder 1",
			};
			const wetDistribution: WetDistributionData = {
				name: "Wet distribution 1",
				heatSource: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a2q",
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
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [
								{ data: heatPump1 },
								{ data: heatPump2 },
							],
						},
					},
					heatEmitting: {
						wetDistribution: {
							data: [
								{ data: wetDistribution },
							],
						},
					},
				},
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data: [{ data: cylinder }],
						},
					},
				},

			});
			await renderSuspended(HeatGeneration);
			await user.click(await screen.findByTestId("heatPump_remove_1"));

			const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data[0]?.data;
			expect(hotWaterCylinderData?.heatSource).toBeUndefined();

			const wetDistributionData = store.spaceHeating.heatEmitting.wetDistribution.data[0]?.data;
			expect(wetDistributionData?.heatSource).toBeUndefined();
		});

		it("should display an in-progress indicator when an entry is not marked as complete", async () => {
			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [
								{
									data: heatPump1,
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getByTestId("heatPump_status_0").textContent).toBe(
				formStatus.inProgress.text,
			);
		});

		it("should display a complete indicator when an entry is marked as complete", async () => {
			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [
								{
									data: heatPump1,
									complete: true,
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getByTestId("heatPump_status_0").textContent).toBe(
				formStatus.complete.text,
			);
		});
	});

	describe("mark heat generation section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const addHeatGenerationDataToStore = async () => {
			store.$patch({
				spaceHeating: heatGenerationData(),
			});
		};

		beforeEach(async () => {
			await addHeatGenerationDataToStore();
			await renderSuspended(HeatGeneration);
		});

		afterEach(() => {
			store.$reset();
		});

		it("shows the 'mark as complete' button initially", async () => {
			expect(
				screen.getByTestId("markAsCompleteButton")?.style.display,
			).not.toBe("none");
			expect(
				screen.getByTestId("completeSectionCompleted")?.style.display,
			).toBe("none");
		});

		it("shows 'section completed' button after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			expect(screen.getByTestId("markAsCompleteButton")?.style.display).toBe(
				"none",
			);
			expect(
				screen.getByTestId("completeSectionCompleted")?.style.display,
			).not.toBe("none");
			expect(navigateToMock).toHaveBeenCalledWith("/space-heating");
		});

		it("marks heat generation section as complete after 'mark as complete' button is clicked", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));

			type HeatGenerationType =
				keyof typeof store.spaceHeating.heatGeneration;
			const heatGenerators = store.spaceHeating.heatGeneration;
			for (const key in heatGenerators) {
				expect(heatGenerators[key as HeatGenerationType]?.complete).toBe(true);
			}
		});

		it("disables the mark section as complete button when data is incomplete", async () => {
			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [
								{
									data: {
										name: "Heat pump 1",
										productReference: "HEATPUMP-LARGE",
									},
									complete: false,
								},
							],
						},
					},
				},
			});

			await renderSuspended(HeatGeneration);
			const markAsCompleteButton = screen.getByRole("button", {
				name: "Mark section as complete",
			});
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});
	});

	describe("mark heat generation as not complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const addHeatGenerationDataToStore = async () => {
			store.$patch({
				spaceHeating: heatGenerationData(),
			});
		};

		beforeEach(async () => {
			await addHeatGenerationDataToStore();
			await renderSuspended(HeatGeneration);
		});

		afterEach(() => {
			store.$reset();
		});

		it("marks heat pump section as not complete if a heat pump is removed after marking complete", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));
			await user.click(
				await screen.findByTestId(firstActionTestId("heatPump", "remove")),
			);

			// const heatGenerators = store.spaceHeating.heatGeneration;
			// type HeatGenerationType = keyof typeof store.spaceHeating.heatGeneration;
			// for (const heatGenerator in heatGenerators) {
			// 	await user.click(await screen.findByTestId(firstActionTestId(heatGenerator, "remove")));
			// 	expect(heatGenerators[heatGenerator as HeatGenerationType]?.complete).toBe(false);
			// }

			expect(store.spaceHeating.heatGeneration["heatPump"]?.complete).toBe(
				false,
			);
			expect(screen.getByTestId("markAsCompleteButton")).not.toBeNull();
		});

		it("marks heat pump section as not complete after saving an existing heat pump", async () => {
			await user.click(await screen.findByTestId("markAsCompleteButton"));
			expect(store.spaceHeating.heatGeneration.heatPump?.complete).toBe(true);

			const { form, params } = generatorFormAndParams("heatPump") || {};
			await renderSuspended(form, {
				route: {
					params: { [params!]: "0" },
				},
			});
			await user.click(await screen.findByTestId("saveAndComplete"));
			expect(store.spaceHeating.heatGeneration.heatPump.complete).toBe(false);

			await renderSuspended(HeatGeneration);
			expect(
				screen.getByRole("button", { name: "Mark section as complete" }),
			).not.toBeNull();
		});
	});
});
