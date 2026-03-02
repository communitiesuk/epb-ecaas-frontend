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
