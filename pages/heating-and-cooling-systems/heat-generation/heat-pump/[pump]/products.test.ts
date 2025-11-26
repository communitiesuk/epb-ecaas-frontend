import { renderSuspended } from "@nuxt/test-utils/runtime";
import Products from "../[pump]/[products].vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

describe("Heat pumps products page", () => {
  const store = useEcaasStore();
  const user = userEvent.setup();
  const { mockFetch, mockRoute } = vi.hoisted(() => ({
    mockFetch: vi.fn(),
    mockRoute: vi.fn(),
  }));

  mockNuxtImport("useFetch", () => mockFetch);
  mockNuxtImport("useRoute", () => mockRoute);

  afterEach(() => {
    mockFetch.mockReset();
    mockRoute.mockReset();
  });

  const MOCKED_HEAT_PUMPS = [
    {
      reference: "HEATPUMP-SMALL",
      product: {
        brandName: "Test",
        firstYearOfManufacture: 2023,
        modelName: "Small Heat Pump",
        modelQualifier: "HPSMALL",
        technologyType: "Air Source Heat Pump",
      },
    },
    {
      reference: "HEATPUMP-MEDIUM",
      product: {
        brandName: "Test",
        firstYearOfManufacture: 2023,
        modelName: "Medium Heat Pump",
        modelQualifier: "HPMEDIUM",
        technologyType: "Air Source Heat Pump",
      },
    },
    {
      reference: "HEATPUMP-LARGE",
      product: {
        brandName: "Test",
        firstYearOfManufacture: 2023,
        modelName: "Large Heat Pump",
        modelQualifier: "HPLARGE",
        technologyType: "Air Source Heat Pump",
      },
    },
  ];
  beforeEach(() => {
    mockFetch.mockReturnValue({
      data: ref(MOCKED_HEAT_PUMPS),
    });
  });

  const heatPump1: Partial<HeatPumpData> = {
    id: "463c94f6-566c-49b2-af27-222222222",
    name: "Heat pump small",
    typeOfHeatPump: "airSource",
  };
  const heatPump2: Partial<HeatPumpData> = {
    id: "463c94f6-566c-49b2-af27-111111111",
    name: "Heat pump large",
    typeOfHeatPump: "airSource",
  };

  beforeEach(async () => {
    store.$patch({
      heatingAndCoolingSystems: {
        heatGeneration: {
          heatPump: {
            data: [{ data: heatPump2 }, { data: heatPump1 }],
          },
        },
      },
    });
  });

  afterEach(async () => {
    store.$reset();
  });

  test("title dependant on the type of heat pump", async () => {
    mockRoute.mockReturnValue({
      params: {
        pump: "0",
        products: "air-source-products",
      },
      path: "/0/air-source-products",
    });
    await renderSuspended(Products);

    expect(
      screen.getByRole("heading", { name: "Select an air source heat pump" })
    );

    mockRoute.mockReturnValue({
      params: {
        pump: "0",
        products: "exhaust-air-mvhr-products",
      },
      path: "/0/exhaust-air-mvhr-products",
    });
    await renderSuspended(Products);
    expect(
      screen.getByRole("heading", {
        name: "Select an exhaust air MVHR heat pump",
      })
    );
  });

  test("displays flow temperature column for heat pumps and boilers", async () => {
    mockRoute.mockReturnValue({
      params: {
        pump: "0",
        products: "air-source-products",
      },
      path: "/0/air-source-products",
    });
    await renderSuspended(Products);
    const flowTempHeader = screen.queryByText("Flow temp", { selector: "th" });
    expect(flowTempHeader).not.toBeNull();
    //TODO add test for boilers
  });

  test("when a user selects a product its product reference gets stored", async () => {
    mockRoute.mockReturnValue({
      params: {
        pump: "1",
        products: "air-source-products",
      },
      path: "/1/air-source-products",
    });
    await renderSuspended(Products);

    await user.click(screen.getByTestId("selectProductButton_1"));
    expect(
      store.heatingAndCoolingSystems.heatGeneration.heatPump.data[1]!.data
        .productReference
    ).toBe(MOCKED_HEAT_PUMPS[1]?.reference);
  });

  test("'Back to heat pump' navigates user to the heat pump at the correct index", async () => {
    mockRoute.mockReturnValue({
      params: {
        pump: "1",
        products: "air-source-products",
      },
      path: "/1/air-source-products",
    });
    await renderSuspended(Products);
    const backButton = screen.getByTestId("backToHeatPumpButton");
    expect(backButton.getAttribute("href")).toBe(
      "/heating-and-cooling-systems/heat-generation/heat-pump/1"
    );
  });
});
