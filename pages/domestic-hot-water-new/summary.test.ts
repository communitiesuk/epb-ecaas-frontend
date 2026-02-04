import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen } from "@testing-library/vue";
import { litre } from "~/utils/units/volume";
import { metre, millimetre } from "~/utils/units/length";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";
import { litrePerHour, litrePerMinute } from "~/utils/units/flowRate";
import { kilowatt } from "~/utils/units/power";
import { degrees } from "~/utils/units/angle";

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

	describe("hot water outlets", () => {
		const mixedShower: EcaasForm<MixedShowerDataNew> = {
			data: {
				id: "4a93532e-a370-4015-9778-854661bf1627",
				name: "Mixer shower 1",
				flowRate: 10,
				typeOfHotWaterOutlet: "mixedShower",
				hotWaterSource: "4eaf-48c1-4d3b-9f56-6d02b8f5c2bb",
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
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Mixer shower 1",
				"Flow rate": `10 ${litrePerHour.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the electric shower section", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data: [electricShower],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Electric shower 1",
				"Rated power": `10 ${kilowatt.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the bath section", async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data: [bathData],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Bath 1",
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
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data: [otherOutletsData],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Basin tap 1",
				"Flow rate": `10 ${litrePerMinute.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-otherOutlets-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe("pipework", () => {

		const pipework: EcaasForm<Partial<PipeworkData>> = {
			data: {
				name: "Pipework Kitchen Sink Primary",
				internalDiameter: 10,
				externalDiameter: 10,
				length: 3,
				insulationThickness: 5,
				thermalConductivity: 1,
				surfaceReflectivity: true,
				pipeContents: "water",
				location: "heatedSpace",
			},
		};

		it("should contain the correct tabs for pipework details", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Pipework" })).not.toBeNull();

		});

		it("should display the correct data for the pipework section", async () => {
			store.$patch({
				domesticHotWaterNew: {
					pipework: {
						data: [pipework],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Pipework Kitchen Sink Primary",
				"Location": "Heated space",
				"Pipe contents": "Water",
				"Internal diameter": `10 ${millimetre.suffix}`,
				"External diameter": `10 ${millimetre.suffix}`,
				"Length": `3 ${metre.suffix}`,
				"Insulation thickness": `5 ${millimetre.suffix}`,
				"Thermal conductivity": `1 ${wattsPerMeterKelvin.suffix}`,
				"Surface reflectivity": "Reflective",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pipework-${hyphenate(key)}`));

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
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
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