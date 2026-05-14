import * as z from "zod";
import type { DimensionName, UnitForDimension } from "./types";
import { units } from "./units";

type EnumForStringLiteral<T extends string> = { [K in T]: K };
type ZodObjectForDimension<T extends DimensionName> = z.ZodObject<{ amount: z.ZodNumber, unit: z.ZodEnum<EnumForStringLiteral<UnitForDimension<T>["name"]>> }>;
export type ConstraintsForDimension = {
	min?: number;
	max?: number;
	gt?: number;
	lt?: number;
};
export function zodUnit<T extends DimensionName>(dimension: T): ZodObjectForDimension<T> {
	const amount = createAmountSchema();
	return z.object({
		amount,
		unit: z.enum(units.filter<UnitForDimension<T>>((unit): unit is UnitForDimension<T> => unit.dimension === dimension).map(unit => unit.name)),
	});
}

export function addConstraints<T extends DimensionName>(schema: ZodObjectForDimension<T>, constraints: ConstraintsForDimension = {}): ZodObjectForDimension<T> {
	validateConstraints(constraints);
	const amount = createAmountSchema(constraints, schema.shape.amount);
	return schema.extend({ amount }) as ZodObjectForDimension<T>;
}

function createAmountSchema(constraints: ConstraintsForDimension = {}, baseSchema: z.ZodNumber = z.number()): z.ZodNumber {
	let amountSchema = baseSchema;
	if (!constraints) return amountSchema;
	if (constraints.min !== undefined) {
		amountSchema = amountSchema.min(constraints.min);
	}
	if (constraints.max !== undefined) {
		amountSchema = amountSchema.max(constraints.max);
	}
	if (constraints.gt !== undefined) {
		amountSchema = amountSchema.gt(constraints.gt);
	}
	if (constraints.lt !== undefined) {
		amountSchema = amountSchema.lt(constraints.lt);
	}
	return amountSchema;
}

function validateConstraints(constraints: ConstraintsForDimension): void {
	if (constraints.min !== undefined && constraints.gt !== undefined) {
		throw new Error("Cannot set both min and gt constraints");
	}
	if (constraints.max !== undefined && constraints.lt !== undefined) {
		throw new Error("Cannot set both max and lt constraints");
	}

	if (constraints.min !== undefined && constraints.max !== undefined) {
		if (constraints.min > constraints.max) {
			throw new Error("Minimum constraint cannot be greater than maximum constraint");
		}
	}

	if (constraints.gt !== undefined && constraints.lt !== undefined && constraints.gt >= constraints.lt) {
		throw new Error("gt constraint cannot be greater than or equal to lt constraint");
	}

	if (constraints.min !== undefined && constraints.lt !== undefined && constraints.min >= constraints.lt) {
		throw new Error("min constraint cannot be greater than or equal to lt constraint");
	}

	if (constraints.gt !== undefined && constraints.max !== undefined && constraints.gt >= constraints.max) {
		throw new Error("gt constraint cannot be greater than or equal to max constraint");
	}
}