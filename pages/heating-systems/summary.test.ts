import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatingSystemsSummary from "./summary.vue";
import { screen } from "@testing-library/vue";

describe("Heating systems summary page", () => {
	it("should display the correct title", async () => {
		await renderSuspended(HeatingSystemsSummary);
		expect(screen.getByRole("heading", { name: "Heating system summary" }));
	});

	describe("Energy supply section", () => {

		it("should display the correct tabs for energy supply", async () => {
			await renderSuspended(HeatingSystemsSummary);
			expect(
				screen.getByRole("link", { name: "Energy supply" })
			).not.toBeNull();
		});

		it("should display and empty section if no energy supply data has been added", async () => {
			await renderSuspended(HeatingSystemsSummary);
			const expectedEnergySupplyData = {
				"Fuel type": "",
				"Exported": "",
				"CO2 per kWh": "",
				"CO2 per kWh (including out of scope)": "",
				"kWh per kWh delivered": ""
			};

			for(const [key, value] of Object.entries(expectedEnergySupplyData)){
				const lineResult = await screen.findByTestId(`summary-energySupply-${hyphenate(key)}`);
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for energy supply", async () => {
			const store = useEcaasStore();

			const energySupplyData: EnergySupplyData = {
				fuelType: ["wood", "electricity"],
				exported: "yes",
				co2PerKwh: 1,
				co2PerKwhIncludingOutOfScope: 2,
				kwhPerKwhDelivered: 3
			};
      
			store.$patch({
				heatingSystems: {
					energySupply: {
						data: energySupplyData
					},
				},
			});

			const expectedEnergySupplyData = {
				"Fuel type": "WoodElectricity",
				"Exported": "Yes",
				"CO2 per kWh": "1",
				"CO2 per kWh (including out of scope)": "2",
				"kWh per kWh delivered": "3"
			};
			await renderSuspended(HeatingSystemsSummary);
			for(const [key, value] of Object.entries(expectedEnergySupplyData)){
				const lineResult = await screen.findByTestId(`summary-energySupply-${hyphenate(key)}`);
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});
