import * as z from "zod";
import type { DimensionName, UnitForDimension } from "./types";
import { units } from "./units";

type EnumForStringLiteral<T extends string> = { [K in T]: K };
type ZodObjectForDimension<T extends DimensionName> = z.ZodObject<{ amount: z.ZodNumber, unit: z.ZodEnum<EnumForStringLiteral<UnitForDimension<T>["name"]>> }>;
type ConstraintsForDimension = {
	min?: number;
	max?: number;
	exclusiveMin?: boolean;
	exclusiveMax?: boolean;
};
export function zodUnit<T extends DimensionName>(dimension: T, constraints: ConstraintsForDimension = {}): ZodObjectForDimension<T> {
	const amount = createAmountSchema(constraints);
	return z.object({
		amount,
		unit: z.enum(units.filter<UnitForDimension<T>>((unit): unit is UnitForDimension<T> => unit.dimension === dimension).map(unit => unit.name)),
	});
}

function createAmountSchema(constraints: ConstraintsForDimension): z.ZodNumber {
	validateConstraints(constraints);
	let amountSchema = z.number();
	if (!constraints) return amountSchema;
	if (constraints.min !== undefined) {
		amountSchema = constraints.exclusiveMin ? amountSchema.gt(constraints.min) : amountSchema.min(constraints.min);
	}
	if (constraints.max !== undefined) {
		amountSchema = constraints.exclusiveMax ? amountSchema.lt(constraints.max) : amountSchema.max(constraints.max);
	}
	return amountSchema;
}

function validateConstraints(constraints: ConstraintsForDimension): void {
	if (constraints.min !== undefined && constraints.max !== undefined) {
		if (constraints.min > constraints.max) {
			throw new Error("Minimum constraint cannot be greater than maximum constraint");
		}
		if (constraints.exclusiveMin && constraints.exclusiveMax && constraints.min === constraints.max) {
			throw new Error("Minimum and maximum cannot be equal when both are exclusive");
		}
	}
}