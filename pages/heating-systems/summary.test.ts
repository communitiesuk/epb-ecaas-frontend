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
        Exported: "Yes",
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
    const heatPump: HeatPumpData = {
      id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      name: "Heat pump",
    };
    const boiler: BoilerData = {
      id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      name: "Boiler",
    };
    const heatBattery: HeatBatteryData = {
      id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      name: "Heat battery",
    };
    const heatNetwork: HeatNetworkData = {
      id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      name: "Heat network",
    };
    const heatInterfaceUnit: HeatInterfaceUnitData = {
      id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      name: "Heat interface unit",
    };

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

    it("displays tabs only for the heat generation types that have data", async () => {
      const store = useEcaasStore();

      store.$patch({
        heatingSystems: {
          heatGeneration: {
            heatPump: {
              data: [heatPump],
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
      expect(screen.getByRole("link", { name: "Boiler" })).not.toBeNull();
      expect(screen.getByRole("link", { name: "Heat battery" })).not.toBeNull();
      expect(screen.getByRole("link", { name: "Heat network" })).not.toBeNull();
      expect(
        screen.getByRole("link", { name: "Heat interface unit" })
      ).not.toBeNull();
    });

    it("displays the correct data for the heat pump section", async () => {
      const store = useEcaasStore();

      store.$patch({
        heatingSystems: {
          heatGeneration: {
            heatPump: {
              data: [heatPump],
            },
          },
        },
      });
      await renderSuspended(HeatingSystemsSummary);

      const lineResult = await screen.findByTestId("summary-heatPump-name");

      expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
      expect(lineResult.querySelector("dd")?.textContent).toBe("Heat pump");
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

      const lineResult = await screen.findByTestId("summary-boiler-name");

      expect(lineResult.querySelector("dt")?.textContent).toBe("Name");
      expect(lineResult.querySelector("dd")?.textContent).toBe("Boiler");
    });
  });
});
