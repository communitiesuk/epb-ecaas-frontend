import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export type EmissionUnit = UnitForDimension<"emissions per energy">;

export const co2PerKilowattHour = asUnit("CO2 per kilowatt-hour");
