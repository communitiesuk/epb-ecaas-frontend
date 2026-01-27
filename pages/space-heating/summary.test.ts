import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, within } from "@testing-library/vue";
import SpaceHeatingSummary from "./summary.vue";
import { degrees } from "~/utils/units/angle";

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
const store = useEcaasStore();
beforeEach(() => {
	store.$reset();
});

describe("Space heating summary page", () => {
	it("displays the correct title", async () => {
		await renderSuspended(SpaceHeatingSummary);
		expect(screen.getByRole("heading", { name: "Space heating summary" }));
	});

	describe("Heat sources section", () => {
		it("displays an empty tab state with link to create when no data is present", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByText("No heat sources added")).not.toBeNull();

			const addHeatSourceLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat source",
			});

			expect(new URL(addHeatSourceLink.href).pathname).toBe(
				getUrl("heatSourceCreate"),
			);
		});

		it("displays the correct data for the boiler summary", async () => {

			const boiler1: HeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
				name: "Boiler 1",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				productReference: "BOILER_SMALL",
				locationOfBoiler: "heatedSpace",
			};

			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: boiler1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Boiler 1",
				"Type of heat source": "Boiler",
				"Type of boiler": "Combi boiler",
				"Product reference": "BOILER_SMALL",
				"Location of boiler": "Heated space",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-boilerSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat pump summary", async () => {

			const heatPump1: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump 1",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
				productReference: "HEAT_PUMP_SMALL",
			};
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat pump 1",
				"Type of heat source": "Heat pump",
				"Type of heat pump": "Air source",
				"Product reference": "HEAT_PUMP_SMALL",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatPumpSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat battery summary", async () => {

			const heatBattery1: HeatSourceData = {
				id: "1b73e247-57c5-26b8-1tbd-83tdkc8c1111",
				name: "Heat battery 1",
				typeOfHeatSource: "heatBattery",
				typeOfHeatBattery: "heatBatteryPcm",
				productReference: "HEAT_BATTERY_SMALL",
				numberOfUnits: 1,
				energySupply: "electricity",
			};
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatBattery1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat battery 1",
				"Type of heat source": "Heat battery",
				"Type of heat battery": "Heat battery pcm",
				"Product reference": "HEAT_BATTERY_SMALL",
				"Number of units": "1",
				"Energy supply": "Electricity",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatBatterySummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat network summary", async () => {

			const heatNetwork1: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
				name: "Heat network 1",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				isHeatNetworkInPcdb: true,
				productReference: "HEAT_NETWORK-LARGE",
				energySupply: "electricity",
				usesHeatInterfaceUnits: false,
			};
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatNetwork1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat network 1",
				"Type of heat source": "Heat network",
				"Type of heat network": "Communal heat network",
				"Is the heat network in the PCDB": "Yes",
				"Heat network product reference": "HEAT_NETWORK-LARGE",
				"Energy supply": "Electricity",
				"Will the heat network use heat interface units": "No",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatNetworkSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the solar thermal system summary", async () => {

			const solarThermalSystem1: HeatSourceData = {
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
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: solarThermalSystem1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
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

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-solarThermalSystemSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
	describe("Heating control section", () => {
		const heatingControl: HeatingControlData = {
			name: "Separate temperature control",
			heatingControlType: "separateTemperatureControl",
		};

		it("displays heating control tab", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByRole("link", { name: "Heating controls" })).not.toBeNull();
		});

		it("displays the correct data when data has been added", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "Separate temperature control",
			};

			await verifyDataInSection("heatingControls", expectedSectionData);
		});

		it("displays an edit link that navigates to the heating control form page when clicked", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
				},
			});
			await renderSuspended(SpaceHeatingSummary);

			const heatingControlSection = screen.getByTestId("heatingControls");
			const editLink: HTMLAnchorElement = within(heatingControlSection).getByText("Edit");

			expect(new URL(editLink.href).pathname).toBe("/space-heating/heating-controls");
		});
	});
	describe("Heat emitters section", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		const radiator: HeatEmittingData = {
			id: "1234",
			name: "Radiator 1",
			typeOfHeatEmitter: "radiator",
			typeOfRadiator: "standard",
			productReference: "RAD-SMALL",
			heatSource: "heat-pump-id",
			ecoDesignControllerClass: "1",
			designFlowTemp: 55,
			minFlowTemp: 45,
			designTempDiffAcrossEmitters: 10,
			numOfRadiators: 5,
			hasVariableFlowRate: false,
			designFlowRate: 100,
			length: 1,
		};
		const fanCoil: HeatEmittingData = {
			id: "5678",
			name: "Fan Coil 1",
			typeOfHeatEmitter: "fanCoil",
			productReference: "FC-SMALL",
			heatSource: "boiler-id",
			designFlowTemp: 50,
			minFlowTemp: 40,
			designTempDiffAcrossEmitters: 10,
			hasVariableFlowRate: true, ecoDesignControllerClass: "2",
			maxFlowRate: 200,
			minFlowRate: 50,
			numOfFanCoils: 3,
		};
		const ufh: HeatEmittingData = {
			id: "91011",
			name: "Underfloor Heating 1",
			typeOfHeatEmitter: "underfloorHeating",
			productReference: "UFH-SMALL",
			heatSource: "heat-pump-id",
			designFlowTemp: 35,
			minFlowTemp: 25,
			designTempDiffAcrossEmitters: 10,
			hasVariableFlowRate: true,
			maxFlowRate: 150,
			minFlowRate: 30,
			areaOfUnderfloorHeating: 100,
			ecoDesignControllerClass: "3",
		};
		const warmAirHeater: HeatEmittingData = {
			id: "121314",
			name: "Warm Air Heater 1",
			typeOfHeatEmitter: "warmAirHeater",
			heatSource: "boiler-id",
			convectionFraction: 0.8,
			designTempDiffAcrossEmitters: 15,
			numOfWarmAirHeaters: 4,
		};
		const instantElectricHeater: HeatEmittingData = {
			id: "151617",
			name: "Instant Electric Heater 1",
			typeOfHeatEmitter: "instantElectricHeater",
			convectionFractionForHeating: 0.9,
			numOfHeaters: 6,
			ratedPower: 2.5,
		};
		const electricStorageHeater: HeatEmittingData = {
			id: "181920",
			name: "Electric Storage Heater 1",
			typeOfHeatEmitter: "electricStorageHeater",
			numOfStorageHeaters: 8,
			productReference: "ESH-SMALL",
		};
		it("displays an empty tab state when no data is present", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByText("No heat emitters added")).not.toBeNull();

			const addHeatEmitterLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat emitter",
			});

			expect(new URL(addHeatEmitterLink.href).pathname).toBe(
				getUrl("heatEmittersCreate"),
			);
		});


		it.each([
			["radiatorSummary", radiator],
			["underfloorHeatingSummary", ufh],
			["fanCoilSummary", fanCoil],
			["warmAirHeaterSummary", warmAirHeater],
			["instantElectricHeaterSummary", instantElectricHeater],
			["electricStorageHeaterSummary", electricStorageHeater],
		])("displays %s tab when a radiator has been added", async (testId, heatEmitter) => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: heatEmitter }],
					},
				},
			});
			await renderSuspended(SpaceHeatingSummary);
			expect(screen.getByTestId(testId)).not.toBeNull();
		});
		const expectedRadiatorData = {
			Name: "Radiator 1",
			"Type of heat emitter": "Radiator",
			"Type of radiator": "Standard",
			"Product reference": "RAD-SMALL",
			"Design flow temperature": "55 °C",
			"Minimum flow temperature": "45 °C",
			"Design temperature difference across emitters": "10 °C",
			"Number of radiators": "5",
			"Is there a variable flow rate?": "No",
			"Design flow rate": "100 litres per second",
			"Eco design controller class": "1",
		};

		const expectedFanCoilData = {
			Name: "Fan Coil 1",
			"Type of heat emitter": "Fan coil",
			"Product reference": "FC-SMALL",
			"Design flow temperature": "50 °C",
			"Minimum flow temperature": "40 °C",
			"Design temperature difference across emitters": "10 °C",
			"Is there a variable flow rate?": "Yes",
			"Maximum flow rate": "200 litres per second",
			"Minimum flow rate": "50 litres per second",
			"Number of fan coils": "3",
			"Eco design controller class": "2",
		};

		const expectedUfhData = {
			Name: "Underfloor Heating 1",
			"Type of heat emitter": "Underfloor heating",
			"Product reference": "UFH-SMALL",
			"Design flow temperature": "35 °C",
			"Minimum flow temperature": "25 °C",
			"Design temperature difference across emitters": "10 °C",
			"Is there a variable flow rate?": "Yes",
			"Maximum flow rate": "150 litres per second",
			"Minimum flow rate": "30 litres per second",
			"Area of underfloor heating": "100 m²",
			"Eco design controller class": "3",
		};

		const expectedWarmAirHeaterData = {
			Name: "Warm Air Heater 1",
			"Type of heat emitter": "Warm air heater",
			"Design temperature difference across emitters": "15 °C",
			"Convection fraction": "0.8",
			"Number of warm air heaters": "4",
		};

		const expectedInstantElectricHeaterData = {
			Name: "Instant Electric Heater 1",
			"Rated power": "2.5 kW",
			"Convection fraction for heating": "0.9",
			"Number of heaters": "6",
		};

		const expectedElectricStorageHeaterData = {
			Name: "Electric Storage Heater 1",
			"Product reference": "ESH-SMALL",
			"Number of storage heaters": "8",
		};
		it.each(
			[
				["radiatorSummary", expectedRadiatorData],
				["fanCoilSummary", expectedFanCoilData],
				["underfloorHeatingSummary", expectedUfhData],
				["warmAirHeaterSummary", expectedWarmAirHeaterData],
				["instantElectricHeaterSummary", expectedInstantElectricHeaterData],
				["electricStorageHeaterSummary", expectedElectricStorageHeaterData],
			],
		)("displays the correct data for all heat emitter types when data has been added", async (
			sectionId, expectedData,
		) => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [
							{ data: radiator },
							{ data: fanCoil },
							{ data: ufh },
							{ data: warmAirHeater },
							{ data: instantElectricHeater },
							{ data: electricStorageHeater },
						],
					},
				},
			});
			await renderSuspended(SpaceHeatingSummary);
			await verifyDataInSection(sectionId, expectedData);

		});
		it("displays an empty tab state with link to create when no data is present", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByText("No heat emitters added")).not.toBeNull();

			const addHeatEmitterLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat emitter",
			});

			expect(new URL(addHeatEmitterLink.href).pathname).toBe(
				getUrl("heatEmittersCreate"),
			);
		});
	});
});