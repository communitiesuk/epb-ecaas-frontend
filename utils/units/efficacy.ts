import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export const lumenPerWatt = asUnit("lumen per watt");

export type EfficacyUnit = UnitForDimension<"efficacy">;