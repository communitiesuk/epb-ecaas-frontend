import type { GovTagProps } from "~/common.types";

describe("getSectionStatus util function", () => {

	it("should return a 'not started' form status given a section with no status", () => {
		const pvAndBatteriesSection = { pvArrays: { data: [] }, electricBattery: { data: [] } };

		const actual = getSectionStatus(pvAndBatteriesSection);

		const expected: GovTagProps = {
			text: "Not started",
			color: "grey",
		};
		expect(actual).toStrictEqual(expected);
	});

	it("should return an 'in progress' form status given an incomplete section with some data", () => {
		const battery: ElectricBatteryData = {
			name: "Acme Model II",
			capacity: 10,
			chargeEfficiency: 0.7,
			location: "inside",
			maximumChargeRate: 6.2,
			minimumChargeRate: 4.5,
			maximumDischargeRate: 2.3,
		};
		const pvAndBatteriesSection = { pvArrays: { data: [] }, electricBattery: { data: [battery], complete: false } };

		const actual = getSectionStatus(pvAndBatteriesSection);

		const expected: GovTagProps = {
			text: "In progress",
			color: "yellow",
		};
		expect(actual).toStrictEqual(expected);
	});


	it("should return an 'complete' form status given a pvAndBatteriesSection marked as complete", () => {
		const pvAndBatteriesSection = { pvArrays: { data: [], complete: true }, electricBattery: { data: [], complete: true } };

		const actual = getSectionStatus(pvAndBatteriesSection);

		const expected: GovTagProps = {
			text: "Complete",
			color: "green",
		};
		expect(actual).toStrictEqual(expected);
	});

	it("should return an 'complete' form status given a dwellingDetailsSection marked as complete", () => {
		const dwellingDetailsSection = { generalDetails: { data: {}, complete: true }, shading: { data: [], complete: true }, externalFactors: { data: {}, complete: true } };

		const actual = getSectionStatus(dwellingDetailsSection);

		const expected: GovTagProps = {
			text: "Complete",
			color: "green",
		};
		expect(actual).toStrictEqual(expected);
	});
});