import type { Dimension, UnitForDimension } from "./types";
import { asUnit } from "./units";

export type PowerUnit = UnitForDimension<"power">;

export type Power = Dimension<PowerUnit["name"]>;

export const kilowattHour = asUnit("kilowatt-hour");

export const kilowatt = asUnit("kilowatt");

export const kilowattPeak = asUnit("kilowatt peak");

export const watt = asUnit("watt");

export const wattsPerLitrePerSecond = asUnit("watts per litre per second");