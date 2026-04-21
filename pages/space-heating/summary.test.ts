import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, within } from "@testing-library/vue";
import SpaceHeatingSummary from "./summary.vue";
import { celsius } from "~/utils/units/temperature";


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
const { mockFetch } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);

const store = useEcaasStore();
beforeEach(() => {
	store.$reset();
	mockFetch.mockReset();
	mockFetch.mockReturnValue({ data: ref({ modelName: "Mock product" }) });
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
				needsSpecifiedLocation: true,
				specifiedLocation: "internal",
				maxFlowTemp: unitValue(2, celsius),

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
				"Maximum flow temperature": `2 ${celsius.suffix}`,

			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-boilerSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat pump summary (not connected to heat network)", async () => {
			mockFetch.mockReturnValueOnce({ data: ref({ modelName: "Mock product" }) });
			const heatPump1: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
				name: "Heat pump 1",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
				productReference: "HEAT_PUMP_SMALL",
				maxFlowTemp: unitValue(17, celsius),
				isConnectedToHeatNetwork: false,
				energySupply: "electricity",
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
				"Product name": "Mock product",
				"Maximum flow temperature": `17 ${celsius.suffix}`,
				"Is connected to a heat network": "No",
				"Energy supply": "Electricity",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatPumpSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat pump summary (connected to heat network)", async () => {
			mockFetch.mockReturnValueOnce({ data: ref({ modelName: "Mock product" }) });
			const heatNetwork: HeatSourceData = {
				id: "network-1",
				name: "Heat network 1",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				productReference: "HEAT_NETWORK_1",
			};
			const heatPump2: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c22",
				name: "Booster heat pump",
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "booster",
				productReference: "BOOSTER_PUMP",
				maxFlowTemp: unitValue(35, celsius),
				isConnectedToHeatNetwork: true,
				associatedHeatNetworkId: "network-1",
			};
			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatNetwork }, { data: heatPump2 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Booster heat pump",
				"Type of heat source": "Heat pump",
				"Type of heat pump": "Booster",
				"Product reference": "BOOSTER_PUMP",
				"Product name": "Mock product",
				"Maximum flow temperature": `35 ${celsius.suffix}`,
				"Is connected to a heat network": "Yes",
				"Associated heat network": "Heat network 1",
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
				maxFlowTemp: unitValue(32, celsius),
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
				"Product name": "Mock product",
				"Maximum flow temperature": `32 ${celsius.suffix}`,
				"Number of units": "1",
				"Energy supply": "Electricity",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatBatterySummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		// it("displays the correct data for the heat network summary", async () => {

		// 	const boosterHeatPump: HeatSourceData = {
		// 		id: "0b77e247-53c5-42b8-9dbd-83cbfc811111",
		// 		name: "Booster HP",
		// 		typeOfHeatSource: "heatPump",
		// 		typeOfHeatPump: "booster",
		// 		productReference: "HEATPUMP_LARGE",
		// 	};

		// 	const heatNetwork1: HeatSourceData = {
		// 		id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
		// 		name: "Heat network 1",
		// 		typeOfHeatSource: "heatNetwork",
		// 		typeOfHeatNetwork: "communalHeatNetwork",
		// 		isHeatNetworkInPcdb: true,
		// 		productReference: "HEAT_NETWORK-LARGE",
		// 		energySupply: "electricity",
		// 		usesHeatInterfaceUnits: false,
		// 		hasBoosterHeatPump: true,
		// 		boosterHeatPumpId: boosterHeatPump.id,
		// 	};

		// 	const store = useEcaasStore();
		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatSource: {
		// 				data: [{ data: boosterHeatPump }, { data: heatNetwork1 }],
		// 			},
		// 		},
		// 	});

		// 	await renderSuspended(SpaceHeatingSummary);

		// 	const expectedResult = {
		// 		Name: "Heat network 1",
		// 		"Type of heat source": "Heat network",
		// 		"Type of heat network": "Communal heat network",
		// 		"Is the heat network in the PCDB": "Yes",
		// 		"Heat network product reference": "HEAT_NETWORK-LARGE",
		// 		"Booster heat pump": boosterHeatPump.name,
		// 		"Energy supply": "Electricity",
		// 		"Product name": "Mock product",
		// 		"Will the heat network use heat interface units": "No",
		// 	};

		// 	for (const [key, value] of Object.entries(expectedResult)) {
		// 		const lineResult = (await screen.findByTestId(`summary-heatNetworkSummary-${hyphenate(key)}`));
		// 		expect(lineResult.querySelector("dt")?.textContent).toBe(key);
		// 		expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		it("displays the correct data for the heat network summary", async () => {
			mockFetch.mockReturnValue({ data: ref({ modelName: "Mock heat network product", communityHeatNetworkName: "Community Network A", subheatNetworkName: "Subnetwork 2" }) });
			const heatNetwork1: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c55",
				name: "Heat network 1",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				productReference: "HEAT_NETWORK-LARGE",
				subHeatNetworkId: "td-2",
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
				"Product reference": "HEAT_NETWORK-LARGE",
				"Product name": "Community Network A - Subnetwork 2",
				"Sub-heat network ID": "td-2",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatNetworkSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}

			expect(screen.queryByTestId(`summary-heatNetworkSummary-${hyphenate("Heat network name")}`)).toBeNull();
			expect(screen.queryByTestId(`summary-heatNetworkSummary-${hyphenate("Subheatnetwork name")}`)).toBeNull();
		});

		it("renders emptyValueRendering for missing combined heat network product name", async () => {
			mockFetch.mockReturnValue({ data: ref({ modelName: "Mock heat network product" }) });
			const heatNetwork1: HeatSourceData = {
				id: "463c94f6-566c-49b2-af27-57e5c68b5c66",
				name: "Heat network 2",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				productReference: "HEAT_NETWORK-MEDIUM",
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
				"Product name": "-",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatNetworkSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data for the heat interface unit summary", async () => {
			mockFetch.mockReturnValue({ data: ref({ modelName: "Mock HIU product" }) });
			const heatNetwork: HeatSourceData = {
				id: "network-1",
				name: "Heat network 1",
				typeOfHeatSource: "heatNetwork",
				typeOfHeatNetwork: "communalHeatNetwork",
				productReference: "HEAT_NETWORK_1",
			};
			const hiu: HeatSourceData = {
				id: "hiu-1",
				name: "Heat interface unit 1",
				typeOfHeatSource: "heatInterfaceUnit",
				productReference: "HIU-LARGE",
				maxFlowTemp: unitValue(40, celsius),
				buildingLevelLosses: unitValue(500, "watt"),
				associatedHeatNetworkId: "network-1",
			};

			const store = useEcaasStore();
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatNetwork }, { data: hiu }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat interface unit 1",
				"Type of heat source": "Heat interface unit",
				"Product reference": "HIU-LARGE",
				"Product name": "Mock HIU product",
				"Associated heat network": "Heat network 1",
				"Maximum flow temperature": `40 ${celsius.suffix}`,
				"Building level losses": "500 W",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-heatInterfaceUnitSummary-${hyphenate(key)}`));
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

		it("displays primary heating system when one ranked emitter exists", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
					heatEmitters: {
						data: [{
							data: {
								id: "emitter-1",
								name: "Radiator system",
								typeOfHeatEmitter: "wetDistributionSystem",
								heatingRank: 1,
								emitters: [],
							},
						}],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "Separate temperature control",
				"Primary heating system": "Radiator system",
			};

			await verifyDataInSection("heatingControls", expectedSectionData);
		});

		it("displays primary and secondary heating systems when two ranked emitters exist", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
					heatEmitters: {
						data: [
							{
								data: {
									id: "emitter-1",
									name: "Radiator system",
									typeOfHeatEmitter: "wetDistributionSystem",
									heatingRank: 1,
									emitters: [],
								},
							},
							{
								data: {
									id: "emitter-2",
									name: "Fan coil system",
									typeOfHeatEmitter: "warmAirHeater",
									heatingRank: 2,
								},
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "Separate temperature control",
				"Primary heating system": "Radiator system",
				"Secondary heating system": "Fan coil system",
			};

			await verifyDataInSection("heatingControls", expectedSectionData);
		});

		it("displays additional heating systems when more than two ranked emitters exist", async () => {
			store.$patch({
				spaceHeating: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
					heatEmitters: {
						data: [
							{
								data: {
									id: "emitter-1",
									name: "Radiator system",
									typeOfHeatEmitter: "wetDistributionSystem",
									heatingRank: 1,
									emitters: [],
								},
							},
							{
								data: {
									id: "emitter-2",
									name: "Fan coil system",
									typeOfHeatEmitter: "warmAirHeater",
									heatingRank: 2,
								},
							},
							{
								data: {
									id: "emitter-3",
									name: "Backup electric system",
									typeOfHeatEmitter: "instantElectricHeater",
									heatingRank: 3,
								},
							},
						],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "Separate temperature control",
				"Primary heating system": "Radiator system",
				"Secondary heating system": "Fan coil system",
				"3rd heating system": "Backup electric system",
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

		const wetDistributionSystem: HeatEmittingData = {
			id: "wet-dist-1",
			name: "Wet Distribution 1",
			typeOfHeatEmitter: "wetDistributionSystem",
			heatSource: "heat-pump-id",
			ecoDesignControllerClass: "1",
			designFlowTemp: 55,
			designTempDiffAcrossEmitters: 10,
			hasVariableFlowRate: false,
			designFlowRate: 100,
			percentageRecirculated: 20,
			emitters: [
				{
					id: "radiator-1",
					name: "Radiator 1",
					typeOfHeatEmitter: "radiator",
					productReference: "RAD-SMALL",
					numOfRadiators: 5,
					length: 1,
				},
			],
		};

		const wetDistributionSystemWithEcoDesign2: HeatEmittingData = {
			id: "wet-dist-2",
			name: "Wet Distribution 2",
			typeOfHeatEmitter: "wetDistributionSystem",
			heatSource: "heat-pump-id",
			ecoDesignControllerClass: "2",
			minFlowTemp: 45,
			minOutdoorTemp: 1,
			maxOutdoorTemp: 15,
			designFlowTemp: 55,
			designTempDiffAcrossEmitters: 10,
			hasVariableFlowRate: true,
			minFlowRate: 50,
			maxFlowRate: 200,
			percentageRecirculated: 20,
			emitters: [
				{
					id: "radiator-1",
					name: "Radiator 1",
					typeOfHeatEmitter: "radiator",
					productReference: "RAD-SMALL",
					numOfRadiators: 5,
					length: 1,
				},
				{
					id: "ufh-1",
					name: "Underfloor Heating 1",
					typeOfHeatEmitter: "underfloorHeating",
					productReference: "UFH-SMALL",
					areaOfUnderfloorHeating: 100,
				},
				{
					id: "fc-1",
					name: "Fan Coil 1",
					typeOfHeatEmitter: "fanCoil",
					productReference: "FC-SMALL",
					numOfFanCoils: 3,
				},
			],
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
			convectiveType: "Air heating (convectors, fan coils etc.)",
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

		it.each([
			["wetDistributionSystemSummary", wetDistributionSystem],
			["warmAirHeaterSummary", warmAirHeater],
			["instantElectricHeaterSummary", instantElectricHeater],
			["electricStorageHeaterSummary", electricStorageHeater],
		])("displays %s tab when a %s has been added", async (testId, heatEmitter) => {
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

		const expectedWetDistData = {
			Name: "Wet Distribution 2",
			"Type of heat emitter": "Wet distribution system (Radiators, underfloor heating, etc.)",
			"Eco design controller class": "2",
			"Minimum outdoor temperature": "1 °C",
			"Maximum outdoor temperature": "15 °C",
			"Minimum flow temperature": "45 °C",
			"Design flow temperature": "55 °C",
			"Design temperature difference across emitters": "10 °C",
			"Is there a variable flow rate?": "Yes",
			"Maximum flow rate": "200 l/min",
			"Minimum flow rate": "50 l/min",
			"Percentage recirculated": "20 %",
			"Name of emitter 1": "Radiator 1",
			"Type of emitter 1": "Radiator",
			"Product reference of emitter 1": "RAD-SMALL",
			"Product name of emitter 1": "Mock product",
			"Number of radiators 1": "5",
			"Number of fan coils 1": "-",
			"Area of underfloor heating 1": "-",
			"Name of emitter 2": "Underfloor Heating 1",
			"Type of emitter 2": "Underfloor heating",
			"Product reference of emitter 2": "UFH-SMALL",
			"Product name of emitter 2": "Mock product",
			"Number of radiators 2": "-",
			"Number of fan coils 2": "-",
			"Area of underfloor heating 2": "100 m²",
			"Name of emitter 3": "Fan Coil 1",
			"Type of emitter 3": "Fan coil",
			"Product reference of emitter 3": "FC-SMALL",
			"Product name of emitter 3": "Mock product",
			"Number of radiators 3": "-",
			"Number of fan coils 3": "3",
			"Area of underfloor heating 3": "-",
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
			"Type of convection": "Air heating",
			"Number of heaters": "6",
		};

		const expectedElectricStorageHeaterData = {
			Name: "Electric Storage Heater 1",
			"Product reference": "ESH-SMALL",
			"Product name": "Mock product",
			"Number of storage heaters": "8",
		};
		it.each(
			[
				["wetDistributionSystemSummary", expectedWetDistData],
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
							{ data: wetDistributionSystemWithEcoDesign2 },
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

		it("displays wet distribution system with draft emitter and missing fields as work in progress", async () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{
							data: {
								id: "wet-dist-wip",
								name: "WIP System",
								typeOfHeatEmitter: "wetDistributionSystem",
								heatSource: "heat-pump-id",
								emitters: [
									{
										id: "draft-emitter-1",
										name: "Draft Emitter",
									},
								],
							},
						}],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedData = {
				Name: "WIP System",
				"Type of heat emitter": "Wet distribution system (Radiators, underfloor heating, etc.)",
				"Percentage recirculated": "-",
				"Name of emitter 1": "Draft Emitter",
				"Type of emitter 1": "-",
				"Product reference of emitter 1": "-",
				"Product name of emitter 1": "-",
				"Number of radiators 1": "-",
				"Number of fan coils 1": "-",
				"Area of underfloor heating 1": "-",
			};

			await verifyDataInSection("wetDistributionSystemSummary", expectedData);
		});
	});
});