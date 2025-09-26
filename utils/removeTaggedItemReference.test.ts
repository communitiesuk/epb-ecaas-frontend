import { litre } from "~/utils/units/volume";

describe("removeTaggedItemReference", () => {
  const store = useEcaasStore();

  beforeEach(() => {
    store.$reset();
  });

  const cylinder: HotWaterCylinderData = {
    id: "Any Id",
    name: "Hot water cylinder 1",
    heatSource: "",
    storageCylinderVolume: unitValue(150, litre),
    dailyEnergyLoss: 73,
  };

  test("removes heat source id referenced in store", () => {
    const heatPumpIdToRemove = "test-id";

    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [{ data: { ...cylinder, heatSource: heatPumpIdToRemove } }],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReference(
      hotwaterCylinders,
      heatPumpIdToRemove,
      "heatSource"
    );

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.complete).toBe(false);
  });

  test("removes heat source id referenced in store on the correct stored item", () => {
    const heatPumpIdToRemove = "test-id-2";

    const cylinder2: HotWaterCylinderData = {
      ...cylinder,
      name: "Hot water cylinder 2",
      heatSource: heatPumpIdToRemove,
    };

    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [
              { data: { ...cylinder, heatSource: "test-id-1" } },
              { data: { ...cylinder2, heatSource: heatPumpIdToRemove } },
            ],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReference(
      hotwaterCylinders,
      heatPumpIdToRemove,
      "heatSource"
    );

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBe("test-id-1");
    expect(hotwaterCylinders.data[1]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.complete).toBe(false);
  });

  test("does not update store if heat pump id is not referenced", () => {
    const heatPumpIdToRemove = "test-id";

    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [{ data: { ...cylinder, heatSource: "test-id-1" } }],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReference(
      hotwaterCylinders,
      heatPumpIdToRemove,
      "heatSource"
    );

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBe("test-id-1");
    expect(hotwaterCylinders.complete).toBe(true);
  });
});
