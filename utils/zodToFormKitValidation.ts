import * as z from "zod";

type SchemaWithDef<T extends string, U = unknown> = { _def: Record<T, U> };

function unwrap(schema: z.ZodType): z.ZodType {
	// unwrap effects/defaults/nullable/optional so we can inspect the inner schema
	// handle unions that include undefined by returning the non-undefined option (if any)
	if (schema instanceof z.ZodDefault && (schema as unknown as SchemaWithDef<"innerType">)._def?.innerType) {
		return unwrap((schema as unknown as SchemaWithDef<"innerType", z.ZodType>)._def.innerType);
	}
	if (schema instanceof z.ZodNullable && (schema as unknown as SchemaWithDef<"innerType">)._def?.innerType) {
		return unwrap((schema as unknown as SchemaWithDef<"innerType", z.ZodType>)._def.innerType);
	}
	if (schema instanceof z.ZodOptional && (schema as unknown as SchemaWithDef<"innerType">)._def?.innerType) {
		return unwrap((schema as unknown as SchemaWithDef<"innerType", z.ZodType>)._def.innerType);
	}
	if (schema instanceof z.ZodUnion) {
		const opts = (schema as unknown as SchemaWithDef<"options">)._def.options as z.ZodTypeAny[];
		// if union contains undefined/optional pick the first non-undefined option to inspect
		const nonUndef = opts.find(o => !(o instanceof z.ZodUndefined));
		return nonUndef ? unwrap(nonUndef) : schema;
	}
	return schema;
}

function isOptional(schema: z.ZodTypeAny): boolean {
	if (schema instanceof z.ZodOptional) return true;
	if (schema instanceof z.ZodDefault) return true;
	if (schema instanceof z.ZodNullable) return true;
	if (schema instanceof z.ZodUnion) {
		return (schema as unknown as SchemaWithDef<"options", Array<z.ZodType>>)._def.options.some((opt: z.ZodType) =>
			opt instanceof z.ZodUndefined || isOptional(opt),
		);
	}
	return false;
}

const smallFraction = 0.00001;

export function zodTypeAsFormKitValidation(schema: z.ZodTypeAny): string {
	const rules: string[] = [];

	if (!isOptional(schema)) rules.push("required");

	const s = unwrap(schema);

	if (s instanceof z.ZodString) {
		const checks = (s as unknown as SchemaWithDef<"checks">)._def.checks as Array<{ kind: string, value: string, regex: RegExp }> | undefined;
		if (checks) {
			for (const c of checks) {
				switch (c.kind) {
					case "min":
						rules.push(`min:${c.value}`);
						break;
					case "max":
						rules.push(`max:${c.value}`);
						break;
					case "length":
						rules.push(`length:${c.value}`);
						break;
				}
			}
		}
	} else if (s instanceof z.ZodNumber) {
		rules.push("number");
		const { minimum, exclusiveMinimum, maximum, exclusiveMaximum } = s._zod.bag;
		if (typeof minimum !== "undefined") {
			rules.push(`min:${minimum}`);
		}
		if (typeof exclusiveMinimum !== "undefined") {
			rules.push(`min:${exclusiveMinimum + smallFraction}`);
		}
		if (typeof maximum !== "undefined") {
			rules.push(`max:${maximum}`);
		}
		if (typeof exclusiveMaximum !== "undefined") {
			rules.push(`max:${exclusiveMaximum - smallFraction}`);
		}
	} else if (s instanceof z.ZodEnum) {
		const vals = s instanceof z.ZodEnum ? (s as unknown as SchemaWithDef<"values", ArrayLike<unknown>>)._def.values as string[] : Object.values((s as unknown as SchemaWithDef<"values", ArrayLike<unknown>>)._def.values);
		if (Array.isArray(vals) && vals.length) {
			rules.push(`in:${vals.join(",")}`);
		}
	} else if (s instanceof z.ZodBoolean) {
		// no specific rules beyond required/optional for boolean
	} else if (s instanceof z.ZodArray) {
		const min = (s as unknown as SchemaWithDef<"minLength", number>)._def.minLength;
		const max = (s as unknown as SchemaWithDef<"maxLength", number>)._def.maxLength;
		if (typeof min === "number") rules.push(`min:${min}`);
		if (typeof max === "number") rules.push(`max:${max}`);
	}

	// join using FormKit pipe syntax with spacing as we've used in the app
	return rules.join(" | ");
}