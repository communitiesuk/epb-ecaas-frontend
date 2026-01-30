import type { DisplayProduct, PaginatedResult, TechnologyType } from "../pcdb.types";
import type { Command, Client, DisplayTechnologyProducts, DisplayById } from "./client.types";
import data from "@/pcdb/data/products.json";

export const noopClient: Client = async <
	T extends TechnologyType,
	U extends Command<T>,
>(
	query: U["input"],
): Promise<U["output"]> => {
	// Return sensible no-op values per command type
	if ("id" in query && "technologyType" in query) {
		return getProductDetailsById(query) as U["output"];
	}
	if ("id" in query) {
		return getProductById(query);
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

const getProductById = <U extends DisplayById>(query: U["input"]): U["output"] => {
	const product = data.find(p => p.id === query.id.toString());

	if (!product) {
		return undefined;
	}

	const displayProduct: DisplayProduct = {
		id: product.id,
		brandName: product.brandName,
		modelName: product.modelName,
		modelQualifier: product.modelQualifier,
		technologyType: product.technologyType as TechnologyType,
	};

	return displayProduct;
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