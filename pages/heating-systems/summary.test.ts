import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatingSystemsSummary from "./summary.vue";
import { screen } from "@testing-library/vue";

type expectedData = { [key: string]: string };
const verifyDataInSection = async (
	section: string,
	expectedSectionData: expectedData
) => {
	for (const [key, value] of Object.entries(expectedSectionData)) {
		const lineResult = await screen.findByTestId(
			`summary-${section}-${hyphenate(key)}`
		);
		expect(lineResult.querySelector("dt")?.textContent).toBe(key);
		expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	}
};
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

		it("should display an empty section if no energy supply data has been added", async () => {
			await renderSuspended(HeatingSystemsSummary);
			const expectedEnergySupplyData = {
				"Fuel type": "",
				Exported: "",
				"CO2 per kWh": "",
				"CO2 per kWh (including out of scope)": "",
				"kWh per kWh delivered": "",
			};

			await verifyDataInSection("energySupply", expectedEnergySupplyData);
		});

		it("should display the correct data for energy supply", async () => {
			const store = useEcaasStore();

			const energySupplyData: EnergySupplyData = {
				fuelType: ["wood", "electricity"],
				exported: true,
				co2PerKwh: 1,
				co2PerKwhIncludingOutOfScope: 2,
				kwhPerKwhDelivered: 3,
			};

			store.$patch({
				heatingSystems: {
					energySupply: {
						data: energySupplyData,
					},
				},
			});

			const expectedEnergySupplyData = {
				"Fuel type": "WoodElectricity",
				"Exported": "Yes",
				"CO2 per kWh": "1",
				"CO2 per kWh (including out of scope)": "2",
				"kWh per kWh delivered": "3",
			};
			await renderSuspended(HeatingSystemsSummary);
			await verifyDataInSection("energySupply", expectedEnergySupplyData);
		});
		it("displays an edit link that navigates to the energy supply form page when clicked", async () => {
			await renderSuspended(HeatingSystemsSummary);
			const editLink = screen.getByRole("link", {
				name: "Edit",
			}) as HTMLAnchorElement;
			expect(new URL(editLink.href).pathname).toBe(
				"/heating-systems/energy-supply"
			);
		});
	});
	describe("Heat generation section", () => {
		it("displays 'No heat generation added' and link to add heat generation overview page when no data exists", async () => {
			await renderSuspended(HeatingSystemsSummary);

			expect(screen.getByText("No heat generation added")).not.toBeNull();
			const addHeatGenerationLink = screen.getByRole("link", {
				name: "Add heat generation",
			}) as HTMLAnchorElement;
			expect(new URL(addHeatGenerationLink.href).pathname).toBe(
				getUrl("heatGeneration")
			);
		});
	});
});
