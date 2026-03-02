import * as z from "zod";

type DiscUnionParams = { discriminator: string, variants: [z.ZodObject, ...z.ZodObject[]] };

type DiscriminableTuple = [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]];

function mapTuple<T extends object[], U>(
	tuple: T,
	fn: (item: T[number], index: number,) => U,
): { [K in keyof T]: U } {
	return tuple.map(fn) as { [K in keyof T]: U };
}

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

// type ExtractTypes<U extends readonly [DiscUnionParams, ...DiscUnionParams[]]> =
//   U extends [infer First, ...infer Rest]
//   	? First extends DiscUnionParams
//   		? Rest extends DiscUnionParams[]
//   			? [First["variants"], ...ExtractTypes<Rest extends [DiscUnionParams, ...DiscUnionParams[]] ? Rest : never>]
//   			: [First["variants"]]
//   		: never
//   	: never;

// type ExtractDisc<U extends readonly [DiscUnionParams, ...DiscUnionParams[]]> =
//   U extends [infer First, ...infer Rest]
//   	? First extends DiscUnionParams
//   		? Rest extends DiscUnionParams[]
//   			? [First["discriminator"], ...ExtractDisc<Rest extends [DiscUnionParams, ...DiscUnionParams[]] ? Rest : never>]
//   			: [First["discriminator"]]
//   		: never
//   	: never;

// type NDUNFromUnions<
//   	Common extends z.ZodObject,
// Unions extends readonly [DiscUnionParams, ...DiscUnionParams[]],
//   > = NDUN<
//   	Common,
//   	ExtractTypes<Unions>,
//   	ExtractDisc<Unions>
//   >;

// // abandon hope all ye who enter
// type NDUN<
// 	Common extends z.ZodObject,
// 	Types extends [
// 		DiscriminableTuple,
// 		...(DiscriminableTuple)[],
// 	],
// 	Disc extends [string, ...string[]],
// > =
//   Types extends [infer _First, ...infer Rest]
//   	? Disc extends [infer _FirstDisc, ...infer RestDisc]
//   		? Rest extends [
//   			DiscriminableTuple,
//   			...(DiscriminableTuple)[],
//   		]
//   			? RestDisc extends [string, ...string[]]
//   				? z.ZodDiscriminatedUnion<
//   					{ 
//   						[K in keyof Types[0]]:
//   						K extends number ?
//   							NDUN<Common & Types[0][K], Rest, RestDisc>
//   							: Types[0][K]
//   					},
//   					Disc[0]
//   				>
//   				: never
//   			: z.ZodDiscriminatedUnion<
//   				{ 
//   					[K in keyof Types[0]]:
//   					K extends number
//   						? Types[0][K] & Common
//   						: Types[0][K]
//   				},
//   				Disc[0]
//   			>
//   		: never
//   	: never;

// // export function ndu3<C extends z.ZodObject, U extends [DiscUnionParams, ...DiscUnionParams[]]>(
// // 	commonFields: C,
// // 	...unions: U
// // ): NDUNFromUnions<C, U> {
// // }


// // type NDU3<
// // 	Common extends z.ZodObject,
// // 	Types extends readonly [
// // 		DiscriminableTuple,
// // 		DiscriminableTuple,
// // 		DiscriminableTuple,
// // 	],
// // 	Disc extends [string, string, string],
// // > = z.ZodDiscriminatedUnion<
// // 	{
// // 		[K in keyof Types[0]]: K extends number ? NDU2<
// // 	Types[0][K] & Common,
// // 			[Types[1], Types[2]],
// // 			[Disc[1], Disc[2]]
// // 		> : Types[0][K]
// // 	},
// // 	Disc[0]
// // >;
// // export function ndu2<C extends z.ZodObject, U extends [DiscUnionParams, ...DiscUnionParams[]]>(
// // 	commonFields: C,
// // 	...unions: U
// // ): NDUNFromUnions<C, U> {
// // }

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