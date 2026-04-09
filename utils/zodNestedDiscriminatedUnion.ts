import * as z from "zod";

type DiscUnionParams = {
	discriminator: string,
	variants: [z.ZodObject, ...z.ZodObject[]]
};


function mapTuple<T extends object[], U>(
	tuple: T,
	fn: (item: T[number], index: number,) => U,
): { [K in keyof T]: U } {
	// .map() and similar don't preserve tuple types in TypeScript, which is
	// annoying as this typecast loses some specificity
	return tuple.map(fn) as { [K in keyof T]: U };
}

/** 
 * @param commonFields A ZodObject with any fields which have identical types throughout the union. Discriminator properties should not be included here.
 * @param unions A non-empty array containing `DiscUnionParams` objects
 * @returns A Zod schema which will validate a flat object structure with any
 * permutation of the discriminated unions provided.
 */
export function nestedDiscriminatedUnion<
	C extends z.ZodObject, 
	U extends [DiscUnionParams, ...DiscUnionParams[]],
>(
	commonFields: C,
	...unions: U
): NDUNFromUnions<C, U> {
	if (unions.length === 0) {
		// If this is reached, there should already be a ts-error where it's called
		throw new RangeError("`unions` parameter is empty - expected at least one element");
	}

	if (unions.length === 1) {
		const variants = mapTuple(
			unions[0].variants,
			v => commonFields.extend(v.shape),
		);

		return z.discriminatedUnion(
			unions[0].discriminator,
			variants,
		) as unknown as NDUNFromUnions<C, U>;
		// These type casts are only safe because we're testing NDUNFromUnions quite extensively - potentially brittle
	} 

	const variants = mapTuple(
		unions[0].variants,
		v => nestedDiscriminatedUnion(commonFields.extend(v.shape), ...unions.toSpliced(0, 1) as [DiscUnionParams, ...DiscUnionParams[]]),
	);

	return z.discriminatedUnion(
		unions[0].discriminator,
		variants,
	) as unknown as NDUNFromUnions<C, U>;
	// These type casts are only safe because we're testing NDUNFromUnions quite extensively - potentially brittle
}

export type NDUNFromUnions<
	Common extends z.ZodObject,
	Unions extends readonly [DiscUnionParams, ...DiscUnionParams[]],
> =
	// always true, just used to isolate Rest to check if it's empty later
  	Unions extends [infer _First, ...infer Rest]
  		? z.ZodDiscriminatedUnion<
  			{ 
  				[K in keyof Unions[0]["variants"]]:
  				// We only want to extend the properties of the array given by index
  				// keys, stuff like .concat() and .length should just be copied
  				K extends number
  					// If Rest is empty, we don't need to recurse any further
  					? Rest extends [DiscUnionParams, ...DiscUnionParams[]]
  						? NDUNFromUnions<Common & Unions[0]["variants"][K], Rest>
  						: Unions[0]["variants"][K] & Common
  					: Unions[0]["variants"][K]
  			},
  			Unions[0]["discriminator"]
  		>
  		: never;