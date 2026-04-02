import { describe, it, expect } from "vitest";
import { getHeatEmitterDefaultName } from "./getHeatEmitterDefaultName";

describe("getHeatEmitterDefaultName", () => {
	it("returns the expected display for non-radiator heat emitters", () => {
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "wetDistributionSystem" })).toBe("Wet distribution system");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "warmAirHeater" })).toBe("Warm air heater");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "instantElectricHeater" })).toBe("Instant electric heater");
		expect(getHeatEmitterDefaultName({ typeOfHeatEmitter: "electricStorageHeater" })).toBe("Electric storage heater");
	});
});
