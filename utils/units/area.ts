import type { UnitForDimension } from "./types";
import { asUnit } from "./units";

export type AreaUnit = UnitForDimension<"area">;

export const metresSquare = asUnit("metres square");
export const centimetresSquare = asUnit("centimetres square");
export const millimetresSquare = asUnit("millimetres square");

export const millimetresSquarePerMetre = asUnit("millimetres square per metre");

export function asCentimetresSquare(area: number): number {
	return area / 100;
}