import type { DisplayProduct, PaginatedResult, Product, TechnologyType } from "../pcdb.types";

export type ProductForTechnology<T extends TechnologyType> = Extract<Product, { technologyType: T }>;

export type DisplayById = {
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

export type DisplayTechnologyProducts = {
	name: "displayTechnologyProducts",
	input: {
		technologyType: TechnologyType,
		pageSize?: number,
		startKey?: string,
	} & ({
		brandStartsWith?: string,
	} | {
		brandName?: string,
		modelStartsWith?: string,
	}),
	output: PaginatedResult<DisplayProduct>,
};

export type Command<T extends TechnologyType> = DisplayById | FullProductById<T> | BrandsStartingWith | ModelsStartingWith | DisplayTechnologyProducts;

export type Client = <T extends TechnologyType, U extends Command<T>>(query: U["input"]) => Promise<U["output"]>;