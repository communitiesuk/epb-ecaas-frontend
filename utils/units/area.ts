import type { Dimension, UnitForDimension } from "./types";
import { asUnit } from "./units";

export type AreaUnit = UnitForDimension<"area">;

export const metresSquare = asUnit("metres square");
export const centimetresSquare = asUnit("centimetres square");
export const millimetresSquare = asUnit("millimetres square");

export const millimetresSquarePerMetre = asUnit("millimetres square per metre");

export type Area = Dimension<AreaUnit["name"]>;

export function asCentimetresSquare(area: Area): number {
	const { unit, amount } = area;

	if (unit === "metres square") {
		return amount * 10000;
	}

	if (unit === "millimetres square") {
		return amount / 100;
	}

	return amount;
}