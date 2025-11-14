import { fullMassDistributionClass } from "./massDistributionClass";

describe("full mass distribution class function", () => {
	it("should return the correct full representation of a mass distribution class when given a concise one", () => {
		expect(fullMassDistributionClass("IE")).toStrictEqual("IE: Mass divided over internal and external side");
	});
});