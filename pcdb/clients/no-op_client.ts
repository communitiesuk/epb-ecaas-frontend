import type { DisplayProduct, PaginatedResult, TechnologyType } from "../pcdb.types";
import type { Command, Client, DisplayTechnologyProducts } from "./client.types";
import data from "@/pcdb/data/products.json";

export const noopClient: Client = async <
	T extends TechnologyType,
	U extends Command<T>,
>(
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
		return [] as unknown as U["output"];
	}
	if ("startsWith" in query) {
		// modelsStartingWith → string[]
		return [] as unknown as U["output"];
	}
	if ("technologyType" in query) {
		return getProductsByTechnologyType(query);
	}

	return undefined as U["output"];
};

const getProductsByTechnologyType = <U extends DisplayTechnologyProducts>(query: U["input"]): U["output"] => {
	const filteredProducts = data.filter(p => p.technologyType === query.technologyType);

	const startIndex = query.startKey ? parseInt(query.startKey) : 0;
	const pageSize = !query.pageSize || query.pageSize > filteredProducts.length ? filteredProducts.length : query.pageSize;
	
	let endIndex: number | undefined = startIndex + pageSize;
	endIndex = endIndex < filteredProducts.length ? endIndex : undefined;

	const products = filteredProducts.slice(startIndex, endIndex)
		.map(x => ({
			id: x.id,
			brandName: x.brandName,
			modelName: x.modelName,
			modelQualifier: x.modelQualifier,
		})) as DisplayProduct[];

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: endIndex?.toString(),
	};

	return paginatedProducts;
};