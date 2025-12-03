import type { NonNegativeInteger } from "type-fest";
import type { DisplayProduct, Product, TechnologyType } from "../pcdb.types";

type ProductForTechnology<T extends TechnologyType> = Extract<Product, { technologyType: T }>;

type DisplayById = {
	name: "displayById",
	input: {
		id: number,
	},
	output: DisplayProduct | undefined,
};

type FullProductById<T extends TechnologyType> = {
	name: "fullProductById",
	input: {
		id: number,
		technologyType: T,
	},
	output: ProductForTechnology<T> | undefined,
};

type BrandsStartingWith = {
	name: "brandsStartingWith",
	input: {
		startsWith: string,
		technologyType: TechnologyType,
	},
	output: Set<string>,
};

type ModelsStartingWith = {
	name: "modelsStartingWith",
	input: {
		startsWith: string,
		brandName?: string,
	},
	output: Set<string>,
};

type DisplayTechnologyProducts = {
	name: "displayTechnologyProducts",
	input: {
		technologyType: TechnologyType,
		page?: NonNegativeInteger<number>,
	} & ({
		brandStartsWith?: string,
	} | {
		brandName?: string,
		modelStartsWith?: string,
	}),
	output: DisplayProduct[],
};

export type Command<T extends TechnologyType> = DisplayById | FullProductById<T> | BrandsStartingWith | ModelsStartingWith | DisplayTechnologyProducts;

export type Client = <T extends TechnologyType, U extends Command<T>>(query: U["input"]) => Promise<U["output"]>;