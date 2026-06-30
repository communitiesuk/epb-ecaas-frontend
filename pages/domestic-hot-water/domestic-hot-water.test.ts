import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import DomesticHotWater from "@/pages/domestic-hot-water/index.vue";
import { screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import formStatus from "~/constants/formStatus";
import type { DomesticHotWaterHeatSourceData, EcaasForm, HeatSourceData, PreheatedWaterStorageData, WaterStorageData, WwhrsData } from "~/stores/ecaasStore.schema";
import HotWaterOutlets from "./hot-water-outlets/[outlet]/index.vue";
import { litre } from "~/utils/units/volume";
import { celsius } from "~/utils/units/temperature";

const baseCompleteForm = {
	data: [],
	complete: true,
};

describe("Domestic hot water", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const heatSource1 = {
		data: {
			name: "Jasper's Beating Heart",
			id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER-12345",
			needsSpecifiedLocation: true,
			specifiedLocation: "internal",
			heatSourceId: "NEW_HEAT_SOURCE",
			maxFlowTemp: unitValue(12, celsius),
		},
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const preheatedStorage1: EcaasForm<PreheatedWaterStorageData> = {
		data: {
			name: "Preheated water cylinder",
			id: "0f3f13fe-6200-49f2-9e4f-91125ae974f3",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres" as const,
			},
			dailyEnergyLoss: 69,
			typeOfWaterStorage: "hotWaterCylinder",
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
			coldWaterSource: "mainsWater",
		},
	};

	const wwhrs1: EcaasForm<WwhrsData> = {
		data: {
			id: "baae7e60-7158-4e13-a14c-2d1c228766de",
			name: "WWHRS 1",
			coldWaterSource: "mainsWater",
			productReference: "1000",
		},
	};

	const hwStorage1: EcaasForm<WaterStorageData> = {
		data: {
			name: "Jasper's Cylinder 1",
			id: "what",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres" as const,
			},
			dailyEnergyLoss: 69,
			typeOfWaterStorage: "hotWaterCylinder",
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
			coldWaterSource: "mainsWater",
		},
	};

	const hwOutlet1: EcaasForm<HotWaterOutletsData> = {
		data: {
			name: "Jasper's Steamy Bath",
			typeOfHotWaterOutlet: "bath",
			coldWaterSource: "mainsWater",
			id: "outlet1",
			size: 100,
		},
	};

	const pipework1: EcaasForm<PipeworkData> = {
		data: {
			name: "Jasper's Pipework 1",
			waterStorage: "what",
			internalDiameter: 69,
			externalDiameter: 420,
			length: 200,
			insulationThickness: 10,
			thermalConductivity: 1541,
			surfaceReflectivity: true,
			pipeContents: "glycol25",
			location: "unheatedSpace",
		},
	};

	describe("Preheated water storage", () => {
		test("displays existing preheated water storage", async () => {
			store.$patch({
				domesticHotWater: {
					preheatedWaterStorage: {
						...baseCompleteForm,
						data: [preheatedStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(preheatedStorage1.data.name)).toBeDefined();
		});

		test("preheated water storage is removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					preheatedWaterStorage: {
						...baseCompleteForm,
						data: [preheatedStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("preheatedWaterStorage_items")).toBeDefined();

			await user.click(screen.getByTestId("preheatedWaterStorage_remove_0"));
			expect(screen.queryByTestId("preheatedWaterStorage_items")).toBeNull();
		});

		test("only 1 preheated water storage item can be added", async () => {
			store.$patch({
				domesticHotWater: {
					preheatedWaterStorage: {
						...baseCompleteForm,
						data: [preheatedStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.queryByTestId("preheatedWaterStorage_add")).toBeNull();
		});
	});

	describe("Water storage", () => {
		const hwStorage2: EcaasForm<SmartHotWaterTankData> = {
			data: {
				name: "Jasper's Cylinder 2",
				id: "what2",
				typeOfWaterStorage: "smartHotWaterTank",
				heaterPosition: 0.8,
				productReference: "SMART-12345",
				coldWaterSource: "mainsWater",
			},
		};

		const hwStorage3: EcaasForm<HotWaterCylinderData> = {
			data: {
				name: "Jasper's Cylinder 3",
				id: "what3",
				storageCylinderVolume: {
					amount: 102,
					unit: "litres",
				},
				dailyEnergyLoss: 71,
				typeOfWaterStorage: "hotWaterCylinder",
				areaOfHeatExchanger: 2.5,
				heaterPosition: 0.8,
				thermostatPosition: 0.5,
				coldWaterSource: "mainsWater",
			},
		};

		// Can't get href to point to the right thing :(

		// test("Navigates to water storage create form when add link is clicked", async () => {
		// 	await renderSuspended(DomesticHotWater);

		// 	const addLink = await screen.findByTestId<HTMLAnchorElement>("waterStorage_add");

		// 	expect(new URL(addLink.href).pathname).toBe(
		// 		getUrl("waterStorageCreate"),
		// 	);
		// });

		test("Displays existing water storage", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						...baseCompleteForm,
						data: [hwStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(hwStorage1.data.name)).toBeDefined();
		});

		test("water storage is removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						...baseCompleteForm,
						data: [hwStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("waterStorage_items")).toBeDefined();

			await user.click(screen.getByTestId("waterStorage_remove_0"));
			expect(screen.queryByTestId("waterStorage_items")).toBeNull();
		});

		it("should only remove the water storage object that is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						...baseCompleteForm,
						data: [hwStorage1, hwStorage2, hwStorage3],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("waterStorage_remove_1"));

			const populatedList = screen.getByTestId("waterStorage_items");

			expect(within(populatedList).getByText(hwStorage1.data.name)).toBeDefined();
			expect(within(populatedList).getByText(hwStorage3.data.name)).toBeDefined();
			expect(within(populatedList).queryByText(hwStorage2.data.name)).toBeNull();
		});

		test("water storage is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [hwStorage1, hwStorage2],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_0"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_0"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_2"));
			await userEvent.click(screen.getByTestId("waterStorage_duplicate_2"));
			expect(screen.queryAllByTestId("waterStorage_item").length).toBe(6);
			expect(screen.getByText(hwStorage1.data.name)).toBeDefined();
			expect(screen.getByText(`${hwStorage1.data.name} (1)`)).toBeDefined();
			expect(screen.getByText(`${hwStorage1.data.name} (2)`)).toBeDefined();
			expect(screen.getByText(`${hwStorage1.data.name} (1) (1)`)).toBeDefined();
			expect(screen.getByText(`${hwStorage1.data.name} (1) (2)`)).toBeDefined();
		});

		it("when a water storage object is removed its id should be removed from all store items which reference it ", async () => {
			const pipework2: EcaasForm<PipeworkData> = {
				data: {
					name: "Jasper's Pipework 2",
					waterStorage: hwStorage1.data.id,
					internalDiameter: 70,
					externalDiameter: 421,
					length: 200,
					insulationThickness: 10,
					thermalConductivity: 1541,
					surfaceReflectivity: false,
					pipeContents: "glycol25",
					location: "unheatedSpace",
				},
			};

			const pipework3: EcaasForm<PipeworkData> = {
				data: {
					name: "Jasper's Pipework 3",
					waterStorage: hwStorage2.data.id,
					internalDiameter: 6.9,
					externalDiameter: 42,
					length: 20,
					insulationThickness: 1,
					thermalConductivity: 15,
					surfaceReflectivity: true,
					pipeContents: "water",
					location: "heatedSpace",
				},
			};

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [hwStorage1, hwStorage2],
					},
					pipework: {
						data: [pipework2, pipework3],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(await screen.findByTestId("waterStorage_remove_1"));
			const { pipework } = store.domesticHotWater;

			expect(pipework.data[0]?.data.waterStorage).toBe(hwStorage1.data.id);
			expect(pipework.data[1]?.data.waterStorage).toBeUndefined();
		});

		test("the user should not be able to input a water storage when a point of use heat source is selected error message", async () => {
			const pointOfUse = {
				data: {
					typeOfHeatSource: "pointOfUse",
					id: "fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
					heatSourceId: "NEW_HEAT_SOURCE",
					isExistingHeatSource: false,
					name: "DHW POU",
					coldWaterSource: "mainsWater",
					heaterEfficiency: 0.88,
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [pointOfUse],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(store.domesticHotWater.waterStorage.data.length).toBe(0);
			const bodyText = document.querySelector(".govuk-summary-card__content .govuk-body");

			expect(bodyText?.textContent).toBeTruthy();
		});
	});

	describe("Hot water outlets", () => {
		const hwOutlet2: EcaasForm<HotWaterOutletsData> = {
			data: {
				name: "Jasper's Powerful Shower",
				typeOfHotWaterOutlet: "mixedShower",
				coldWaterSource: "mainsWater",
				id: "outlet2",
				flowRate: 100,
				wwhrs: false,
				isAirPressureShower: false,
			},
		};

		const hwOutlet3: EcaasForm<HotWaterOutletsData> = {
			data: {
				name: "Jasper's Ambiguous Water Outlet",
				typeOfHotWaterOutlet: "otherHotWaterOutlet",
				coldWaterSource: "mainsWater",
				id: "outlet3",
				flowRate: 100,
			},
		};


		// Can't get href to point to the right thing :(

		// test("Navigates to water storage create form when add link is clicked", async () => {
		// 	await renderSuspended(DomesticHotWater);

		// 	const addLink = await screen.findByTestId<HTMLAnchorElement>("hotWaterOutlets_add");

		// 	expect(new URL(addLink.href).pathname).toBe(
		// 		getUrl("hotWaterOutletsCreate"),
		// 	);
		// });

		test("Displays existing hot water outlets", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [hwOutlet1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(hwOutlet1.data.name)).toBeDefined();
		});

		test("hot water outlets are removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [hwOutlet1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("hotWaterOutlets_items")).toBeDefined();

			await user.click(screen.getByTestId("hotWaterOutlets_remove_0"));
			expect(screen.queryByTestId("hotWaterOutlets_items")).toBeNull();
		});

		it("should only remove the hot water outlets object that is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [hwOutlet1, hwOutlet2, hwOutlet3],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("hotWaterOutlets_remove_1"));

			const populatedList = screen.getByTestId("hotWaterOutlets_items");

			expect(within(populatedList).getByText(hwOutlet1.data.name)).toBeDefined();
			expect(within(populatedList).getByText(hwOutlet3.data.name)).toBeDefined();
			expect(within(populatedList).queryByText(hwOutlet2.data.name)).toBeNull();
		});

		test("hot water outlets are duplicated when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [
							hwOutlet1,
							hwOutlet2,
						],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await userEvent.click(screen.getByTestId("hotWaterOutlets_duplicate_0"));
			await userEvent.click(screen.getByTestId("hotWaterOutlets_duplicate_0"));
			await userEvent.click(screen.getByTestId("hotWaterOutlets_duplicate_2"));
			await userEvent.click(screen.getByTestId("hotWaterOutlets_duplicate_2"));
			expect(screen.queryAllByTestId("hotWaterOutlets_item").length).toBe(6);
			expect(screen.getByText(hwOutlet1.data.name)).toBeDefined();
			expect(screen.getByText(`${hwOutlet1.data.name} (1)`)).toBeDefined();
			expect(screen.getByText(`${hwOutlet1.data.name} (2)`)).toBeDefined();
			expect(screen.getByText(`${hwOutlet1.data.name} (1) (1)`)).toBeDefined();
			expect(screen.getByText(`${hwOutlet1.data.name} (1) (2)`)).toBeDefined();
		});

		test("prevents user completing hot water outlets unless at least one 'other' type is present", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [{ ...hwOutlet1, complete: true }],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"You must add at least one hot water outlet that has the type 'other'",
			);
		});
	});

	describe("Pipework", () => {
		const pipework2: EcaasForm<PipeworkData> = {
			data: {
				name: "Jasper's Pipework 2",
				waterStorage: "what",
				internalDiameter: 554,
				externalDiameter: 545,
				length: 2,
				insulationThickness: 510,
				thermalConductivity: 15441,
				surfaceReflectivity: false,
				pipeContents: "water",
				location: "heatedSpace",
			},
		};

		const pipework3: EcaasForm<PipeworkData> = {
			data: {
				name: "Jasper's Pipework 3",
				waterStorage: "what",
				internalDiameter: 691,
				externalDiameter: 42310,
				length: 20,
				insulationThickness: 110,
				thermalConductivity: 15141,
				surfaceReflectivity: true,
				pipeContents: "glycol25",
				location: "unheatedSpace",
			},
		};


		// Can't get href to point to the right thing :(

		// test("Navigates to water storage create form when add link is clicked", async () => {
		// 	await renderSuspended(DomesticHotWater);

		// 	const addLink = await screen.findByTestId<HTMLAnchorElement>("pipework_add");

		// 	expect(new URL(addLink.href).pathname).toBe(
		// 		getUrl("pipeworkCreate"),
		// 	);
		// });

		test("Displays existing pipework", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						data: [pipework1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(pipework1.data.name)).toBeDefined();
		});

		test("pipework are removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						data: [pipework1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("pipework_items")).toBeDefined();

			await user.click(screen.getByTestId("pipework_remove_0"));
			expect(screen.queryByTestId("pipework_items")).toBeNull();
		});

		it("should only remove the pipework object that is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						data: [pipework1, pipework2, pipework3],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("pipework_remove_1"));

			const populatedList = screen.getByTestId("pipework_items");

			expect(within(populatedList).getByText(pipework1.data.name)).toBeDefined();
			expect(within(populatedList).getByText(pipework3.data.name)).toBeDefined();
			expect(within(populatedList).queryByText(pipework2.data.name)).toBeNull();
		});

		test("pipework is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						data: [
							pipework1,
							pipework2,
						],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await userEvent.click(screen.getByTestId("pipework_duplicate_0"));
			await userEvent.click(screen.getByTestId("pipework_duplicate_0"));
			await userEvent.click(screen.getByTestId("pipework_duplicate_2"));
			await userEvent.click(screen.getByTestId("pipework_duplicate_2"));
			expect(screen.queryAllByTestId("pipework_item").length).toBe(6);
			expect(screen.getByText(pipework1.data.name)).toBeDefined();
			expect(screen.getByText(`${pipework1.data.name} (1)`)).toBeDefined();
			expect(screen.getByText(`${pipework1.data.name} (2)`)).toBeDefined();
			expect(screen.getByText(`${pipework1.data.name} (1) (1)`)).toBeDefined();
			expect(screen.getByText(`${pipework1.data.name} (1) (2)`)).toBeDefined();
		});
	});

	describe("Heat Sources", () => {
		const heatSource2 = {
			data: {
				name: "Solar Thermal System 1",
				id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bc",
				coldWaterSource: "headerTank",
				isExistingHeatSource: false,
				typeOfHeatSource: "solarThermalSystem",
				heatSourceId: "NEW_HEAT_SOURCE",
				locationOfCollectorLoopPiping: "heatedSpace",
				collectorModuleArea: 2,
				numberOfCollectorModules: 6,
				peakCollectorEfficiency: 0.94,
				incidenceAngleModifier: 0.4,
				firstOrderHeatLossCoefficient: 0.5,
				secondOrderHeatLossCoefficient: 0.6,
				heatLossCoefficientOfSolarLoopPipe: 0.7,
				collectorMassFlowRate: 10,
				powerOfCollectorPump: { amount: 50, unit: "kilowatt" },
				powerOfCollectorPumpController: { amount: 10, unit: "kilowatt" },
				pitch: 70,
				orientation: 32,
			},
			complete: true,
		} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

		// // Can't get href to point to the right thing :(

		// // test("Navigates to water storage create form when add link is clicked", async () => {
		// // 	await renderSuspended(DomesticHotWater);

		// // 	const addLink = await screen.findByTestId<HTMLAnchorElement>("heatSources_add");

		// // 	expect(new URL(addLink.href).pathname).toBe(
		// // 		getUrl("heatSourcesCreate"),
		// // 	);
		// // });

		test("Displays existing heat source", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [heatSource1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(heatSource1.data.name)).toBeDefined();
		});

		test("Only one heat source can be added", async () => {
			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("heatSources_add")).toBeDefined();

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [heatSource1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			expect(screen.queryByTestId("heatSources_add")).toBeNull();
		});

		test("two heat sources can be added if pre-heated water tank and hot water cylinder have been added", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{
							data: {
								...heatSource1.data,
								coldWaterSource: preheatedStorage1.data.id,
							},
						}],
					},
					preheatedWaterStorage: {
						data: [preheatedStorage1],
					},
					waterStorage: {
						data: [hwStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByTestId("heatSources_add")).toBeDefined();

			store.$patch(state => {
				state.domesticHotWater.heatSources.data.push({
					data: {
						...heatSource1.data,
						id: "fb62acf2-10b1-4983-bc08-7350f8e4a413",
						name: "Heat source 2",
					},
				});
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.queryByTestId("heatSources_add")).toBeNull();
		});

		test("two heat sources cannot be added if heat source is not connected to pre-heated water tank", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [heatSource1],
					},
					preheatedWaterStorage: {
						data: [preheatedStorage1],
					},
					waterStorage: {
						data: [hwStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.queryByTestId("heatSources_add")).toBeNull();
		});

		test("heat sources are removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [heatSource1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getAllByTestId("heatSources_items")).toBeDefined();

			await user.click(screen.getByTestId("heatSources_remove_0"));
			expect(screen.queryByTestId("heatSources_items")).toBeNull();
		});

		// it("references to the deleted DHW booster heat pump are removed from all heat network items", async () => {

		// 	const heatNetwork: Partial<HeatSourceData> = {
		// 		id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
		// 		typeOfHeatSource: "heatNetwork",
		// 		typeOfHeatNetwork: "communalHeatNetwork",
		// 		isHeatNetworkInPcdb: true,
		// 		hasBoosterHeatPump: true,
		// 		boosterHeatPumpId: boosterHeatPumpHotWater.data.id,
		// 	};

		// 	store.$patch({
		// 		domesticHotWater: {
		// 			heatSources: {
		// 				data: [boosterHeatPumpHotWater],
		// 			},
		// 		},
		// 		spaceHeating: {
		// 			heatSource: {
		// 				data: [{ data: heatNetwork, complete: true }],
		// 			},
		// 		},
		// 	});

		// 	await renderSuspended(DomesticHotWater);
		// 	await user.click(await screen.findByTestId("heatSources_remove_0"));

		// 	const heatNetworkItem = store.spaceHeating.heatSource.data[0];
		// 	expect((heatNetworkItem?.data as { boosterHeatPumpId: string }).boosterHeatPumpId).toBe(undefined);
		// 	expect(heatNetworkItem?.complete).toBe(false);
		// });

		test("heat sources cannot be duplicated", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							heatSource1,
							heatSource2,
						],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			expect(screen.queryByTestId("heatSources_duplicate_0")).toBeNull();
		});

		describe("packaged heat sources", () => {
			const heatPump: HeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				name: "Heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "hybridHeatPump",
				productReference: "1000",
				packageProductIds: ["171a20a4-e775-4e51-873c-f1fc536076b1"],
				isConnectedToHeatNetwork: false,
				energySupply: "electricity",
				maxFlowTemp: unitValue(30, celsius),
			};

			const boiler: HeatSourceData = {
				id: "171a20a4-e775-4e51-873c-f1fc536076b1",
				name: "Combi boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				productReference: "2000",
				packagedProductReference: "1000",
				needsSpecifiedLocation: false,
				maxFlowTemp: unitValue(32, celsius),
			};

			const exhaustAirHeatPump: HeatSourceData = {
				id: "6d6587de-c0a9-42df-805c-23d9e9823f22",
				name: "Exhaust air heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "exhaustAirMvhr",
				productReference: "1000",
				packageProductIds: [
					"9e66d667-6c31-4406-9223-7e2249a7fee3",
					"f6182db2-42e2-4d7e-beb8-de6f9a8f2be9",
				],
				isConnectedToHeatNetwork: false,
				energySupply: "electricity",
				maxFlowTemp: unitValue(30, celsius),
			};

			const mvhr: Partial<MechanicalVentilationData> = {
				id: "9e66d667-6c31-4406-9223-7e2249a7fee3",
				name: "Exhaust air MVHR HP",
				productReference: "1000",
				typeOfMechanicalVentilationOptions: "MVHR",
				packagedProductReference: "1000",
			};

			const hotWaterCylinder: Partial<WaterStorageData> = {
				id: "f6182db2-42e2-4d7e-beb8-de6f9a8f2be9",
				name: "Hot water cylinder HP",
				typeOfWaterStorage: "hotWaterCylinder",
				packagedProductReference: "1000",
			};

			beforeEach(async () => {
				store.$patch({
					domesticHotWater: {
						heatSources: {
							data: [
								{ data: heatPump, complete: true },
								{ data: boiler, complete: true },
							],
						},
					},
				});
			});

			it("removes heat sources which are packaged with the removed item", async () => {
				await renderSuspended(DomesticHotWater);

				await user.click(await screen.findByTestId("heatSources_remove_0"));
				expect(store.domesticHotWater.heatSources.data.length).toBe(0);
			});

			it("only displays an 'edit' action if heat source is packaged with a heat pump", async () => {
				await renderSuspended(DomesticHotWater);

				const boilerEditButton = screen.getByTestId("heatSources_edit_1");
				const boilerDeleteButton = screen.queryByTestId("heatSources_remove_1");

				expect(boilerEditButton).toBeDefined();
				expect(boilerDeleteButton).toBeNull();
			});

			it("only displayed an 'edit' action if heat source references an existing heat source which is comes with a hot water cylinder", async () => {
				const heatPumpWithCylinder: HeatSourceData = {
					...heatPump,
					packageProductIds: ["c84528bb-f805-4f1e-95d3-2bd1717deca1"],
				};

				const existingHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
					id: "aed8bb17-9359-42c6-bda6-8ba551f1df2a",
					isExistingHeatSource: true,
					createdAutomatically: true,
					heatSourceId: heatPump.id,
				};

				const hotWaterCylinder: HotWaterCylinderData = {
					name: "Hot water cylinder 1",
					id: "c84528bb-f805-4f1e-95d3-2bd1717deca1",
					typeOfWaterStorage: "hotWaterCylinder",
					storageCylinderVolume: unitValue(5, litre),
					dailyEnergyLoss: 1,
					areaOfHeatExchanger: 1000,
					heaterPosition: 0.8,
					thermostatPosition: 0.5,
					packagedProductReference: heatPump.productReference,
					coldWaterSource: "mainsWater",
				};

				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: heatPumpWithCylinder },
							],
						},
					},
					domesticHotWater: {
						heatSources: {
							data: [
								{ data: existingHeatPump },
							],
						},
						waterStorage: {
							data: [
								{ data: hotWaterCylinder },
							],
						},
					},
				});

				await renderSuspended(DomesticHotWater);

				const heatPumpEditButton = screen.getByTestId("heatSources_edit_0");
				const heatSourcesDeleteButton = screen.queryByTestId("heatSources_remove_0");

				expect(heatPumpEditButton).toBeDefined();
				expect(heatSourcesDeleteButton).toBeNull();
			});

			it("removes mechanical vent and hot water cylinder packaged with the removed heat pump", async () => {
				store.$patch({
					domesticHotWater: {
						heatSources: {
							data: [
								{ data: exhaustAirHeatPump, complete: true },
							],
						},
						waterStorage: {
							data: [
								{ data: hotWaterCylinder },
							],
						},
					},
					infiltrationAndVentilation: {
						mechanicalVentilation: {
							data: [
								{ data: mvhr },
							],
						},
					},
				});

				await renderSuspended(DomesticHotWater);

				await user.click(await screen.findByTestId("heatSources_remove_0"));

				expect(store.domesticHotWater.heatSources.data.length).toBe(0);
				expect(store.domesticHotWater.waterStorage.data.length).toBe(0);
				expect(store.infiltrationAndVentilation.mechanicalVentilation.data.length).toBe(0);
			});
		});
	});

	test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
		store.$patch({
			domesticHotWater: {
				waterStorage: {
					data: [hwStorage1],
				},
			},
		});

		await renderSuspended(DomesticHotWater);

		expect(screen.getByTestId("waterStorage_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});

	describe("mark section as complete", () => {

		const addCompleteHotWaterToStore = async () => {
			const otherOutlet: EcaasForm<HotWaterOutletsData> = {
				data: {
					name: "Other outlet for completion",
					typeOfHotWaterOutlet: "otherHotWaterOutlet",
					coldWaterSource: "mainsWater",
					id: "outlet-complete",
					flowRate: 12,
				},
				complete: true,
			};

			store.$patch({
				domesticHotWater: {
					waterStorage: { data: [{ ...hwStorage1, complete: true }] },
					wwhrs: { data: [{ ...wwhrs1, complete: true }] },
					hotWaterOutlets: { data: [{ ...hwOutlet1, complete: true }, otherOutlet] },
					pipework: { data: [{ ...pipework1, complete: true }] },
					heatSources: { data: [{ ...heatSource1, complete: true }] },
				},
			});
		};

		const otherHotWaterOutlet: EcaasForm<HotWaterOutletsData> = {
			data: {
				name: "Other outlet for completion",
				typeOfHotWaterOutlet: "otherHotWaterOutlet",
				coldWaterSource: "mainsWater",
				id: "outlet-complete",
				flowRate: 12,
			},
			complete: true,
		};


		beforeEach(async () => {
			await renderSuspended(DomesticHotWater);
		});

		// const hotWaterForms = {
		// 	waterStorage: WaterStorageForm,
		// 	hotWaterOutlets: HotWaterOutletsForm,
		// };

		// type SectionKey = keyof typeof store.domesticHotWater;

		it("disables the Mark section as complete button when a section is incomplete", async () => {
			store.$patch({
				domesticHotWater: {
					waterStorage: { data: [{ ...hwStorage1, complete: false }] },
					hotWaterOutlets: { data: [{ ...hwOutlet1, complete: false }] },
				},
			});

			await renderSuspended(DomesticHotWater);
			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeTruthy();
		});

		it("enables the Mark section as complete button when all sections are complete", async () => {
			await addCompleteHotWaterToStore();
			await renderSuspended(DomesticHotWater);

			expect(
				screen.getByTestId("markAsCompleteButton").hasAttribute("disabled"),
			).toBeFalsy();
		});

		it("displays a 'Completed' status indicator when section is marked as complete", async () => {
			await addCompleteHotWaterToStore();
			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).not.toBe("none");
		});

		it("displays an error message showing water storage is required if an immersion heater heat source has been selected", async () => {
			const immersionHeater = {
				data: {
					typeOfHeatSource: "immersionHeater",
					id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
					heatSourceId: "NEW_HEAT_SOURCE",
					isExistingHeatSource: false,
					name: "DHW immersion",
					coldWaterSource: "mainsWater",
					power: 49,
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [otherHotWaterOutlet],
					},
					heatSources: {
						data: [immersionHeater],
					},
					waterStorage: {
						data: [],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			);

			const link = errorSummary.querySelector("a");

			expect(link?.getAttribute("href")).toContain("water-storage");
		});

		it("displays an error message showing water storage is required if a solar thermal system heat source has been selected", async () => {
			const solarThermalSystem = {
				data: {
					typeOfHeatSource: "solarThermalSystem",
					id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
					heatSourceId: "NEW_HEAT_SOURCE",
					isExistingHeatSource: false,
					name: "DHW immersion",
					coldWaterSource: "mainsWater",
					locationOfCollectorLoopPiping: "heatedSpace",
					collectorModuleArea: 24,
					numberOfCollectorModules: 3,
					peakCollectorEfficiency: 0.99,
					incidenceAngleModifier: 42,
					firstOrderHeatLossCoefficient: 0.2,
					secondOrderHeatLossCoefficient: 0.33,
					heatLossCoefficientOfSolarLoopPipe: 0.6,
					collectorMassFlowRate: 29,
					powerOfCollectorPump: { amount: 39, unit: "kilowatt" },
					powerOfCollectorPumpController: { amount: 2, unit: "kilowatt" },
					pitch: 19,
					orientation: 11,
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;


			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [otherHotWaterOutlet],
					},
					heatSources: {
						data: [solarThermalSystem],
					},
					waterStorage: {
						data: [], 
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			);

			const link = errorSummary.querySelector("a");

			expect(link?.getAttribute("href")).toContain("water-storage");
		});

		it("displays an error message showing water storage is required if a heat pump heat source has been selected", async () => {
			const heatPump = {
				data: {
					id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
					heatSourceId: "NEW_HEAT_SOURCE",
					name: "DHW heatPump",
					typeOfHeatSource: "heatPump",
					coldWaterSource: "mainsWater",
					isExistingHeatSource: false,
					productReference: "HP-12345",
					typeOfHeatPump: "airSource",
					maxFlowTemp: unitValue(17, celsius),
					isConnectedToHeatNetwork: false,
					energySupply: "electricity",
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [otherHotWaterOutlet],
					},
					heatSources: {
						data: [heatPump],
					},
					waterStorage: {
						data: [],
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			);

			const link = errorSummary.querySelector("a");

			expect(link?.getAttribute("href")).toContain("water-storage");
		});

		it("displays an error message showing water storage is require if space heating heat pump has been selected", async () => {
			const spaceHeatingHeatPump = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b52222",
					name: "Booster HP",
					typeOfHeatSource: "heatPump",
					typeOfHeatPump: "booster",
					productReference: "HEATPUMP-SMALL",
					isConnectedToHeatNetwork: false,
					energySupply: "electricity",
					maxFlowTemp: unitValue(30, celsius),
				},
				complete: true,
			} as const satisfies EcaasForm<HeatSourceData>;
			
			const dhwWithExistingHeatPump = {
				data: {
					id: "463c94f6-566c-49b2-af27-57e5c68b5c62",
					coldWaterSource: "headerTank",
					isExistingHeatSource: true,
					heatSourceId: spaceHeatingHeatPump.data.id,
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;


			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [spaceHeatingHeatPump],
					},
				},
				domesticHotWater: {
					waterStorage: {
						data: [],
					},
					heatSources: {
						data: [dhwWithExistingHeatPump],
					},
					hotWaterOutlets: {
						data: [otherHotWaterOutlet],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			);

			const link = errorSummary.querySelector("a");

			expect(link?.getAttribute("href")).toContain("water-storage");
		});

		it("displays an error when two heat sources are added without one being connected to a pre-heated water tank", async () => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{
							data: {
								...heatSource1.data,
								coldWaterSource: preheatedStorage1.data.id,
							},
						}],
					},
					preheatedWaterStorage: {
						data: [preheatedStorage1],
					},
					waterStorage: {
						data: [hwStorage1],
					},
				},
			});

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							heatSource1,
							{
								data: {
									...heatSource1.data,
									coldWaterSource: preheatedStorage1.data.id,
								},
							},
						],
					},
					preheatedWaterStorage: {
						data: [preheatedStorage1],
					},
					waterStorage: {
						data: [hwStorage1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");

			expect(errorSummary.textContent).toContain(
				"You can only have two heat sources if one is connected to a pre-heated water tank.",
			);
		});

		it("displays all error messages if there are more than one", async () => {
			const heatPump = {
				data: {
					id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bb",
					heatSourceId: "NEW_HEAT_SOURCE",
					name: "DHW heatPump",
					typeOfHeatSource: "heatPump",
					coldWaterSource: "mainsWater",
					isExistingHeatSource: false,
					productReference: "HP-12345",
					typeOfHeatPump: "airSource",
					maxFlowTemp: unitValue(17, celsius),
					isConnectedToHeatNetwork: false,
					energySupply: "electricity",
				},
				complete: true,
			} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;


			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [],
					},
					heatSources: {
						data: [heatPump],
					},
					waterStorage: {
						data: [],
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = await screen.findByTestId("domesticHotWaterErrorSummary");
			expect(errorSummary.textContent).toContain(
				"Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			);
			expect(errorSummary.textContent).toContain(
				"You must add at least one hot water outlet that has the type 'other'",
			);

			const links = errorSummary.querySelectorAll("a");

			expect(links[0]?.getAttribute("href")).toContain("hot-water-outlets");
			expect(links[1]?.getAttribute("href")).toContain("water-storage");
		});

		it("does not display error summary when requirements are met", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						data: [otherHotWaterOutlet],
					},
					heatSources: {
						data: [{ ...heatSource1 }],
					},
					waterStorage: {
						data: [{ ...hwStorage1 }],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("markAsCompleteButton"));

			const errorSummary = screen.queryByTestId("domesticHotWaterErrorSummary");

			expect(errorSummary).toBeNull();
		});

		describe("after section has been marked as complete", () => {
			beforeEach(async () => {
				await addCompleteHotWaterToStore();
				await renderSuspended(DomesticHotWater);
				await user.click(screen.getByTestId("markAsCompleteButton"));
			});

			it("displays the 'Completed' section status indicator", async () => {
				const completed = screen.queryByTestId("completeSectionCompleted");
				expect(completed?.style.display).not.toBe("none");
			});

			it("navigates to the home page", async () => {
				expect(navigateToMock).toHaveBeenCalledWith("/");
			});

			it("marks each domestic hot water section as complete", () => {
				const { waterStorage, hotWaterOutlets } = store.domesticHotWater;
				expect(waterStorage?.complete).toBe(true);
				expect(hotWaterOutlets?.complete).toBe(true);
			});

			it("marks section as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("waterStorage_remove_0"));
				await user.click(screen.getByTestId("hotWaterOutlets_remove_0"));

				const { waterStorage, hotWaterOutlets } = store.domesticHotWater;
				expect(waterStorage?.complete).toBe(false);
				expect(hotWaterOutlets?.complete).toBe(false);
			});

			it("marks section as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("waterStorage_duplicate_0"));
				await user.click(screen.getByTestId("hotWaterOutlets_duplicate_0"));

				const { waterStorage, hotWaterOutlets } = store.domesticHotWater;
				expect(waterStorage?.complete).toBe(false);
				expect(hotWaterOutlets?.complete).toBe(false);
			});

			it("marks hot water outlets section as not complete after editing an existing outlet", async () => {
				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: {
							data: [{ data: hwOutlet1.data, complete: true }],
						},
						heatSources: {
							data: [{ data: heatSource1.data, complete: true }],
						},
					},
				});

				await renderSuspended(DomesticHotWater);
				await user.click(await screen.findByTestId("markAsCompleteButton"));
				expect(store.domesticHotWater.hotWaterOutlets?.complete).toBe(true);

				await renderSuspended(HotWaterOutlets, {
					route: {
						params: { "outlet": "0" },
					},
				});

				await user.click(screen.getByTestId("typeOfHotWaterOutlet_bath"));

				await user.click(await screen.findByTestId("saveAndComplete"));
				expect(store.domesticHotWater.hotWaterOutlets?.complete).toBe(false);

				await renderSuspended(DomesticHotWater);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			});
		});
	});

	describe("when imported file contains more than one DHW heat source", () => {

		const extraHeatSource: Partial<DomesticHotWaterHeatSourceData> = {
			name: "Extra heat source",
			id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f11111",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
		};

		beforeEach(() => {
			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{ data: heatSource1.data, complete: true }, { data: extraHeatSource }],
					},
				},
			});
		});

		it("disables the mark section as complete button", async () => {

			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("markAsCompleteButton").hasAttribute("disabled")).toBeTruthy();
		});

		it("displays an error message informing users to remove the extra heat source/s", async () => {

			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("domesticHotWaterErrorSummary")).toBeDefined();
			expect(screen.getByText("You can only have one heat source for domestic hot water. Please delete any heat sources that should not be used")).toBeDefined();
		});

		it("does not display error message when all / both heat sources are packaged", async () => {
			const heatPump: HeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				name: "Heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "hybridHeatPump",
				productReference: "1000",
				packageProductIds: ["171a20a4-e775-4e51-873c-f1fc536076b1"],
				isConnectedToHeatNetwork: false,
				energySupply: "electricity",
				maxFlowTemp: unitValue(30, celsius),
			};

			const boiler: HeatSourceData = {
				id: "171a20a4-e775-4e51-873c-f1fc536076b1",
				name: "Combi boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				productReference: "2000",
				packagedProductReference: "1000",
				needsSpecifiedLocation: false,
				maxFlowTemp: unitValue(32, celsius),
			};

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							{ data: heatPump, complete: true },
							{ data: boiler, complete: true },
						],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.queryByTestId("heatSourceLimitExceededErrorSummary")).toBeNull();
		});
	});

	describe("Heat network behaviour ", () => {
		test("when the heat source is a heat network, a heat pump or HIU can be added", async () => {
			const heatNetwork: DomesticHotWaterHeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
				coldWaterSource: "mainsWater",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				name: "Test Heat Network",
				productReference: "HEATNETWORK_SMALL",
			};

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [{ data: heatNetwork, complete: true }],
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("heatSources_add")).toBeDefined();
		});
		test("when the heat source is a heat pump or HIU, a heat network can be added", async () => {
			const heatPump: DomesticHotWaterHeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				coldWaterSource: "mainsWater",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				name: "Heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "hybridHeatPump",
				productReference: "1000",
				isConnectedToHeatNetwork: false,
				energySupply: "electricity",
				maxFlowTemp: unitValue(30, celsius),
			};

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							{ data: heatPump, complete: true },
						],
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("heatSources_add")).toBeDefined();
		});

		test("when the heat source is a HIU, a heat network can be added", async () => {
			const hiu: DomesticHotWaterHeatSourceData = {
				id: "48f2ce5d-f7fc-40dd-8be8-5d7f0bb0d111",
				coldWaterSource: "mainsWater",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				name: "HIU",
				typeOfHeatSource: "heatInterfaceUnit",
				productReference: "HIU_123",
				associatedHeatNetworkId: "network-1",
				maxFlowTemp: unitValue(32, celsius),
				buildingLevelLosses: unitValue(500, "watt"),
			};

			store.$patch({
				domesticHotWater: {
					heatSources: {
						data: [
							{ data: hiu, complete: true },
						],
					},
				},
			});
			await renderSuspended(DomesticHotWater);
			expect(screen.getByTestId("heatSources_add")).toBeDefined();
		});

		test("when the first heat source is a heat pump connected to a space heating heat network, another heat network cannot be added", async () => {
			const spaceHeatingHeatNetwork: HeatSourceData = {
				id: "3a2fda59-4db4-4f31-aad4-8ff2e9c0f221",
				name: "Space heating network",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				productReference: "HEATNETWORK_SMALL",
			};

			const connectedHeatPump: DomesticHotWaterHeatSourceData = {
				id: "f1457a50-f9d9-4f31-92f5-bd6f7ff9dabc",
				coldWaterSource: "mainsWater",
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE",
				name: "Connected heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "hybridHeatPump",
				productReference: "HP-123",
				isConnectedToHeatNetwork: true,
				associatedHeatNetworkId: spaceHeatingHeatNetwork.id,
				maxFlowTemp: unitValue(30, celsius),
			};

			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: spaceHeatingHeatNetwork, complete: true }],
					},
				},
				domesticHotWater: {
					heatSources: {
						data: [{ data: connectedHeatPump, complete: true }],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			expect(screen.queryByTestId("heatSources_add")).toBeNull();
		});
	});
});