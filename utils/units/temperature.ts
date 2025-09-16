import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export type TemperatureUnit = UnitForDimension<"temperature">;

export const celsius = asUnit("celsius");
