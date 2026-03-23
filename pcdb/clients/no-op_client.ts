import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType } from "../pcdb.types";
import type { Command, Client, DisplayTechnologyProducts, DisplayTechnologyGroupProducts } from "./client.types";
import data from "@/pcdb/data/products.json";

export const noopClient: Client = async <
	T extends TechnologyType,
	U extends Command<T>,
>(
	query: U["input"],
): Promise<U["output"]> => {
	// Return sensible no-op values per command type
	if ("id" in query) {
		return getProductDetailsById(query) as U["output"];
	}
	if ("technologyType" in query) {
		return getProductsByTechnologyType(query);
	}
	if ("technologyGroup" in query) {
		return getProductsByTechnologyGroup(query);
	}

	return undefined as U["output"];
};

const getProductDetailsById = (query: { id: number; }) => {
	const product = data.find(p => p.id === query.id.toString()) as Record<string, unknown>;

	delete product?.testData;

	return product;
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
			backupCtrlType: x.backupCtrlType,
			powerMaxBackup: x.powerMaxBackup,
		})) as DisplayProduct[];

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: endIndex?.toString(),
	};

	return paginatedProducts;
};

const getProductsByTechnologyGroup = <U extends DisplayTechnologyGroupProducts>(query: U["input"]): U["output"] => {
	const filteredProducts = data.filter(p => query.technologyGroup.includes(p.technologyGroup as TechnologyGroup));

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