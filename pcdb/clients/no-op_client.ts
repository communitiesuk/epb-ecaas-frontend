import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType } from "../pcdb.types";
import type { PcdbClient } from "./client.types";
import data from "@/pcdb/data/products.json";

export const noopClient: PcdbClient = {
	async getProduct<T>(id: string) {
		return getProduct(id) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = (id: string) => {
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
		.map((x) => {
			const product = x as Record<string, unknown>;
			const id = (product.id ?? product.ID)?.toString();
			if (!id) {
				return undefined;
			}

			const technologyType = product.technologyType as TechnologyType;

			if (technologyType === "ConvectorRadiator" && typeof product.type === "string" && typeof product.height === "number") {
				return {
					id,
					type: product.type,
					height: product.height,
					technologyType,
				} satisfies DisplayProduct;
			}

			if (technologyType === "ConvectorRadiator") {
				return undefined;
			}

			return {
				id,
				brandName: typeof product.brandName === "string" ? product.brandName : "",
				modelName: typeof product.modelName === "string" ? product.modelName : "",
				modelQualifier: typeof product.modelQualifier === "string" ? product.modelQualifier : null,
				technologyType,
			} satisfies DisplayProduct;
		})
		.filter((x): x is NonNullable<typeof x> => x !== undefined);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: endIndex?.toString(),
	};

	return paginatedProducts;
};

const getProductsByTechnologyGroup = (technologyGroup: TechnologyGroup) => {
	const filteredProducts = data.filter(p => technologyGroup.includes(p.technologyGroup as TechnologyGroup));

	const products = filteredProducts
		.map((x) => {
			const product = x as Record<string, unknown>;
			const id = (product.id ?? product.ID)?.toString();
			if (!id) {
				return undefined;
			}

			const technologyType = product.technologyType as TechnologyType;

			if (technologyType === "ConvectorRadiator" && typeof product.type === "string" && typeof product.height === "number") {
				return {
					id,
					type: product.type,
					height: product.height,
					technologyType,
				} satisfies DisplayProduct;
			}

			if (technologyType === "ConvectorRadiator") {
				return undefined;
			}

			return {
				id,
				brandName: typeof product.brandName === "string" ? product.brandName : "",
				modelName: typeof product.modelName === "string" ? product.modelName : "",
				modelQualifier: typeof product.modelQualifier === "string" ? product.modelQualifier : null,
				technologyType,
			} satisfies DisplayProduct;
		})
		.filter((x) => x !== undefined);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};