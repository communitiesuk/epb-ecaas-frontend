import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatingSystemsSummary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { kilowatt } from "~/utils/units/power";
import { kilowattHourPerKelvin } from "~/utils/units/thermalConductivity";
import { celsius } from "~/utils/units/temperature";
import { litrePerMinute } from "~/utils/units/flowRate";
import { metresSquare } from "~/utils/units/area";
import { co2PerKilowattHour } from "~/utils/units/emissions";

type expectedData = { [key: string]: string };
const verifyDataInSection = async (
	section: string,
	expectedSectionData: expectedData
) => {
	for (const [key, value] of Object.entries(expectedSectionData)) {
		const lineResult = screen.queryByTestId(
			`summary-${section}-${hyphenate(key)}`
		);
		expect(lineResult!.querySelector("dt")?.textContent).toBe(key);
		expect(lineResult!.querySelector("dd")?.textContent).toBe(value);
	}
};
describe("Heating systems summary page", () => {
	it("displays the correct title", async () => {
		await renderSuspended(HeatingSystemsSummary);
		expect(screen.getByRole("heading", { name: "Heating system summary" }));
	});

	describe("Energy supply section", () => {
		it("displays energy supply tab", async () => {
			await renderSuspended(HeatingSystemsSummary);
			expect(
				screen.getByRole("link", { name: "Energy supply" })
			).not.toBeNull();
		});

		it("displays an empty section if no energy supply data has been added", async () => {
			await renderSuspended(HeatingSystemsSummary);
	
			await verifyDataInSection("energySupply", { "Fuel type": "" });
		});

		it("displays the correct fields when electricity is selected", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					energySupply: {
						data: {
							fuelType: ["electricity"],
							exported: false
						},
					},
				},
			});

			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("energySupply", {
				"Fuel type": "Electricity",
				"Exported": "No",
			});
		});

		it("displays the correct fields when custom is selected", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					energySupply: {
						data: {
							fuelType: ["custom"],
							co2PerKwh: 1,
							co2PerKwhIncludingOutOfScope: 2,
							kwhPerKwhDelivered: 3,
						},
					},
				},
			});

			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("energySupply", {
				"Fuel type": "Custom",
				"CO2 per kWh": `1 ${co2PerKilowattHour.suffix}`,
				"CO2 per kWh (including out of scope)": `2 ${co2PerKilowattHour.suffix}`,
				"kWh per kWh delivered": "3",
			});
		});

		it("displays all conditional fields when both electricity and custom are selected", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					energySupply: {
						data: {
							fuelType: ["custom", "electricity"],
							co2PerKwh: 1,
							co2PerKwhIncludingOutOfScope: 2,
							kwhPerKwhDelivered: 3,
							exported: true
						},
					},
				},
			});

			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("energySupply", {
				"Fuel type": "CustomElectricity",
				"CO2 per kWh": `1 ${co2PerKilowattHour.suffix}`,
				"CO2 per kWh (including out of scope)": `2 ${co2PerKilowattHour.suffix}`,
				"kWh per kWh delivered": "3",
				"Exported": "Yes"
			});
		});
    
		it("displays an edit link that navigates to the energy supply form page when clicked", async () => {
			await renderSuspended(HeatingSystemsSummary);
			const editLink = screen.getByRole<HTMLAnchorElement>("link", {
				name: "Edit",
			});
			expect(new URL(editLink.href).pathname).toBe(
				"/heating-systems/energy-supply"
			);
		});
	});

	describe("Heat generation section", () => {
		const heatPump: HeatPumpData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE"
		};
		const boiler: BoilerData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Boiler 1",
		};
		const heatBattery: HeatBatteryData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat battery 1",
		};
		const heatNetwork: HeatNetworkData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat network 1",
		};
		const heatInterfaceUnit: HeatInterfaceUnitData = {
			id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
			name: "Heat interface unit 1",
		};

		it("displays 'No heat generators added' and link to heat generation overview page when no data exists", async () => {
			await renderSuspended(HeatingSystemsSummary);

			expect(screen.getByText("No heat generators added")).not.toBeNull();
			const addHeatGenerationLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat generators",
			});
			expect(new URL(addHeatGenerationLink.href).pathname).toBe(
				getUrl("heatGeneration")
			);
		});

		it("displays tabs only for the heat generation types that have data", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{ data:heatPump }]
						},
						boiler: {
							data: [boiler],
						},
						heatBattery: {
							data: [heatBattery],
						},
						heatNetwork: {
							data: [heatNetwork],
						},
						heatInterfaceUnit: {
							data: [heatInterfaceUnit],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);
			expect(screen.getByRole("link", { name: "Heat pump" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Boiler" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Heat battery" })).not.toBeNull();
			// expect(screen.getByRole("link", { name: "Heat network" })).not.toBeNull();
			// expect(
			// 	screen.getByRole("link", { name: "Heat interface unit" })
			// ).not.toBeNull();
		});

		it("displays the correct data for the heat pump section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }]
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);

			await verifyDataInSection("heatPump", { "Name": "Heat pump 1" });

		});

		it("displays the correct data for the boiler section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						boiler: {
							data: [boiler],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);

			await verifyDataInSection("boiler", { "Name": "Boiler 1" });
		});

		it("displays the correct data for the heat battery section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatBattery: {
							data: [heatBattery],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);

			await verifyDataInSection("heatBattery", { "Name": "Heat battery 1" });

		});

		it("displays the correct data for the heat network section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatNetwork: {
							data: [heatNetwork],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);

			await verifyDataInSection("heatNetwork", { "Name": "Heat network 1" });
		});

		it("displays the correct data for the heat interface unit section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatInterfaceUnit: {
							data: [heatInterfaceUnit],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);

			await verifyDataInSection("heatInterfaceUnit", { "Name": "Heat interface unit 1" });

		});
		it("displays an edit link on each section that navigates to the heat generation overview page when clicked", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
						boiler: {
							data: [boiler],
						},
						heatBattery: {
							data: [heatBattery],
						},
						heatNetwork: {
							data: [heatNetwork],
						},
						heatInterfaceUnit: {
							data: [heatInterfaceUnit],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);
			for (const [key] of Object.entries(store.heatingSystems.heatGeneration)) {
				const heatGenerationSection = screen.getByTestId(key);

				const editLink: HTMLAnchorElement = within(heatGenerationSection).getByText(
					"Edit"
				);
				expect(editLink).not.toBeNull();
				expect(new URL(editLink.href).pathname).toBe(
					"/heating-systems/heat-generation"
				);
			}
		});
	});

	describe("Heat emitting section", () => {
		const heatPump: HeatPumpData = {
			id: "7184f2fe-a78f-4a56-ba5a-1a7751ac507r",
			name: "Heat pump 1",
			productReference: "HEATPUMP-LARGE"
		};

		const wetDistribution1: WetDistributionData = {
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
		};

		const wetDistribution2: WetDistributionData = {
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
		};

		const instantElectricHeater: EcaasForm<InstantElectricStorageData> = {
			data: {
				name: "Instant electric heater 1",
				ratedPower: 3,
				convectionFractionInstant: 0.2
			}
		};
		const electricStorageHeater: ElectricStorageHeaterData = {
			name: "Electric storage heater 1",
		};
		const warmAirHeatPump: WarmAirHeatPumpData = {
			name: "Warm air heat pump 1",
		};

		it("displays 'No heat emittors added' and link to heat emitting overview page when no data exists", async () => {
			await renderSuspended(HeatingSystemsSummary);

			expect(screen.getByText("No heat emitters added")).not.toBeNull();
			const addHeatEmittingLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add heat emitters",
			});
			expect(new URL(addHeatEmittingLink.href).pathname).toBe(
				getUrl("heatEmitting")
			);
		});
		it("displays tabs only for the heat emitting types that have data", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
						instantElectricHeater: {
							data: [instantElectricHeater],
						},
						electricStorageHeater: {
							data: [electricStorageHeater],
						},
						warmAirHeatPump: {
							data: [warmAirHeatPump],
						},
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);
			expect(
				screen.getByRole("link", { name: "Wet distribution" })
			).not.toBeNull();
			expect(
				screen.getByRole("link", { name: "Instant electric heater" })
			).not.toBeNull();
			expect(
				screen.getByRole("link", { name: "Electric storage heater" })
			).not.toBeNull();
			expect(
				screen.getByRole("link", { name: "Warm air heat pump" })
			).not.toBeNull();
		});

		it("displays the correct data for the wet distribution section when type of space heater is Radiators", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
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
				Name: "Wet distribution 1",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Radiators",
				"Convection fraction": "0.2",
				"Eco design controller class": "1",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};
			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays the correct data for the wet distribution section when type of space heater is Underfloor heating", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
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
				Name: "Wet distribution 2",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Underfloor heating",
				"Emitter floor area": `5 ${metresSquare.suffix}`,
				"Eco design controller class": "1",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};

			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays the correct data for the wet distribution section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
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
				Name: "Wet distribution 1",
				"Heat source": "Heat pump 1",
				"Thermal mass": `2 ${kilowattHourPerKelvin.suffix}`,
				"Design temperature difference across the emitters": `0.4 ${celsius.suffix}`,
				"Design flow temperature": `32 ${celsius.suffix}`,
				"Design flow rate": `5 ${litrePerMinute.suffix}`,
				"Type of space heater": "Radiators",
				"Convection fraction": "0.2",
				"Eco design controller class": "1",
				"Minimum flow temperature": `20 ${celsius.suffix}`,
			};

			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("wetDistribution", expectedWetDistributionData);
		});

		it("displays the correct data for the instant electric heater section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
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
				"Convection fraction": "0.2",
			};
			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection(
				"instantElectricHeater",
				expectedInstantElectricHeaterData
			);
		});

		it("displays the correct data for the electric storage heater section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatEmitting: {
						electricStorageHeater: {
							data: [electricStorageHeater],
						},
					},
				},
			});

			await renderSuspended(HeatingSystemsSummary);
			const lineResult = await screen.findByTestId(
				"summary-electricStorageHeater-name"
			);

			expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
			expect(lineResult.querySelector("dd")?.textContent).toBe(
				"Electric storage heater 1"
			);
		});
		it("displays the correct data for the warm air heat pump section", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatEmitting: {
						warmAirHeatPump: {
							data: [warmAirHeatPump],
						},
					},
				},
			});

			await renderSuspended(HeatingSystemsSummary);
			const lineResult = await screen.findByTestId(
				"summary-warmAirHeatPump-name"
			);

			expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
			expect(lineResult.querySelector("dd")?.textContent).toBe(
				"Warm air heat pump 1"
			);
		});

		it("displays an edit link on each section that navigates to the heat emitting overview page when clicked", async () => {
			const store = useEcaasStore();

			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
						instantElectricHeater: {
							data: [instantElectricHeater],
						},
						electricStorageHeater: {
							data: [electricStorageHeater],
						},
						warmAirHeatPump: {
							data: [warmAirHeatPump],
						},
					},
					heatGeneration: {
						heatPump: {
							data: [{ data: heatPump }],
						},
					},
				},
			});
			await renderSuspended(HeatingSystemsSummary);
			for (const [key] of Object.entries(store.heatingSystems.heatEmitting)) {
				const heatEmittingSection = screen.getByTestId(key);

				const editLink: HTMLAnchorElement = within(heatEmittingSection).getByText(
					"Edit"
				);
				expect(editLink).not.toBeNull();
				expect(new URL(editLink.href).pathname).toBe(
					"/heating-systems/heat-emitting"
				);
			}
		});
	});
});
