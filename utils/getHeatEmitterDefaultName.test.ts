import { describe, it, expect } from "vitest";
import { getHeatEmitterDefaultName } from "./getHeatEmitterDefaultName";

describe("getHeatEmitterDefaultName", () => {
	it('returns "Standard radiator" for the standard radiator subtype', () => {
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "radiator", typeOfRadiator: "standard" })).toBe("Standard radiator");
	});

	it('returns "Towel radiator" for the towel radiator subtype', () => {
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "radiator", typeOfRadiator: "towel" })).toBe("Towel radiator");
	});
	it('returns "Standard radiator" for the standard radiator subtype', () => {
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "radiator", typeOfRadiator: "standard" })).toBe("Standard radiator");
	});
	it("returns the expected display for non-radiator heat emitters", () => {
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "underfloorHeating" })).toBe("Underfloor heating");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "fanCoil" })).toBe("Fan coil");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "warmAirHeater" })).toBe("Warm air heater");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "instantElectricHeater" })).toBe("Instant electric heater");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "electricStorageHeater" })).toBe("Electric storage heater");
	});
});
