import { getHeatSourceDefaultName } from "../utils/getHeatSourceDefaultName";

describe("getHeatSourceDefaultName", () => {
	test("returns only the heat source type when there is no heat source product type", async () => {
		const item = { typeOfHeatSource: HeatSourceType.solarThermalSystem };
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Solar thermal system");
	});

	test("returns the heat source product type followed by the heat source type", async () => {
		const item = {
			typeOfHeatSource: HeatSourceType.heatBattery,
			typeOfHeatBattery: "dryCore",
		};
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Dry core heat battery");
	});

	test.skip("keeps acronyms capitalised", async () => {
		const item = {
			typeOfHeatSource: HeatSourceType.heatBattery,
			typeOfHeatBattery: "pcm",
		};
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("PCM heat battery");
	});

	test("handles duplication", async () => {
		const item = {
			typeOfHeatSource: HeatSourceType.boiler,
			typeOfBoiler: "combiBoiler",
		};
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Combi boiler");
	});
});
