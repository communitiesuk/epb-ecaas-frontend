import type { GovTagProps } from "~/common.types";
import { BatteryLocation } from "~/schema/api-schema.types";

describe("getSectionStatus util function" , () => {

	it("should return a 'not started' form status given a section with no status", () => {
		const pvAndBatteries = { pvSystems: { data: [] }, electricBattery: { data: [] } };
		const actual = getSectionStatus(pvAndBatteries);
		const expected: GovTagProps = {
			text: "Not started",
			color: "grey"
		};
		expect(actual).toStrictEqual(expected);
	});

	it("should return an 'in progress' form status given an incomplete section with some data", () => {
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
		const pvAndBatteries = { pvSystems: { data: [] }, electricBattery: { data: [battery], complete: false } };
		const actual = getSectionStatus(pvAndBatteries);
		const expected: GovTagProps = {
			text: "In progress",
			color: "yellow"
		};
		expect(actual).toStrictEqual(expected);
	});

    
	it("should return an 'complete' form status given a section marked as complete", () => {
		
		const pvAndBatteries = { pvSystems: { data: [], complete: true  }, electricBattery: { data: [], complete: true } };
		const actual = getSectionStatus(pvAndBatteries);
		const expected: GovTagProps = {
			text: "Complete",
			color: "green"
		};
		expect(actual).toStrictEqual(expected);
	});
});