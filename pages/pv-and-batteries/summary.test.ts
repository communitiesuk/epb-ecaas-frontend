import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import PVAndElectricBatteriesSummary from "./summary.vue";
import { BatteryLocation, InverterType, OnSiteGenerationVentilationStrategy } from "~/schema/api-schema.types";
import { kilowatt, kilowattHour, kilowattPeak } from "~/utils/units/power";
import { degrees } from "~/utils/units/angle";
import { metre } from "~/utils/units/length";

describe("PV and electric batteries summary page", () => {
	it("displays the correct title", async () => {
		await renderSuspended(PVAndElectricBatteriesSummary);
		expect(screen.getByRole("heading", { name: "PV and electric batteries summary" }));
	});

	describe("PV systems section", () => {

		const pvSystem: PvSystemData = {
			name: "PV Roof",
			peakPower: 3.5,
			ventilationStrategy: OnSiteGenerationVentilationStrategy.moderately_ventilated,
			pitch: 30,
			orientation: 180,
			elevationalHeight:10,
			lengthOfPV:1,
			widthOfPV:1,
			inverterPeakPowerDC: 3.5,
			inverterPeakPowerAC: 2.4,
			inverterIsInside: false,
			inverterType: InverterType.optimised_inverter,
		};
		
		it("displays the pv systems tab", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
			expect(
				screen.getByRole("link", { name: "PV systems" })
			).not.toBeNull();
		});

		it("displays an empty tab state when no pv system data is present", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
        
			expect(screen.getByText("No PV systems added")).not.toBeNull();
            
			const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add PV systems",
			});

			expect(new URL(addPVSystemsLink.href).pathname).toBe(
				getUrl("pvAndBatteries")
			);
		});

		it("displays the correct data for the pv summary", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data: [pvSystem]
					}
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
		const battery: ElectricBatteryData = {
			name: "Acme Model II",
			capacity: 10,
			batteryAge: 2,
			chargeEfficiency: 0.7,
			location: BatteryLocation.inside,
			gridChargingPossible: false,
			maximumChargeRate: 6.2,
			minimumChargeRate: 4.5,
			maximumDischargeRate: 2.3,
		};
		
		it("displays the battery tab", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
			expect(
				screen.getByRole("link", { name: "Electric battery" })
			).not.toBeNull();
		});

		it("displays an empty tab state when no data is present", async () => {
			await renderSuspended(PVAndElectricBatteriesSummary);
        
			expect(screen.getByText("No electric battery added")).not.toBeNull();
            
			const addPVSystemsLink: HTMLAnchorElement = screen.getByRole("link", {
				name: "Add electric battery",
			});

			expect(new URL(addPVSystemsLink.href).pathname).toBe(
				getUrl("pvAndBatteries")
			);
		});

		it("displays the correct data for the pv summary", async () => {
			const store = useEcaasStore();
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [battery]
					}
				},
			});

			await renderSuspended(PVAndElectricBatteriesSummary);

			const expectedResult = {
				Name: "Acme Model II",
				Capacity: `10 ${kilowattHour.suffix}`,
				"Battery age": "2 years",
				"Charge efficiency": "0.7",
				Location: "Inside",
				"Grid charging possible" : "No",
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