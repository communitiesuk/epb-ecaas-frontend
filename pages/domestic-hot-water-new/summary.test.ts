import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { litre } from "~/utils/units/volume";
import { litrePerSecond } from "~/utils/units/flowRate";
import { displayCamelToSentenceCase } from "~/utils/display";
import { kilowatt, kilowattHour } from "~/utils/units/power";
import { metresSquare } from "~/utils/units/area";
import { degrees } from "~/utils/units/angle";
import type { DomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

type ExpectedData = { [key: string]: string };
const verifyDataInSection = async (
	section: string,
	expectedSectionData: ExpectedData,
) => {
	for (const [key, value] of Object.entries(expectedSectionData)) {
		const lineResult = screen.queryByTestId(
			`summary-${section}-${hyphenate(key)}`,
		);
		expect(lineResult!.querySelector("dt")?.textContent).toBe(key);
		expect(lineResult!.querySelector("dd")?.textContent).toBe(value);
	}
};

describe("Domestic hot water summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("displays the correct title", async () => {
		await renderSuspended(Summary);
		expect(screen.getByRole("heading", { name: "Domestic hot water summary" }));
	});

	describe("water storage", () => {
		const heatPumpId = "463c94f6-566c-49b2-af27-57e5c68b5c30";

		const hotWaterCylinder: HotWaterCylinderDataNew = {
			id: "c84528bb-f805-4f1e-95d3-2bd17384fdbe",
			typeOfWaterStorage: "hotWaterCylinder",
			name: "Hot water cylinder",
			storageCylinderVolume: 5,
			initialTemperature: 60,
			dailyEnergyLoss: 1,
			dhwHeatSourceId: heatPumpId,
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
		};

		const smartHotWaterCylinder: SmartHotWaterTankDataNew = {
			id: "c84528bb-f805-4f1e-95d3-2bd17384abcd",
			typeOfWaterStorage: "smartHotWaterTank",
			name: "Smart hot water cylinder",
			productReference: "SMART-HOT-WATER-CYLINDER",
			dhwHeatSourceId: heatPumpId,
			heaterPosition: 0.3,
		};

		const addHotWaterCylinderData = () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: hotWaterCylinder }],
					},
					heatSources: {
						data: [{
							data: {
								isExistingHeatSource: false,
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
							},
						}],
					},
				},
			});
		};

		const addSmartHotWaterCylinderData = () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: smartHotWaterCylinder }],
					},
					heatSources: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
								isExistingHeatSource: false,
							},
						}],
					},
				},
			});
		};

		it("displays an empty tab state with link to create when no data exists", async () => {
			await renderSuspended(Summary);

			expect(screen.getByText("No water storage added")).not.toBeNull();

			const addWaterStorageLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add water storage",
			});

			expect(new URL(addWaterStorageLink.href).pathname).toBe(
				getUrl("waterStorage"),
			);
		});

		it("should contain the correct tabs when data exists", async () => {
			store.$patch({
				domesticHotWaterNew: {
					waterStorage: {
						data: [{ data: hotWaterCylinder }, { data: smartHotWaterCylinder }],
					},
				},
				spaceHeating: {
					heatSource: {
						data: [{
							data: {
								id: heatPumpId,
								name: "Heat pump",
								typeOfHeatSource: "heatPump",
							},
						}],
					},
				},
			});
			await renderSuspended(Summary);

			expect(screen.queryByRole("link", { name: "Hot water cylinders" })).not.toBeNull();
			expect(screen.queryByRole("link", { name: "Smart hot water cylinders" })).not.toBeNull();
		});

		it("should display the correct data for the hot water cylinder section when data exists", async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Hot water cylinder",
				"Storage cylinder volume": `5 ${litre.suffix}`,
				"Initial temperature": `60 ${degrees.suffix}C`,
				"Daily energy loss": `1 ${kilowattHour.suffix}`,
				"Heat source": "Heat pump",
				"Area of heat exchanger installed": `2.5 ${metresSquare.suffix}`,
				"Heater position in the cylinder": "0.8",
				"Thermostat position in the cylinder": "0.5",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-hotWaterCylinder-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display an edit link within hot water cylinder when data exists", async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);
			const hotWaterCylinderSection = screen.getByTestId("hotWaterCylinder");
			const editLink: HTMLAnchorElement = within(hotWaterCylinderSection).getByText("Edit");

			expect(editLink).not.toBeNull();
			expect(new URL(editLink.href).pathname).toBe("/domestic-hot-water-new");
		});

		it("should display the correct data for the smart hot water cylinder section when data exists", async () => {
			addSmartHotWaterCylinderData();
			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Smart hot water cylinder",
				"Product reference": "SMART-HOT-WATER-CYLINDER",
				"Heat source": "Heat pump",
				"Heater position in the cylinder": "0.3",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-smartHotWaterCylinder-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display an edit link within smart hot water cylinder when data exists", async () => {
			addSmartHotWaterCylinderData();
			await renderSuspended(Summary);
			const smartHotWaterCylinderSection = screen.getByTestId("smartHotWaterCylinder");
			const editLink: HTMLAnchorElement = within(smartHotWaterCylinderSection).getByText("Edit");

			expect(editLink).not.toBeNull();
			expect(new URL(editLink.href).pathname).toBe("/domestic-hot-water-new");
		});
	});

	describe("hot water outlets", () => {
		const mixedShower: EcaasForm<MixedShowerDataNew> = {
			data: {
				id: "4a93532e-a370-4015-9778-854661bf1627",
				name: "Mixer shower 1",
				flowRate: 10,
				typeOfHotWaterOutlet: "mixedShower",
				heatSource: "4eaf-48c1-4d3b-9f56-6d02b8f5c2bb",
				wwhrs: false,
			},
		};

		const electricShower: EcaasForm<ElectricShowerDataNew> = {
			data: {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
				name: "Electric shower 1",
				ratedPower: 10,
				typeOfHotWaterOutlet: "electricShower",
				wwhrs: false,
			},
		};

		const bathData: EcaasForm<BathDataNew> = {
			data: {
				id: "d3883380-885b-48fd-9425-9f9fac7587fb",
				name: "Bath 1",
				size: 170,
				typeOfHotWaterOutlet: "bath",
			},
		};

		const otherOutletsData: EcaasForm<OtherHotWaterOutletDataNew> = {
			data: {
				id: "0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e",
				name: "Basin tap 1",
				flowRate: 10,
				typeOfHotWaterOutlet: "otherHotWaterOutlet",
			},
		};

		it("should contain the correct tabs for hot water outlets", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Mixer showers" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Electric showers" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Baths" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Other" })).not.toBeNull();
		});

		it("should display the correct data for the mixer shower section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [mixedShower],
					},
					heatSources: {
						data: [{ data: { id: mixedShower.data.heatSource, name: "Heat pump" } }],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Mixer shower 1",
				"Type of hot water outlet": "Mixed shower",
				"Hot water source": "Heat pump",
				"Flow rate": `10 ${litrePerSecond.suffix}`,
				"WWHRS installed": "No",
				"WWHRS type": "-",
				"WWHRS product": "-",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays '-' for missing values in a partial mixer shower", async () => {
			const partialMixed = {
				data: {
					id: "partial-id-0001",
					name: "Partial mixer",
					typeOfHotWaterOutlet: "mixedShower",
					// intentionally leave out flowRate, hotWaterSource, wwhrs
				} as Partial<MixedShowerDataNew>,
			};

			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [partialMixed],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Partial mixer",
				"Type of hot water outlet": "Mixed shower",
				"Hot water source": "-",
				"Flow rate": "-",
				"WWHRS installed": "-",
				"WWHRS type": "-",
				"WWHRS product": "-",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the electric shower section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [electricShower],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Electric shower 1",
				"Type of hot water outlet": "Electric shower",
				"Rated power": `10 ${kilowatt.suffix}`,
				"WWHRS installed": "No",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the bath section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [bathData],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Bath 1",
				"Type of hot water outlet": "Bath",
				"Size": `170 ${litre.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-bath-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the other outlets section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: {
						data: [otherOutletsData],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Basin tap 1",
				"Type of hot water outlet": "Other hot water outlet",
				"Flow rate": `10 ${litrePerSecond.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-otherOutlets-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		test("displays WWHRS type and product when present for mixer showers", async () => {
			const mixerWithWwhrs: EcaasForm<MixedShowerDataNew> = {
				data: {
					id: "mixer-wwhrs-1",
					name: "Mixer with WWHRS",
					flowRate: 15,
					typeOfHotWaterOutlet: "mixedShower",
					heatSource: "heat-1",
					wwhrs: true,
					wwhrsType: "instantaneousSystemA",
					wwhrsProductReference: "WWHRS-PR-1",
				},
			};

			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: { data: [mixerWithWwhrs] },
					heatSources: { data: [{ data: { id: "heat-1", name: "Heat pump" } }] },
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Mixer with WWHRS",
				"Type of hot water outlet": "Mixed shower",
				"Hot water source": "Heat pump",
				"Flow rate": `15 ${litrePerSecond.suffix}`,
				"WWHRS installed": "Yes",
				"WWHRS type": displayCamelToSentenceCase("instantaneousSystemA"),
				"WWHRS product": "WWHRS-PR-1",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		test("displays WWHRS type and product when present for electric showers", async () => {
			const electricWithWwhrs: EcaasForm<ElectricShowerDataNew> = {
				data: {
					id: "electric-wwhrs-1",
					name: "Electric with WWHRS",
					ratedPower: 8,
					typeOfHotWaterOutlet: "electricShower",
					wwhrs: true,
					wwhrsType: "instantaneousSystemA",
					wwhrsProductReference: "WWHRS-PR-2",
				},
			};

			store.$patch({
				domesticHotWaterNew: { hotWaterOutlets: { data: [electricWithWwhrs] } },
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Electric with WWHRS",
				"Type of hot water outlet": "Electric shower",
				"Rated power": `8 ${kilowatt.suffix}`,
				"WWHRS installed": "Yes",
				"WWHRS type": displayCamelToSentenceCase("instantaneousSystemA"),
				"WWHRS product": "WWHRS-PR-2",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
	
	describe("heat sources", () => {
		// const existingHeatPumpSpaceHeating1: HeatSourceData = {
		// 	id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
		// 	name: "Heat pump 1",
		// 	typeOfHeatSource: "heatPump",
		// 	typeOfHeatPump: "airSource",
		// 	productReference: "HEATPUMP-LARGE",
		// };
		// const existingHeatPumpSpaceHeating2: HeatSourceData = {
		// 	id: "463c94f6-566c-49b2-af27-57e5c68b5c31",
		// 	name: "Heat pump 2",
		// 	typeOfHeatSource: "heatPump",
		// 	typeOfHeatPump: "airSource",
		// 	productReference: "HEATPUMP-LARGE",
		// };

		// const dhwWithExistingHeatPump: DomesticHotWaterHeatSourceData = {
		// 	id: "463c94f6-566c-49b2-af27-57e5c68b5c62",
		// 	coldWaterSource: "headerTank",
		// 	isExistingHeatSource: true,
		// 	heatSourceId: existingHeatPumpSpaceHeating1.id,
		// };

		const dhwWithNewHeatPump: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEAT_PUMP_SMALL",
		};
		
		const dhwWithNewBoiler: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdk333333",
			name: "Boiler 1",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
			productReference: "BOILER_SMALL",
			locationOfBoiler: "heatedSpace",
		};

		const dhwWithNewHeatBattery: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
			name: "Heat battery 1",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			productReference: "HEAT_BATTERY_SMALL",
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const dhwWithNewHeatNetwork: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
			name: "Heat network 1",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "communalHeatNetwork",
			isHeatNetworkInPcdb: true,
			productReference: "HEAT_NETWORK-LARGE",
			energySupply: "electricity",
			usesHeatInterfaceUnits: false,
		};

		const dhwWithNewSolarThermalSystem: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c77777",
			name: "Solar thermal system",
			typeOfHeatSource: "solarThermalSystem",
			locationOfCollectorLoopPiping: "outside",
			collectorModuleArea: 1,
			numberOfCollectorModules: 2,
			peakCollectorEfficiency: 0,
			incidenceAngleModifier: 1,
			firstOrderHeatLossCoefficient: 1,
			secondOrderHeatLossCoefficient: 10,
			heatLossCoefficientOfSolarLoopPipe: 100,
			collectorMassFlowRate: 2,
			powerOfCollectorPump: 30,
			powerOfCollectorPumpController: 30,
			pitch: 60,
			orientation: 60,
		};

		const dhwImmersionHeater: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c888888",
			name: "Immersion heater",
			typeOfHeatSource: "immersionHeater",
			power: 4,
		};

		const dhwPointOfUse: DomesticHotWaterHeatSourceData = {
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c9999999",
			name: "Point of use",
			typeOfHeatSource: "pointOfUse",
			energySupply: "electricity",
			heaterEfficiency: 1,
		};

		beforeEach(() => {
			store.$patch({
				domesticHotWaterNew: {
					heatSources: {
						data: [
							{ data: dhwWithNewHeatPump },
							{ data: dhwWithNewBoiler },
							{ data: dhwWithNewHeatBattery },
							{ data: dhwWithNewHeatNetwork },
							{ data: dhwWithNewSolarThermalSystem },
							{ data: dhwImmersionHeater },
							{ data: dhwPointOfUse },
						],
					},
				},
			});
		});


		it("displays an empty tab state with link to create when no data is present", async () => {
			store.$reset();
			await renderSuspended(Summary);
		
			expect(screen.getByText("No heat sources added")).not.toBeNull();
		
			const addHeatSourceLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat source",
			});
		
			expect(new URL(addHeatSourceLink.href).pathname).toBe(
				getUrl("heatSourcesCreate"),
			);
		});
		
		it("should contain the correct tabs for heat sources", async () => {
			
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Heat pumps" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Boilers" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Heat networks" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Heat batteries" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Solar thermal systems" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Immersion heaters" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Point of use" })).not.toBeNull();
		});

		const expectedHeatPump = {
			"Cold water source": "Mains water",
			Name: "Heat pump 1",
			"Type of heat source": "Heat pump",
			"Type of heat pump": "Air source",
			"Product reference": "HEAT_PUMP_SMALL",
		};

		const expectedBoiler = {
			"Cold water source": "Mains water",
			Name: "Boiler 1",
			"Type of heat source": "Boiler",
			"Type of boiler": "Combi boiler",
			"Product reference": "BOILER_SMALL",
			"Location of boiler": "Heated space",
		};
		const expectedHeatBattery = {
			"Cold water source": "Mains water",
			Name: "Heat battery 1",
			"Type of heat source": "Heat battery",
			"Type of heat battery": "Heat battery pcm",
			"Product reference": "HEAT_BATTERY_SMALL",
			"Number of units": "1",
			"Energy supply": "Electricity",
		};
		const expectedHeatNetwork = {
			"Cold water source": "Mains water",
			Name: "Heat network 1",
			"Type of heat source": "Heat network",
			"Type of heat network": "Communal heat network",
			"Is the heat network in the PCDB": "Yes",
			"Heat network product reference": "HEAT_NETWORK-LARGE",
			"Energy supply": "Electricity",
			"Will the heat network use heat interface units": "No",
		};
		const expectedSolarThermalSystem = {
			"Cold water source": "Mains water",
			Name: "Solar thermal system",
			"Type of heat source": "Solar thermal system",
			"Location of collector loop piping": "Outside",
			"Collector module area": "1",
			"Number of collector modules": "2",
			"Peak collector efficiency": "0",
			"Incidence angle modifier": "1",
			"First order heat loss coefficient": "1",
			"Second order heat loss coefficient": "10",
			"Heat loss coefficient of solar loop piping": "100",
			"Collector mass flow rate": "2",
			"Power of collector pump": "30",
			"Power of collector pump controller": "30",
			"Pitch": `60 ${degrees.suffix}`,
			"Orientation": `60 ${degrees.suffix}`,
		};
		const expectedImmersionHeater = {
			"Cold water source": "Mains water",
			Name: "Immersion heater",
			"Type of heat source": "Immersion heater",
			"Power": `4 ${kilowatt.suffix}`,
		};	
		const expectedPointOfUse = {
			"Cold water source": "Mains water",
			Name: "Point of use",
			"Type of heat source": "Point of use",
			"Energy supply": "Electricity",
			"Heater efficiency": "1",
		};

		it.each(
			[
				["heatPumpSummary", expectedHeatPump],
				["boilerSummary", expectedBoiler],
				["heatBatterySummary", expectedHeatBattery],
				["heatNetworkSummary", expectedHeatNetwork],
				["solarThermalSystemSummary", expectedSolarThermalSystem],
				["immersionHeaterSummary", expectedImmersionHeater],
				["pointOfUseSummary", expectedPointOfUse],
 
			],
		)("for the %s it displays the correct stored data", async (sectionId, expectedData) => {
			
			await renderSuspended(Summary);
			await verifyDataInSection(sectionId, expectedData);
		});
		it("displays an edit link that navigates to the domestic hot water form page when clicked", async () => {

			await renderSuspended(Summary);
		
			const heatSourcesSection = screen.getByRole("link", { name: "Edit" });
	
			expect(heatSourcesSection.getAttribute("href")).toBe("/domestic-hot-water-new");
		});
	});
});
