import { getHeatSourceDefaultName, type HeatSourceFormData } from "../utils/getHeatSourceDefaultName";

describe("getHeatSourceDefaultName", () => {
	test("returns only the heat source type when there is no heat source product type", async () => {
		const item: HeatSourceFormData = { 
			id: "123", 
			typeOfHeatSource: "solarThermalSystem",
		};
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Solar thermal system");
	});

	test("returns the heat source product type followed by the heat source type", async () => {
		const item: HeatSourceFormData = {
			id: "123",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryDryCore",
		};

		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Dry core heat battery");
	});

	test("keeps acronyms capitalised", async () => {
		const item: HeatSourceFormData = {
			id: "123",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
		};

		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("PCM heat battery");
	});

	test("handles duplication", async () => {
		const item: HeatSourceFormData = {
			id: "123",
			typeOfHeatSource: "boiler",
			typeOfBoiler: "combiBoiler",
		};
		
		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Combi boiler");
	});

	test("just uses display versions of heat network types", () => {
		const item: HeatSourceFormData = {
			id: "123",
			typeOfHeatSource: "heatNetwork",
			typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		};

		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Sleeved district heat network");
	});

	test("use fallback display version for heat network when type not selected", () => {
		const item: HeatSourceFormData = {
			id: "123",
			typeOfHeatSource: "heatNetwork",
		};

		const actual = getHeatSourceDefaultName(item);

		expect(actual).toBe("Heat network");
	});
});
