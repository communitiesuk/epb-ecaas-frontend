import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import PVAndElectricBatteriesSummary from "./summary.vue";
import { kilowatt, kilowattHour, kilowattPeak } from "~/utils/units/power";
import { degrees } from "~/utils/units/angle";
import { metre } from "~/utils/units/length";

describe("PV and electric batteries summary page", () => {
	it("displays the correct title", async () => {
		await renderSuspended(PVAndElectricBatteriesSummary);
		expect(screen.getByRole("heading", { name: "PV and electric batteries summary" }));
	});

	describe("PV systems section", () => {

		const pvArray: EcaasForm<PvArrayData> = {
			data: {
				name: "PV Roof",
				peakPower: 3.5,
				ventilationStrategy: "moderately_ventilated",
				pitch: 30,
				orientation: 180,
				elevationalHeight: 10,
				lengthOfPV: 1,
				widthOfPV: 1,
				inverterPeakPowerDC: 3.5,
				inverterPeakPowerAC: 2.4,
				locationOfInverter: "unheated_space",
				canExportToGrid: false,
				electricityPriority: "diverter",
				inverterType: "optimised_inverter",
				hasShading: false,
			},
		};
		const pvArrayWithShading: EcaasForm<PvArrayData> = {
			data: {
				...pvArray.data,
				hasShading: true,
				shading: [
					{ name: "Test 1", typeOfShading: "obstacle", distance: 1, height: 11, transparency: 11 },
					{ name: "Test 2", typeOfShading: "left_side_fin", distance: 2, depth: 22 },
					{ name: "Test 3", typeOfShading: "right_side_fin", distance: 3, depth: 33 },
					{ name: "Test 4", typeOfShading: "overhang", distance: 4, depth: 44 },
					{ name: "Test 5", typeOfShading: "frame_or_reveal", distance: 5, depth: 55 },
				],
			},
		};
		it("displays the pv arrays tab", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
			expect(screen.getByRole("link", { name: "PV arrays" })).not.toBeNull();
		});

		it("displays an empty tab state when no data is present", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);

			expect(screen.getByText("No PV arrays added")).not.toBeNull();

			const addPVArraysLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add PV arrays",
			});

			expect(new URL(addPVArraysLink.href).pathname).toBe(
				getUrl("pvAndBatteries"),
			);
		});

		it("displays the correct data for the pv summary", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [pvArray],
					},
				},
			});

			await renderSuspended(PVAndElectricBatteriesSummary);

			const expectedResult = {
				Name: "PV Roof",
				"Peak power": `3.5 ${kilowattPeak.suffix}`,
				"Ventilation strategy": "Moderately ventilated",
				Pitch: `30 ${degrees.suffix}`,
				Orientation: `180 ${degrees.suffix}`,
				"Elevational height of PV": `10 ${metre.suffix}`,
				"Length of PV": `1 ${metre.suffix}`,
				"Width of PV": `1 ${metre.suffix}`,
				"Inverter peak power AC": `2.4 ${kilowatt.suffix}`,
				"Inverter peak power DC": `3.5 ${kilowatt.suffix}`,
				"Location of inverter": "Unheated space",
				"Inverter type": "Optimised inverter",
				"Can the electricity be exported to the grid": "No",
				"Priority for generated electricity": "Diverter",
				"Does anything shade the PV array?": "No",
			};
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pvArrays-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
		it("displays the correct data for PV array when shading is added", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					pvArrays: {
						data: [pvArrayWithShading],
					},
				},
			});
			const baseExpected = {
				Name: "PV Roof",
				"Peak power": `3.5 ${kilowattPeak.suffix}`,
				"Ventilation strategy": "Moderately ventilated",
				Pitch: `30 ${degrees.suffix}`,
				Orientation: `180 ${degrees.suffix}`,
				"Elevational height of PV": `10 ${metre.suffix}`,
				"Length of PV": `1 ${metre.suffix}`,
				"Width of PV": `1 ${metre.suffix}`,
				"Inverter peak power AC": `2.4 ${kilowatt.suffix}`,
				"Inverter peak power DC": `3.5 ${kilowatt.suffix}`,
				"Location of inverter": "Unheated space",
				"Inverter type": "Optimised inverter",
				"Can the electricity be exported to the grid": "No",
				"Priority for generated electricity": "Diverter",
				"Does anything shade the PV array?": "Yes",
			};
			const shading1Expected = {
				"Name of shading 1": "Test 1",
				"Type of shading 1": "Obstacle",
				"Distance of shading 1 from edge of PV": `1 ${metre.suffix}`,
				"Height of shading 1": `11 ${metre.suffix}`,
				"Transparency of shading 1": "11",
			};
			const shading2Expected = {
				"Name of shading 2": "Test 2",
				"Type of shading 2": "Left side fin",
				"Distance of shading 2 from edge of PV": `2 ${metre.suffix}`,
				"Depth of shading 2": `22 ${metre.suffix}`,
			};
			const shading3Expected = {
				"Name of shading 3": "Test 3",
				"Type of shading 3": "Right side fin",
				"Distance of shading 3 from edge of PV": `3 ${metre.suffix}`,
				"Depth of shading 3": `33 ${metre.suffix}`,
			};
			const shading4Expected = {
				"Name of shading 4": "Test 4",
				"Type of shading 4": "Overhang",
				"Distance of shading 4 from edge of PV": `4 ${metre.suffix}`,
				"Depth of shading 4": `44 ${metre.suffix}`,
			};
			const shading5Expected = {
				"Name of shading 5": "Test 5",
				"Type of shading 5": "Frame or reveal",
				"Distance of shading 5 from edge of PV": `5 ${metre.suffix}`,
				"Depth of shading 5": `55 ${metre.suffix}`,
			};
			await renderSuspended(PVAndElectricBatteriesSummary);

			for (const [key, value] of Object.entries({
				...baseExpected,
				...shading1Expected,
				...shading2Expected,
				...shading3Expected,
				...shading4Expected,
				...shading5Expected,
			})) {
				const lineResult = (await screen.findByTestId(`summary-pvArrays-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}


		});
	});
	describe("Electric battery section", () => {
		const battery: EcaasForm<ElectricBatteryData> = {
			data: {
				name: "Acme Model II",
				capacity: 10,
				chargeEfficiency: 0.7,
				location: "inside",
				maximumChargeRate: 6.2,
				minimumChargeRate: 4.5,
				maximumDischargeRate: 2.3,
			},
		};

		it("displays the battery tab", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
			expect(screen.getByRole("link", { name: "Electric batteries" })).not.toBeNull();
		});

		it("displays an empty tab state when no data is present", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);

			expect(screen.getByText("No electric batteries added")).not.toBeNull();

			const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add electric battery",
			});

			expect(new URL(addPVSystemsLink.href).pathname).toBe(
				getUrl("pvAndBatteries"),
			);
		});

		it("displays the correct data for the electric battery summary", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [battery],
					},
				},
			});

			await renderSuspended(PVAndElectricBatteriesSummary);

			const expectedResult = {
				Name: "Acme Model II",
				Capacity: `10 ${kilowattHour.suffix}`,
				"Charge efficiency": "0.7",
				Location: "Inside",
				"Maximum charge rate": `6.2 ${kilowatt.suffix}`,
				"Minimum charge rate": `4.5 ${kilowatt.suffix}`,
				"Maximum discharge rate": `2.3 ${kilowatt.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricBattery-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});

describe("Diverters section", () => {

	it("displays the diverter tab", async () => {
		await renderSuspended(PVAndElectricBatteriesSummary);
		expect(screen.getByRole("link", { name: "Diverters" })).not.toBeNull();
	});

	it("displays an empty tab state when no data is present", async () => {
		await renderSuspended(PVAndElectricBatteriesSummary);

		expect(screen.getByText("No diverters added")).not.toBeNull();

		const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
			name: "Add diverter",
		});

		expect(new URL(addPVSystemsLink.href).pathname).toBe(
			getUrl("pvAndBatteries"),
		);
	});

	it("displays the correct data for the diverters summary", async () => {
		const store = useEcaasStore();

		const hotWaterCylinderName = "HWC1";
		const hotWaterCylinderId = "88ea3f45-6f2a-40e2-9117-0541bd8a97f3";
		const heatPumpName = "HP1";
		const heatPumpId = "56ddc6ce-7a91-4263-b051-96c7216bb01e";
		const dhwHeatPumpId = "56ddc6ce-7a91-4263-b051-96c7216b1234";

		const diverter: EcaasForm<PvDiverterData> = {
			data: {
				name: "Diverter 1",
				hotWaterCylinder: hotWaterCylinderId,
			},
		};

		store.$patch({
			spaceHeating: {
				heatSource: {
					data: [{
						data: {
							name: heatPumpName,
							id: heatPumpId,
							productReference: "HEATPUMP-SMALL",
						},
					}],
				},

			},
			domesticHotWater: {
				heatSources: {
					data: [{
						data: {
							id: dhwHeatPumpId,
							isExistingHeatSource: true,
							heatSourceId: heatPumpId,
							coldWaterSource: "mainsWater",
						},
					}],
				},
				waterStorage: {
					data: [{
						data: {
							name: hotWaterCylinderName,
							id: hotWaterCylinderId,
							dhwHeatSourceId: dhwHeatPumpId,
							storageCylinderVolume: {
								amount: 1,
								unit: "litres",
							},
							dailyEnergyLoss: 1,
							typeOfWaterStorage: "hotWaterCylinder",
						},
					}],
				},
			},
			pvAndBatteries: {
				diverters: {
					data: [diverter],
				},
			},
		});

		await renderSuspended(PVAndElectricBatteriesSummary);

		const expectedResult = {
			"Name": "Diverter 1",
			"Associated hot water cylinder": hotWaterCylinderName,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = await screen.findByTestId(`summary-diverters-${hyphenate(key)}`);
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});
