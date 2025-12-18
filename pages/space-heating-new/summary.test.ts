import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, within } from "@testing-library/vue";
import SpaceHeatingSummary from "./summary.vue";

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

	describe.skip("Heat sources section", () => {

	
	const heatSource1: HeatSourceData = {
		id: "1b73e247-57c5-26b8-1tbd-83tdkc8c3r8a",
		name: "Heat source 1",
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "combiBoiler",
		productReference: "BOILER_SMALL",
		locationOfBoiler: AdjacentSpaceType.heatedSpace,
	};

		it("displays the heat sources tab", async () => {
			await renderSuspended(SpaceHeatingSummary);
			expect(screen.getByRole("link", { name: "Heat sources" })).not.toBeNull();
		});

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

		it("displays the correct data for the heat sources summary", async () => {
			const store = useEcaasStore();
		  store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatSource1 }],
					},
				},
			});

			await renderSuspended(SpaceHeatingSummary);

			const expectedResult = {
				Name: "Heat source 1",
				"Type of heat source": HeatSourceType.boiler,
        "Type of boiler" : "Combi boiler",
        "Product reference": "BOILER_SMALL",
        "Location of boiler": AdjacentSpaceType.heatedSpace,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pvSystems-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
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
	});

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