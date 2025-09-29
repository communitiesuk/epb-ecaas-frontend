import { litre } from "~/utils/units/volume";

describe("removeTaggedItemReferences", () => {
  const store = useEcaasStore();

  beforeEach(() => {
    store.$reset();
  });
  
	const heatPump1: HeatPumpData = {
		id: "463c94f6-566c-49b2-af27-57e5c111111",
		name: "Heat pump 1",
		productReference: "HEATPUMP-SMALL",
	};
  const heatPump2: HeatPumpData = {
		id: "463c94f6-566c-49b2-af27-57e222222",
		name: "Heat pump 2",
		productReference: "HEATPUMP-SMALL",
	};

  const cylinder1: HotWaterCylinderData = {
    id: "cylinder1 Id",
    name: "Hot water cylinder 1",
    heatSource: heatPump1.id,
    storageCylinderVolume: unitValue(150, litre),
    dailyEnergyLoss: 73,
  };

  const cylinder2: HotWaterCylinderData = {
    id: "cylinder2 Id",
    name: "Hot water cylinder 2",
    heatSource: heatPump2.id,
    storageCylinderVolume: unitValue(130, litre),
    dailyEnergyLoss: 71,
  };

 const cylinder3: HotWaterCylinderData = {
    id: "cylinder3 Id",
    name: "Hot water cylinder 3",
    heatSource: heatPump1.id,
    storageCylinderVolume: unitValue(120, litre),
    dailyEnergyLoss: 70,
  };


  test("updates store when a tagged item is removed and it is referenced by another item", () => {
    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [
              { data: cylinder1, complete: true },
              { data: cylinder2, complete: true },
              { data: cylinder3, complete: true},
            ],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders = store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReferences(hotwaterCylinders, heatPump1.id, "heatSource");

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.data[0]?.complete).toBe(false);

    expect(hotwaterCylinders.data[1]?.data.heatSource).toBe(heatPump2.id);
    expect(hotwaterCylinders.data[1]?.complete).toBe(true);

    expect(hotwaterCylinders.data[2]?.data.heatSource).toBeUndefined();
    expect(hotwaterCylinders.data[2]?.complete).toBe(false);

    expect(hotwaterCylinders.complete).toBe(false);
  });

  test("does not update store when a tagged item is removed that is not referenced by another item", () => {
    const heatPumpId = "463c94f6-566c-49b2-af27-57e5c9999999"
    store.$patch({
      domesticHotWater: {
        waterHeating: {
          hotWaterCylinder: {
            data: [{ data: { ...cylinder1, heatSource: heatPumpId }, complete: true}],
            complete: true,
          },
        },
      },
    });
    const hotwaterCylinders =
      store.domesticHotWater.waterHeating.hotWaterCylinder;
    removeTaggedItemReferences(
      hotwaterCylinders,
      heatPump1.id,
      "heatSource"
    );

    expect(hotwaterCylinders.data[0]?.data.heatSource).toBe(heatPumpId);
    expect(hotwaterCylinders.data[0]?.complete).toBe(true);
    
    expect(hotwaterCylinders.complete).toBe(true);
  });
});
