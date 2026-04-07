import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType } from "../pcdb.types";
import type { PcdbClient } from "./client.types";
import data from "@/pcdb/data/products.json";

export const noopClient: PcdbClient = {
	async getProduct<T>(id: number) {
		return getProduct(id) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = (id: number) => {
	const product = data.find(p => p.id === id.toString()) as Record<string, unknown>;

	delete product?.testData;

	return product;
};

const getProductsByTechnologyType = (technologyType: TechnologyType, pageSize?: number, startKey?: string) => {
	const filteredProducts = data.filter(p => p.technologyType === technologyType);

	const startIndex = startKey ? parseInt(startKey) : 0;
	const size = !pageSize || pageSize > filteredProducts.length ? filteredProducts.length : pageSize;
	
	let endIndex: number | undefined = startIndex + size;
	endIndex = endIndex < filteredProducts.length ? endIndex : undefined;

	const products = filteredProducts.slice(startIndex, endIndex)
		.map(x => ({
			id: x.id,
			brandName: x.brandName,
			modelName: x.modelName,
			modelQualifier: x.modelQualifier,
			technologyType: x.technologyType as TechnologyType,
		})) as DisplayProduct[];

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: endIndex?.toString(),
	};

	return paginatedProducts;
};

const getProductsByTechnologyGroup = (technologyGroup: TechnologyGroup) => {
	const filteredProducts = data.filter(p => technologyGroup.includes(p.technologyGroup as TechnologyGroup));

	const products = filteredProducts
		.map(x => ({
			id: x.id,
			brandName: x.brandName,
			modelName: x.modelName,
			modelQualifier: x.modelQualifier,
			technologyType: x.technologyType as TechnologyType,
		})) as DisplayProduct[];

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};