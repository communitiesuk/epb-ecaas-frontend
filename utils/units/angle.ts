import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export const degrees = asUnit("degrees");

export type AngleUnit = UnitForDimension<"angle">;