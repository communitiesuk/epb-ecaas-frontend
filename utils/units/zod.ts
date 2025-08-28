import * as z from 'zod';
import type { DimensionName, UnitForDimension } from "./types";
import { units } from "./units";

type EnumForStringLiteral<T extends string> = { [K in T]: K };
type ZodObjectForDimension<T extends DimensionName> = z.ZodObject<{ amount: z.ZodNumber, unit: z.ZodEnum<EnumForStringLiteral<UnitForDimension<T>['name']>>}>;

export function zodUnit<T extends DimensionName>(dimension: T): ZodObjectForDimension<T> {
	return z.object({
		amount: z.number(),
		unit: z.enum(units.filter<UnitForDimension<T>>((unit): unit is UnitForDimension<T> => unit.dimension === dimension).map(unit => unit.name))
	});
}