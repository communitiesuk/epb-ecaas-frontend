import { renderSuspended } from "@nuxt/test-utils/runtime";
import spaceHeatingSummary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { kilowatt } from "~/utils/units/power";
import { kilowattHourPerKelvin } from "~/utils/units/thermalConductivity";
import { celsius } from "~/utils/units/temperature";
import { litrePerMinute } from "~/utils/units/flowRate";
import { metresSquare } from "~/utils/units/area";
import { userEvent } from "@testing-library/user-event";

type expectedData = { [key: string]: string };
const verifyDataInSection = async (
	section: string,
	expectedSectionData: expectedData,
) => {
	for (const [key, value] of Object.entries(expectedSectionData)) {
		const lineResult = screen.queryByTestId(
			`summary-${section}-${hyphenate(key)}`,
		);
		expect(lineResult!.querySelector("dt")?.textContent).toBe(key);
		expect(lineResult!.querySelector("dd")?.textContent).toBe(value);
	}
};
describe.skip("Heating and cooling systems summary page", () => {
	const store = useEcaasStore();
	beforeEach(() => {
		store.$reset();
	});

	it("displays the correct title", async () => {
		await renderSuspended(spaceHeatingSummary);
		expect(screen.getByRole("heading", { name: "Space heating summary" }));
	});

	describe("General section", () => {
		it("displays general tab", async () => {
			await renderSuspended(spaceHeatingSummary);

			expect(screen.getByRole("link", { name: "General" })).not.toBeNull();
		});

		it("displays an empty section if no data has been added", async () => {
			await renderSuspended(spaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "-",
				"Cooling required": "-",
			};

			await verifyDataInSection("general", expectedSectionData);
		});

		it("displays the correct data when data has been added", async () => {
			store.$patch({
				spaceHeating: {
					general: {
						data: {
							heatingControlType: "separateTemperatureControl",
							coolingRequired: true,
						},
					},
				},
			});

			await renderSuspended(spaceHeatingSummary);

			const expectedSectionData = {
				"Type of heating control": "Separate temperature control",
				"Cooling required": "Yes",
			};

			await verifyDataInSection("general", expectedSectionData);
		});

		it("displays an edit link that navigates to the general form page when clicked", async () => {
			await renderSuspended(spaceHeatingSummary);

			const generalSection = screen.getByTestId("general");
			const editLink: HTMLAnchorElement = within(generalSection).getByText("Edit");

			expect(new URL(editLink.href).pathname).toBe("/space-heating/general");
		});
	});

	describe("Heat generation section", () => {
		const heatPump: HeatPumpData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE",
			typeOfHeatPump: "airSource",
		};
		const _boiler: BoilerData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Boiler 1",
		};
		const _heatBattery: HeatBatteryData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat battery 1",
		};
		const _heatNetwork: HeatNetworkData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat network 1",
		};
		const _heatInterfaceUnit: HeatInterfaceUnitData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat interface unit 1",
		};

		it("should contain the correct tabs for heat generation section", async () => {
			await renderSuspended(spaceHeatingSummary);
			expect(screen.getByRole("link", { name: "Heat pumps" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Boilers" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Heat batteries" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Heat networks" })).not.toBeNull();
			// expect(
			// 	screen.getByRole("link", { name: "Heat interface units" })
			// ).not.toBeNull();
		});

		it("displays 'No heat pumps added' and link to create heat pump when no data exists", async () => {
			await renderSuspended(spaceHeatingSummary);

			const heatPumpSummary = screen.getByTestId("heatPump");

			expect(within(heatPumpSummary).getByText("No heat pumps added")).not.toBeNull();
			const addHeatPumpLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat pump",
			});
			expect(new URL(addHeatPumpLink.href).pathname).toBe(
				getUrl("heatPumpCreate"),
			);
		});

		it("displays the correct data for the heat pump section", async () => {

			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});
			await renderSuspended(spaceHeatingSummary);

			await verifyDataInSection("heatPump", { "Name": "Heat pump 1", "Type of heat pump": "Air source", "Product": "HEATPUMP-LARGE" });

		});

		// it("displays the correct data for the boiler section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatGeneration: {
		// 				boiler: {
		// 					data: [boiler],
		// 				},
		// 			},
		// 		},
		// 	});
		// 	await renderSuspended(spaceHeatingSummary);

		// 	await verifyDataInSection("boiler", { "Name": "Boiler 1" });
		// });

		// it("displays the correct data for the heat battery section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatGeneration: {
		// 				heatBattery: {
		// 					data: [heatBattery],
		// 				},
		// 			},
		// 		},
		// 	});
		// 	await renderSuspended(spaceHeatingSummary);

		// 	await verifyDataInSection("heatBattery", { "Name": "Heat battery 1" });

		// });

		// it("displays the correct data for the heat network section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatGeneration: {
		// 				heatNetwork: {
		// 					data: [heatNetwork],
		// 				},
		// 			},
		// 		},
		// 	});
		// 	await renderSuspended(spaceHeatingSummary);

		// 	await verifyDataInSection("heatNetwork", { "Name": "Heat network 1" });
		// });

		// it("displays the correct data for the heat interface unit section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatGeneration: {
		// 				heatInterfaceUnit: {
		// 					data: [heatInterfaceUnit],
		// 				},
		// 			},
		// 		},
		// 	});
		// 	await renderSuspended(spaceHeatingSummary);

		// 	await verifyDataInSection("heatInterfaceUnit", { "Name": "Heat interface unit 1" });

		// });

		it("displays an edit link on each section that navigates to the heat generation overview page when clicked", async () => {

			store.$patch({
				spaceHeating: {
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
						// boiler: {
						// 	data: [boiler],
						// },
						// heatBattery: {
						// 	data: [heatBattery],
						// },
						// heatNetwork: {
						// 	data: [heatNetwork],
						// },
						// heatInterfaceUnit: {
						// 	data: [heatInterfaceUnit],
						// },
					},
				},
			});

			await renderSuspended(spaceHeatingSummary);
			const supportedHeatGenerationItems = ["heatPump"];
			// The original loop cannot be used while non-supported heat generation items exist in ecaasStore.
			// Until all heat generation items in ecaasStore are supported, use the above list.

			// for (const [key] of Object.entries(store.spaceHeating.heatGeneration)) {
			for (const key of supportedHeatGenerationItems) {
				const heatGenerationSection = screen.getByTestId(key);

				const editLink: HTMLAnchorElement = within(heatGenerationSection).getByText(
					"Edit",
				);
				expect(editLink).not.toBeNull();
				expect(new URL(editLink.href).pathname).toBe(
					"/space-heating/heat-generation",
				);
			}
		});
	});

	describe("Heat emitting section", () => {
		const heatPump: HeatPumpData = {
			id: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE",
			typeOfHeatPump: "airSource",
		};

		const wetDistribution1: EcaasForm<WetDistributionData> = {
			data: {
				name: "Wet distribution 1",
				heatSource: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
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
			},
		};

		const wetDistribution2: EcaasForm<WetDistributionData> = {
			data: {
				name: "Wet distribution 2",
				heatSource: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
				thermalMass: 2,
				designTempDiffAcrossEmitters: 0.4,
				designFlowTemp: 32,
				designFlowRate: 5,
				typeOfSpaceHeater: "ufh",
				emitterFloorArea: 5,
				equivalentThermalMass: 80,
				systemPerformanceFactor: 5,
				convectionFractionWet: 0.3,
				ecoDesignControllerClass: "1",
				minimumFlowTemp: 20,
				minOutdoorTemp: 0,
				maxOutdoorTemp: 15,
			},
		};

		const instantElectricHeater: EcaasForm<InstantElectricStorageData> = {
			data: {
				name: "Instant electric heater 1",
				ratedPower: 3,
				convectiveType: "Floor heating, low temperature radiant tube heaters, luminous heaters, wood stoves",
			},
		};
		const _electricStorageHeater: ElectricStorageHeaterData = {
			name: "Electric storage heater 1",
		};
		const _warmAirHeatPump: WarmAirHeatPumpData = {
			name: "Warm air heat pump 1",
		};

		it("should contain the correct tabs for heating emitting section", async () => {
			await renderSuspended(spaceHeatingSummary);

			expect(screen.getByRole("link", { name: "Wet distribution" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Instant electric heaters" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Electric storage heaters" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Warm air heat pumps" })).not.toBeNull();
		});

		it("displays 'No wet distribution added' and link to create wet distribution when no data exists", async () => {
			await renderSuspended(spaceHeatingSummary);

			const wetDistributionSummary = screen.getByTestId("wetDistribution");

			expect(within(wetDistributionSummary).getByText("No wet distribution added")).not.toBeNull();
			const addWetDistributionLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add wet distribution",
			});
			expect(new URL(addWetDistributionLink.href).pathname).toBe(
				getUrl("wetDistributionCreate"),
			);
		});

		it("displays the correct data for the wet distribution section when type of space heater is Radiators", async () => {

			store.$patch({
				spaceHeating: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});

			const expectedWetDistributionData = {
				"Name": "Wet distribution 1",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Radiators",
				"Convection fraction": "0.2",
				"Eco design controller class": "I: On/Off Room Thermostat",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};
			await renderSuspended(spaceHeatingSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays the correct data for the wet distribution section when type of space heater is Underfloor heating", async () => {

			store.$patch({
				spaceHeating: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution2],
						},
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});

			const expectedWetDistributionData = {
				"Name": "Wet distribution 2",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Underfloor heating",
				"Emitter floor area": `5 ${metresSquare.suffix}`,
				"Eco design controller class": "I: On/Off Room Thermostat",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};

			await renderSuspended(spaceHeatingSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays the correct data for the wet distribution section", async () => {

			store.$patch({
				spaceHeating: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});

			const expectedWetDistributionData = {
				"Name": "Wet distribution 1",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Radiators",
				"Convection fraction": "0.2",
				"Eco design controller class": "I: On/Off Room Thermostat",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};

			await renderSuspended(spaceHeatingSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays 'No instant electric heaters added' and link to create instant electric heater when no data exists", async () => {
			const user = userEvent.setup();

			await renderSuspended(spaceHeatingSummary);
			const instantElectricHeaterTab = screen.getByRole("link", { name: "Instant electric heaters" });
			await user.click(instantElectricHeaterTab);
			const instantElectricHeaterSummary = screen.getByTestId("instantElectricHeater");

			expect(within(instantElectricHeaterSummary).getByText("No instant electric heaters added")).not.toBeNull();
			const addInstantElectricHeaterLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add instant electric heater",
			});
			expect(new URL(addInstantElectricHeaterLink.href).pathname).toBe(
				getUrl("instantElectricHeaterCreate"),
			);
		});

		it("displays the correct data for the instant electric heater section", async () => {

			store.$patch({
				spaceHeating: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater],
						},
					},
				},
			});

			const expectedInstantElectricHeaterData = {
				Name: "Instant electric heater 1",
				"Rated power": `3 ${kilowatt.suffix}`,
				"Convective type": "Floor heating, low temperature radiant tube heaters, luminous heaters, wood stoves",
			};
			await renderSuspended(spaceHeatingSummary);
			await verifyDataInSection(
				"instantElectricHeater",
				expectedInstantElectricHeaterData,
			);
		});

		// it("displays the correct data for the electric storage heater section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatEmitting: {
		// 				electricStorageHeater: {
		// 					data: [electricStorageHeater],
		// 				},
		// 			},
		// 		},
		// 	});

		// 	await renderSuspended(spaceHeatingSummary);
		// 	const lineResult = await screen.findByTestId(
		// 		"summary-electricStorageHeater-name",
		// 	);

		// 	expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
		// 	expect(lineResult.querySelector("dd")?.textContent).toBe(
		// 		"Electric storage heater 1",
		// 	);
		// });

		// it("displays the correct data for the warm air heat pump section", async () => {

		// 	store.$patch({
		// 		spaceHeating: {
		// 			heatEmitting: {
		// 				warmAirHeatPump: {
		// 					data: [warmAirHeatPump],
		// 				},
		// 			},
		// 		},
		// 	});

		// 	await renderSuspended(spaceHeatingSummary);
		// 	const lineResult = await screen.findByTestId(
		// 		"summary-warmAirHeatPump-name",
		// 	);

		// 	expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
		// 	expect(lineResult.querySelector("dd")?.textContent).toBe(
		// 		"Warm air heat pump 1",
		// 	);
		// });

		it("displays an edit link on each section that navigates to the heat emitting overview page when clicked", async () => {

			store.$patch({
				spaceHeating: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
						instantElectricHeater: {
							data: [instantElectricHeater],
						},
						// electricStorageHeater: {
						// 	data: [electricStorageHeater],
						// },
						// warmAirHeatPump: {
						// 	data: [warmAirHeatPump],
						// },
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});
			await renderSuspended(spaceHeatingSummary);
			const supportedHeatEmittingItems = ["wetDistribution", "instantElectricHeater"];
			// The original loop cannot be used while non-supported heat emitting items exist in ecaasStore.
			// Until all heat emitting items in ecaasStore are supported, use the above list.

			// for (const [key] of Object.entries(store.spaceHeating.heatEmitting)) {
			for (const key of supportedHeatEmittingItems) {
				const heatEmittingSection = screen.getByTestId(key);

				const editLink: HTMLAnchorElement = within(heatEmittingSection).getByText(
					"Edit",
				);
				expect(editLink).not.toBeNull();
				expect(new URL(editLink.href).pathname).toBe(
					"/space-heating/heat-emitting",
				);
			}
		});
	});
});
