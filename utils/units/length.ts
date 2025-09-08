import type { Dimension, UnitForDimension } from "./types";
import { unit } from "./units";

export type LengthUnit = UnitForDimension<"length">;

export const metre = unit("metres");
export const centimetre = unit("centimetres");
export const millimetre = unit("millimetres");

export type Length = Dimension<LengthUnit["name"]>;

export function asMetres(length: Length): number {
	const { unit, amount } = length;

	if (unit === "centimetres") {
		const convertedAmount = amount * 0.01;
		return convertedAmount;
	}

	if (unit === "millimetres") {
		const convertedAmount = amount * 0.001;
		return convertedAmount;
	}

	return amount;
}