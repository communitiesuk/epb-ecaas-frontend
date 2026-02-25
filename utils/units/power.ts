import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export type PowerUnit = UnitForDimension<"power">;

export const kilowattHour = asUnit("kilowatt-hour");

export const kilowatt = asUnit("kilowatt");

export const kilowattPeak = asUnit("kilowatt peak");

export const watt = asUnit("watt");
