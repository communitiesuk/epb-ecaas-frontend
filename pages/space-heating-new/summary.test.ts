import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, within } from "@testing-library/vue";
import SpaceHeatingSummary from "./summary.vue";
import { degrees } from "~/utils/units/angle";

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

describe("Space heating summary page", () => {
	it("displays the correct title", async () => {
		await renderSuspended(SpaceHeatingSummary);
		expect(screen.getByRole("heading", { name: "Space heating NEW summary" }));
	});

	describe("Heat sources section", () => {

    
    it("displays an empty tab state when no data is present", async () => {
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
        typeOfHeatSource: HeatSourceType.boiler,
        typeOfBoiler: "combiBoiler",
        productReference: "BOILER_SMALL",
        locationOfBoiler: AdjacentSpaceType.heatedSpace,
      };

      const store = useEcaasStore();
		  store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: boiler1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Boiler 1",
				"Type of heat source": "Boiler",
        "Type of boiler" : "Combi boiler",
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
		typeOfHeatSource: HeatSourceType.heatPump,
		typeOfHeatPump: "airSource",
		productReference: "HEAT_PUMP_SMALL",
	};
			const store = useEcaasStore();
		  store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat pump 1",
				"Type of heat source": "Heat pump",
        "Type of heat pump" : "Air source",
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
			typeOfHeatSource: HeatSourceType.heatBattery,
			typeOfHeatBattery: "pcm",
			productReference: "HEAT_BATTERY_SMALL",
			numberOfUnits: 1,
			energySupply: "electricity",
		};
			const store = useEcaasStore();
		  store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatBattery1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat battery 1",
				"Type of heat source": "Heat battery",
        "Type of heat battery" : "Pcm",
        "Product reference": "HEAT_BATTERY_SMALL",
        "Number of units": "1",
        "Energy supply": "Electricity"
			};

			for (const [key, value] of Object.entries(expectedResult)) {
        const lineResult = (await screen.findByTestId(`summary-heatBatterySummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
        
    it("displays the correct data for the solar thermal system summary", async () => {
      
	const solarThermalSystem1: HeatSourceData = {
			id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3333",
			name: "Solar thermal system",
			typeOfHeatSource: HeatSourceType.solarThermalSystem,
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
				spaceHeatingNew: {
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
        "Orientation":`60 ${degrees.suffix}`,
			};
 
			for (const [key, value] of Object.entries(expectedResult)) {
        const lineResult = (await screen.findByTestId(`summary-solarThermalSystemSummary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
  });
	// describe("Electric battery section", () => {
	// 	const battery: EcaasForm<ElectricBatteryData> = {
	// 		data: {
	// 			name: "Acme Model II",
	// 			capacity: 10,
	// 			chargeEfficiency: 0.7,
	// 			location: "inside",
	// 			gridChargingPossible: false,
	// 			maximumChargeRate: 6.2,
	// 			minimumChargeRate: 4.5,
	// 			maximumDischargeRate: 2.3,
	// 		},
	// 	};

	// 	it("displays the battery tab", async () => {
	// 		await renderSuspended(PVAndElectricBatteriesSummary);
	// 		expect(screen.getByRole("link", { name: "Electric batteries" })).not.toBeNull();
	// 	});

	// 	it("displays an empty tab state when no data is present", async () => {
	// 		await renderSuspended(PVAndElectricBatteriesSummary);

	// 		expect(screen.getByText("No electric batteries added")).not.toBeNull();

	// 		const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
	// 			name: "Add electric battery",
	// 		});

	// 		expect(new URL(addPVSystemsLink.href).pathname).toBe(
	// 			getUrl("pvAndBatteries"),
	// 		);
	// 	});

	// 	it("displays the correct data for the electric battery summary", async () => {
	// 		const store = useEcaasStore();
	// 		store.$patch({
	// 			pvAndBatteries: {
	// 				electricBattery: {
	// 					data: [battery],
	// 				},
	// 			},
	// 		});

	// 		await renderSuspended(PVAndElectricBatteriesSummary);

	// 		const expectedResult = {
	// 			Name: "Acme Model II",
	// 			Capacity: `10 ${kilowattHour.suffix}`,
	// 			"Charge efficiency": "0.7",
	// 			Location: "Inside",
	// 			"Grid charging possible": "No",
	// 			"Maximum charge rate": `6.2 ${kilowatt.suffix}`,
	// 			"Minimum charge rate": `4.5 ${kilowatt.suffix}`,
	// 			"Maximum discharge rate": `2.3 ${kilowatt.suffix}`,
	// 		};

	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-electricBattery-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});
	// });

	// describe("Diverters section", () => {

	// 	it("displays the diverter tab", async () => {
	// 		await renderSuspended(PVAndElectricBatteriesSummary);
	// 		expect(screen.getByRole("link", { name: "Diverters" })).not.toBeNull();
	// 	});

	// 	it("displays an empty tab state when no data is present", async () => {
	// 		await renderSuspended(PVAndElectricBatteriesSummary);

	// 		expect(screen.getByText("No diverters added")).not.toBeNull();

	// 		const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
	// 			name: "Add diverter",
	// 		});

	// 		expect(new URL(addPVSystemsLink.href).pathname).toBe(
	// 			getUrl("pvAndBatteries"),
	// 		);
	// 	});

	// 	it("displays the correct data for the diverters summary", async () => {
	// 		const store = useEcaasStore();

	// 		const hotWaterCylinderName = "HWC1";
	// 		const hotWaterCylinderId = "88ea3f45-6f2a-40e2-9117-0541bd8a97f3";
	// 		const heatPumpName = "HP1";
	// 		const heatPumpId = "56ddc6ce-7a91-4263-b051-96c7216bb01e";

	// 		const diverter: EcaasForm<PvDiverterData> = {
	// 			data: {
	// 				name: "Diverter 1",
	// 				hotWaterCylinder: hotWaterCylinderId,
	// 			},
	// 		};

	// 		store.$patch({
	// 			spaceHeating: {
	// 				heatGeneration: {
	// 					heatPump: {
	// 						data: [{
	// 							data: {
	// 								name: heatPumpName,
	// 								id: heatPumpId,
	// 								productReference: "HEATPUMP-SMALL",
	// 							},
	// 						}],
	// 					},
	// 				},
	// 			},
	// 			domesticHotWater: {
	// 				waterHeating: {
	// 					hotWaterCylinder: {
	// 						data: [{
	// 							data: {
	// 								name: hotWaterCylinderName,
	// 								id: hotWaterCylinderId,
	// 								heatSource: heatPumpId,
	// 								storageCylinderVolume: {
	// 									amount: 1,
	// 									unit: "litres",
	// 								},
	// 								dailyEnergyLoss: 1,
	// 							},
	// 						}],
	// 					},
	// 				},
	// 			},
	// 			pvAndBatteries: {
	// 				diverters: {
	// 					data: [diverter],
	// 				},
	// 			},
	// 		});

	// 		await renderSuspended(PVAndElectricBatteriesSummary);

	// 		const expectedResult = {
	// 			"Name": "Diverter 1",
	// 			"Associated hot water cylinder": hotWaterCylinderName,
	// 		};

	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = await screen.findByTestId(`summary-diverters-${hyphenate(key)}`);
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	describe("Heating control section", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		const heatingControl: HeatingControlData = {
			name: "Separate temperature control",
			heatingControlType: "separateTemperatureControl",		
		};

		it("displays heating control tab", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByRole("link", { name: "Heating controls" })).not.toBeNull();
		});

		it("displays a link to add heating controls if no data has been added", async () => {
			await renderSuspended(SpaceHeatingSummary);

			expect(screen.getByRole("link", { name: "Add heating controls" })).toBeDefined();
		});

		it("displays the correct data when data has been added", async () => {
			store.$patch({
				spaceHeatingNew: {
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
				spaceHeatingNew: {
					heatingControls: {
						data: [{ data: heatingControl }],
					},
				},
			});
			await renderSuspended(SpaceHeatingSummary);

			const heatingControlSection = screen.getByTestId("heatingControls");
			const editLink: HTMLAnchorElement = within(heatingControlSection).getByText("Edit");

			expect(new URL(editLink.href).pathname).toBe("/space-heating-new/heating-controls");
		});
	});
});