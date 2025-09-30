import { litre } from "~/utils/units/volume";

describe("removeTaggedItemReferences", () => {
  const store = useEcaasStore();
  let heatPump1: HeatPumpData;
  let heatPump2: HeatPumpData;
  let cylinder1: HotWaterCylinderData;
  let cylinder2: HotWaterCylinderData;
  let cylinder3: HotWaterCylinderData;

  beforeEach(() => {
    store.$reset();

    heatPump1 = {
      id: "463c94f6-566c-49b2-af27-57e5c111111",
      name: "Heat pump 1",
      productReference: "HEATPUMP-SMALL",
    };

    heatPump2 = {
      id: "463c94f6-566c-49b2-af27-57e222222",
      name: "Heat pump 2",
      productReference: "HEATPUMP-SMALL",
    };

    cylinder1 = {
      id: "cylinder1 Id",
      name: "Hot water cylinder 1",
      heatSource: heatPump1.id,
      storageCylinderVolume: unitValue(150, litre),
      dailyEnergyLoss: 73,
    };

    cylinder2 = {
      ...cylinder1,
      id: "cylinder2 Id",
      name: "Hot water cylinder 2",
      heatSource: heatPump2.id,
    };

    cylinder3 = {
      ...cylinder1,
      id: "cylinder3 Id",
      name: "Hot water cylinder 3",
    };
  });

  test("updates store when item id is referenced", () => {
    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [
              { data: cylinder1, complete: true },
              { data: cylinder2, complete: true },
              { data: cylinder3, complete: true },
            ],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReferences(hotwaterCylinders, heatPump1.id, "heatSource");

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.data[0]?.complete).toBe(false);

    expect(hotwaterCylinders.data[1]?.data.heatSource).toBe(heatPump2.id);
    expect(hotwaterCylinders.data[1]?.complete).toBe(true);

    expect(hotwaterCylinders.data[2]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.data[2]?.complete).toBe(false);

    expect(hotwaterCylinders.complete).toBe(false);
  });

  test("does not update store when item id is not referenced", () => {
    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [{ data: cylinder1, complete: true }],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReferences(hotwaterCylinders, "random-id", "heatSource");

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBe(heatPump1.id);
    expect(hotwaterCylinders.data[0]?.complete).toBe(true);

    expect(hotwaterCylinders.complete).toBe(true);
  });

  test("does not update store when item id is not defined", () => {
    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [{ data: cylinder1, complete: true }],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReferences(hotwaterCylinders, undefined, "heatSource");

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBe(heatPump1.id);
    expect(hotwaterCylinders.data[0]?.complete).toBe(true);

    expect(hotwaterCylinders.complete).toBe(true);
  });
});
