import * as z from "zod";

type DiscUnionParams = { discriminator: string, variants: [z.ZodObject, ...z.ZodObject[]] };

function mapTuple<T extends object[], U>(
	tuple: T,
	fn: (item: T[number], index: number,) => U,
): { [K in keyof T]: U } {
	return tuple.map(fn) as { [K in keyof T]: U };
}

export function nestedDiscriminatedUnion<C extends z.ZodObject, U extends [DiscUnionParams, ...DiscUnionParams[]]>(
	commonFields: C,
	...unions: U
): NDUNFromUnions<C, U> {
	if (unions.length === 0) {
		throw new RangeError("can't be giving us an empty array mate");
	}

	if (unions.length === 1) {
		const variants = mapTuple(
			unions[0].variants,
			v => commonFields.extend(v.shape),
		);

		return z.discriminatedUnion(
			unions[0].discriminator,
			variants,
		) as unknown as NDUNFromUnions<C, U>;;
	} 

	const variants = mapTuple(
		unions[0].variants,
		v => nestedDiscriminatedUnion(commonFields.extend(v.shape), ...unions.toSpliced(0, 1) as [DiscUnionParams, ...DiscUnionParams[]]),
	);

	return z.discriminatedUnion(
		unions[0].discriminator,
		variants,
	) as unknown as NDUNFromUnions<C, U>;;
}

export type NDUNFromUnions<
	Common extends z.ZodObject,
	Unions extends readonly [DiscUnionParams, ...DiscUnionParams[]],
> =
  	Unions extends [infer _First, ...infer Rest]
  		? z.ZodDiscriminatedUnion<
  			{ 
  				[K in keyof Unions[0]["variants"]]:
  				K extends number
  					? Rest extends [DiscUnionParams, ...DiscUnionParams[]]
  						? NDUNFromUnions<Common & Unions[0]["variants"][K], Rest>
  						: Unions[0]["variants"][K] & Common
  					: Unions[0]["variants"][K]
  			},
  			Unions[0]["discriminator"]
  		>
  		: never;