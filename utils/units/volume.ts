import type { Dimension, UnitForDimension } from "./types";
import { asUnit } from "./units";

export type VolumeUnit = UnitForDimension<"volume">;

export const litre = asUnit("litres");
export const cubicMetre = asUnit("cubic metres");

export type Volume = Dimension<VolumeUnit["name"]>;

export function asLitres(volume: Volume): number {
	const { amount, unit } = volume;

	if (unit === "cubic metres") {
		const convertedAmount = amount * 1000;
		return convertedAmount;
	}

	return amount;
}