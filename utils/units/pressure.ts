import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export type PressureUnit = UnitForDimension<"pressure">;

export const pascal = asUnit("pascal");
