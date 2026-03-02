import * as z from "zod";

type DiscUnionParams = { discriminator: string, variants: [z.ZodObject, ...z.ZodObject[]] };

type DiscriminableTuple = [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]];

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

// abandon hope all ye who enter
export type NDUNFromUnions<
	Common extends z.ZodObject,
	Unions extends readonly [DiscUnionParams, ...DiscUnionParams[]],
> =
  	Unions extends [infer _First, ...infer Rest]
  		? Rest extends [DiscUnionParams, ...DiscUnionParams[]]
  			? z.ZodDiscriminatedUnion<
  				{ 
  					[K in keyof Unions[0]["variants"]]:
  					K extends number
  						? NDUNFromUnions<Common & Unions[0]["variants"][K], Rest>
  						: Unions[0]["variants"][K]
  				},
  				Unions[0]["discriminator"]
  			>
  			: z.ZodDiscriminatedUnion<
  				{ 
  					[K in keyof Unions[0]["variants"]]:
  					K extends number
  						? Unions[0]["variants"][K] & Common
  						: Unions[0]["variants"][K]
  				},
  				Unions[0]["discriminator"]
  			>
  		: never;

export function ndu1<C extends z.ZodObject, U extends DiscUnionParams>(
	commonFields: C,
	union: U,
): NDU1FromUnions<C, U> {
	const variants = mapTuple(
		union.variants,
		v => commonFields.extend(v.shape),
	);

	return z.discriminatedUnion(
		union.discriminator,
		variants,
	) as NDU1FromUnions<C, U>;
}

export type NDU1<
	Common extends z.ZodObject,
	Types extends DiscriminableTuple,
	Disc extends string,
>
	= z.ZodDiscriminatedUnion<
		{
			[K in keyof Types]: Types[K] & Common
		},
		Disc
	>;

export type NDU1FromUnions<
	Common extends z.ZodObject,
	Union extends DiscUnionParams,
>
	= z.ZodDiscriminatedUnion<
		{
			[K in keyof Union["variants"]]: K extends number
				? Union["variants"][K] & Common
				: Union["variants"][K]
		},
		Union["discriminator"]
	>;

export function ndu2<C extends z.ZodObject, U extends [DiscUnionParams, DiscUnionParams]>(
	commonFields: C,
	...unions: U
): NDU2FromUnions<C, U> {
	const variants = mapTuple(
		unions[0].variants,
		v => ndu1(commonFields.extend(v.shape), unions[1]),
	);

	return z.discriminatedUnion(
		unions[0].discriminator,
		variants,
	) as NDU2FromUnions<C, U>;
}

export type NDU2<
	Common extends z.ZodObject,
	Types extends readonly [
		DiscriminableTuple,
		DiscriminableTuple,
	],
	Disc extends [string, string],
> = z.ZodDiscriminatedUnion<
	{
		[K in keyof Types[0]]: K extends number ? NDU1<
      Types[0][K] & Common,
			Types[1],
			Disc[1]
		> : Types[0][K]
	},
	Disc[0]
>;

export type NDU2FromUnions<
	Common extends z.ZodObject,
	Unions extends [DiscUnionParams, DiscUnionParams],
> = z.ZodDiscriminatedUnion<
	{
		[K in keyof Unions[0]["variants"]]: K extends number ? NDU1FromUnions<
      Unions[0]["variants"][K] & Common,
			Unions[1]
		> : Unions[0]["variants"][K]
	},
	Unions[0]["discriminator"]
>;