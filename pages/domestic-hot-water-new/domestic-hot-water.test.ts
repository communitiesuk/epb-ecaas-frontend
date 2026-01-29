import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import DomesticHotWater from "@/pages/domestic-hot-water-new/index.vue";
import { screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import formStatus from "~/constants/formStatus";
import type { DomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";

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
			locationOfBoiler: "heatedSpace",
			heatSourceId: "NEW_HEAT_SOURCE",
		},
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	const hwStorage1: EcaasForm<WaterStorageData> = {
		data: {
			name: "Jasper's Cylinder 1",
			id: "what",
			heatSource: "weeeeee",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres",
			},
			dailyEnergyLoss: 69,
			typeOfWaterStorage: "hotWaterCylinder",
			initialTemperature: 60,
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
		},
	};

	const hwOutlet1: EcaasForm<HotWaterOutletsData> = {
		data: {
			name: "Jasper's Steamy Bath",
			typeOfHotWaterOutlet: "bath",
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

	describe("Water storage", () => {
		const hwStorage2: EcaasForm<SmartHotWaterTankDataNew> = {
			data: {
				name: "Jasper's Cylinder 2",
				id: "what2",
				typeOfWaterStorage: "smartHotWaterTank",
				heatSource: "weeeeee3",
				heaterPosition: 0.8,
				productReference: "SMART-12345",
			},
		};

		const hwStorage3: EcaasForm<HotWaterCylinderDataNew> = {
			data: {
				name: "Jasper's Cylinder 3",
				id: "what3",
				heatSource: "weeeeee3",
				storageCylinderVolume: {
					amount: 102,
					unit: "litres",
				},
				dailyEnergyLoss: 71,
				typeOfWaterStorage: "hotWaterCylinder",
				initialTemperature: 60,
				areaOfHeatExchanger: 2.5,
				heaterPosition: 0.8,
				thermostatPosition: 0.5,
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
	});

	describe("Hot water outlets", () => {
		const hwOutlet2: EcaasForm<HotWaterOutletsData> = {
			data: {
				name: "Jasper's Powerful Shower",
				typeOfHotWaterOutlet: "mixedShower",
				id: "outlet2",
				flowRate: 100,
				hotWaterSource: "4eaf-48c1-4d3b-9f56-6d02b8f5c2bb",
				wwhrs: false,
			},
		};

		const hwOutlet3: EcaasForm<HotWaterOutletsData> = {
			data: {
				name: "Jasper's Ambiguous Water Outlet",
				typeOfHotWaterOutlet: "otherHotWaterOutlet",
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
				domesticHotWaterNew: {
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
		//TODO test heat sources referring to space heating heat sources
		const heatSource2 = {
			data: {
				name: "Jasper's Old Laptop",
				id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bc",
				coldWaterSource: "headerTank",
				isExistingHeatSource: false,
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
				productReference: "HEAT-12345",
				heatSourceId: "NEW_HEAT_SOURCE",
				isHeatNetworkInPcdb: true,
				energySupply: "LPG_condition_11F",
				usesHeatInterfaceUnits: true,
				heatInterfaceUnitProductReference: "HIU-12345",
			},
		} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

		const heatSource3SpaceHeating = {
			data: {
				name: "Jasper's Heat Pump",
				id: "123e4567-e89b-12d3-a456-426614174000",
				typeOfHeatSource: "heatPump",
				productReference: "HEATPUMP-12345",
				typeOfHeatPump: "airSource",
			},
		} as const satisfies EcaasForm<HeatSourceData>;

		const heatSource3HotWater = {
			data: {
				id: "0fea7c2b-48c1-4d3b-9f56-6d02b8f5c2bd",
				coldWaterSource: "mainsWater",
				isExistingHeatSource: true,
				heatSourceId: "123e4567-e89b-12d3-a456-426614174000",
			},
		} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

		// // Can't get href to point to the right thing :(

		// // test("Navigates to water storage create form when add link is clicked", async () => {
		// // 	await renderSuspended(DomesticHotWater);
			
		// // 	const addLink = await screen.findByTestId<HTMLAnchorElement>("heatSources_add");
			
		// // 	expect(new URL(addLink.href).pathname).toBe(
		// // 		getUrl("heatSourcesCreate"),
		// // 	);
		// // });

		test("Displays existing heat sources", async () => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [heatSource1],
					},
				},
			});

			await renderSuspended(DomesticHotWater);

			expect(screen.getByText(heatSource1.data.name)).toBeDefined();
		});

		test("heat sources are removed when remove link is clicked", async () => {
			store.$patch({
				domesticHotWaterNew: {
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

		it("should only remove the heat source object that is clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [heatSource3SpaceHeating],
					},
				},
				domesticHotWaterNew: {
					heatSources: {
						data: [heatSource1, heatSource2, heatSource3HotWater],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await user.click(screen.getByTestId("heatSources_remove_1"));

			const populatedList = screen.getByTestId("heatSources_items");

			expect(within(populatedList).getByText(heatSource1.data.name)).toBeDefined();
			expect(within(populatedList).getByText(heatSource3SpaceHeating.data.name)).toBeDefined();
			expect(within(populatedList).queryByText(heatSource2.data.name)).toBeNull();
		});

		test("heat sources are duplicated when duplicate link is clicked", async () => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [
							heatSource1,
							heatSource2,
						],
					},
				},
			});

			await renderSuspended(DomesticHotWater);
			await userEvent.click(screen.getByTestId("heatSources_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatSources_duplicate_0"));
			await userEvent.click(screen.getByTestId("heatSources_duplicate_2"));
			await userEvent.click(screen.getByTestId("heatSources_duplicate_2"));
			expect(screen.queryAllByTestId("heatSources_item").length).toBe(6);
			expect(screen.getByText(heatSource1.data.name)).toBeDefined();
			expect(screen.getByText(`${heatSource1.data.name} (1)`)).toBeDefined();
			expect(screen.getByText(`${heatSource1.data.name} (2)`)).toBeDefined();
			expect(screen.getByText(`${heatSource1.data.name} (1) (1)`)).toBeDefined();
			expect(screen.getByText(`${heatSource1.data.name} (1) (2)`)).toBeDefined();
		});
	});

	it("disables the mark section as complete button when item is incomplete", async () => {
		store.$patch({
			domesticHotWaterNew: {
				waterStorage: {
					data: [
						{ 
							data: 
							{ name: "Test Water Storage", typeOfWaterStorage: "hotWaterCylinder" },
							complete: false,
						},
					],
				},
			},
		});
	
		await renderSuspended(DomesticHotWater);
		const markAsCompleteButton = screen.getByRole("button", {
			name: "Mark section as complete",
		});
		expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
	});
	
	test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
		store.$patch({
			domesticHotWaterNew: {
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
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: { data: [{ ...hwStorage1, complete: true }] },
					hotWaterOutlets: { data: [{ ...hwOutlet1, complete: true }] },
					pipework: { data: [{ ...pipework1, complete: true }] },
					heatSources: { data: [{ ...heatSource1, complete: true }] },
				},
			});
		};
	
		beforeEach(async () => {
			await renderSuspended(DomesticHotWater);
		});
	
		// const hotWaterForms = {
		// 	waterStorage: WaterStorageForm,
		// 	hotWaterOutlets: HotWaterOutletsForm,
		// };
	
		// type SectionKey = keyof typeof store.domesticHotWaterNew;
	
		it("disables the Mark section as complete button when a section is incomplete", async () => {
			store.$patch({
				domesticHotWaterNew: {
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
				const { waterStorage, hotWaterOutlets } = store.domesticHotWaterNew;
				expect(waterStorage?.complete).toBe(true);
				expect(hotWaterOutlets?.complete).toBe(true);
			});
	
			it("marks section as not complete if an item is removed", async () => {
				await user.click(screen.getByTestId("waterStorage_remove_0"));
				await user.click(screen.getByTestId("hotWaterOutlets_remove_0"));
	
				const { waterStorage, hotWaterOutlets } = store.domesticHotWaterNew;
				expect(waterStorage?.complete).toBe(false);
				expect(hotWaterOutlets?.complete).toBe(false);
			});
	
			it("marks section as not complete if an item is duplicated", async () => {
				await user.click(screen.getByTestId("waterStorage_duplicate_0"));
				await user.click(screen.getByTestId("hotWaterOutlets_duplicate_0"));
	
				const { waterStorage, hotWaterOutlets } = store.domesticHotWaterNew;
				expect(waterStorage?.complete).toBe(false);
				expect(hotWaterOutlets?.complete).toBe(false);
			});
	
			it.skip("marks section as not complete after adding a new item", async () => {
				// for (const section of Object.keys(store.domesticHotWaterNew) as SectionKey[]) {
	
				// 	if (section === "waterStorage") {
				// 		await renderSuspended(pvAndBatteryForms[section], {
				// 			route: {
				// 				path: "/pv-and-batteries/pv-systems/create",
				// 			},
				// 		});
				// 	} else {
				// 		await renderSuspended(pvAndBatteryForms[section]);
				// 	}
	
				// 	await user.type(screen.getByTestId("name"), "New item");
				// 	await user.tab();
				// 	await user.click(screen.getByTestId("saveAndComplete"));
	
				// 	expect(store.domesticHotWaterNew[section]?.complete).toBe(false);
				// }
			});
	
			it.skip("marks section as not complete after editing an existing item", async () => {
			// 		for (const section of Object.keys(store.domesticHotWaterNew) as SectionKey[]) {
	
				// 			if (section === "waterStorage") {
				// 				await renderSuspended(pvAndBatteryForms[section], {
				// 					route: { params: { "system": "0" } },
				// 				});
				// 			} else {
				// 				await renderSuspended(pvAndBatteryForms[section]);
				// 			}
	
				// 			await user.clear(screen.getByTestId("name"));
				// 			await user.type(screen.getByTestId("name"), "Updated item");
				// 			await user.tab();
	
			// 			expect(store.domesticHotWaterNew[section]?.complete).toBe(false);
			// 		}
			});
		});
	});
});