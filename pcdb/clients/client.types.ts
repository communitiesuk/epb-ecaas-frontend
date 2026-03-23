import type { DisplayProduct, PaginatedResult, Product, TechnologyGroup, TechnologyType } from "../pcdb.types";

export type ProductForTechnology<T extends TechnologyType> = Extract<Product, { technologyType: T }>;

type FullProductById<T extends TechnologyType> = {
	name: "fullProductById",
	input: {
		id: number,
	},
	output: ProductForTechnology<T> | undefined,
};

export type DisplayTechnologyProducts = {
	name: "displayTechnologyProducts",
	input: {
		technologyType: TechnologyType,
		pageSize?: number,
		startKey?: string,
	},
	output: PaginatedResult<DisplayProduct>,
};

export type DisplayTechnologyGroupProducts = {
	name: "displayTechnologyGroupProducts",
	input: {
		technologyGroup: TechnologyGroup,
		pageSize?: number,
		startKey?: string,
	},
	output: PaginatedResult<DisplayProduct>,
};

export type Command<T extends TechnologyType> = FullProductById<T> | DisplayTechnologyProducts | DisplayTechnologyGroupProducts;

export type Client = <T extends TechnologyType, U extends Command<T>>(query: U["input"]) => Promise<U["output"]>;