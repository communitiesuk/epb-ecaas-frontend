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

		const pvSystem: EcaasForm<PvSystemData> = {
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
				inverterIsInside: false,
				inverterType: "optimised_inverter",
			},
		};
		
		it("displays the pv systems tab", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
			expect(screen.getByRole("link", { name: "PV systems" })).not.toBeNull();
		});

		it("displays an empty tab state when no data is present", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
        
			expect(screen.getByText("No PV systems added")).not.toBeNull();
            
			const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add PV systems",
			});

			expect(new URL(addPVSystemsLink.href).pathname).toBe(
				getUrl("pvAndBatteries"),
			);
		});

		it("displays the correct data for the pv summary", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data: [pvSystem],
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
				"Inverter is inside": "No",
				"Inverter type": "Optimised inverter",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pvSystems-${hyphenate(key)}`));
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
				gridChargingPossible: false,
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
				"Grid charging possible": "No",
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

			const diverter: EcaasForm<PvDiverterData> = {
				data: {
					name: "Diverter 1",
					hotWaterCylinder: hotWaterCylinderId,
					heatSource: heatPumpId,
				},
			};

			store.$patch({
				heatingAndCoolingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{
								data: {
									name: heatPumpName,
									id: heatPumpId,
									productReference: "HEATPUMP-SMALL",
								},
							}],
						},
					},
				},
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data: [{
								data: {
									name: hotWaterCylinderName,
									id: hotWaterCylinderId,
									heatSource: heatPumpId,
									storageCylinderVolume: {
										amount: 1,
										unit: "litres",
									},
									dailyEnergyLoss: 1,
								},
							}],
						},
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
				"Associated heat source": heatPumpName,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = await screen.findByTestId(`summary-diverters-${hyphenate(key)}`);
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});