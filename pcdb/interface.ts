import type { NonNegativeInteger } from "type-fest";
import type { DisplayProduct, Product, TechnologyType } from "./products";

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

type Command<T extends TechnologyType> = DisplayById | FullProductById<T> | BrandsStartingWith | ModelsStartingWith | DisplayTechnologyProducts;

type Client = <T extends TechnologyType, U extends Command<T>>(query: U["input"]) => Promise<U["output"]>;

export const noopClient: Client = async <T extends TechnologyType, U extends Command<T>>(
	query: U["input"],
): Promise<U["output"]> => {
	// Return sensible no-op values per command type
	if ("id" in query && "technologyType" in query) {
		// fullProductById → ProductForTechnology<T> | undefined
		return undefined as U["output"];
	}
	if ("id" in query) {
		// displayById → DisplayProduct | undefined
		return undefined as U["output"];
	}
	if ("startsWith" in query && "technologyType" in query) {
		// brandsStartingWith → string[]
		return [] as U["output"];
	}
	if ("startsWith" in query) {
		// modelsStartingWith → string[]
		return [] as U["output"];
	}
	if ("technologyType" in query) {
		// displayTechnologyProducts → DisplayProduct[]
		return [] as U["output"];
	}
    
	return undefined as U["output"];
};
