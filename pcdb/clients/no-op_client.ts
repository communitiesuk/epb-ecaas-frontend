import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType, VesselType } from "../pcdb.types";
import type { PcdbClient } from "./client.types";
import data from "@/pcdb/data/products.json";
import { generateHeatNetworkSubNetworkDisplayProductCombinations } from "../utils/subheatnetwork-combination-display";

interface GetProductOptions {
	includeTestData: boolean;
	testDataId?: string;
}

export const noopClient: PcdbClient = {
	async getProduct<T>(id: string, { includeTestData = false, testDataId }: GetProductOptions) {
		return getProduct(id, { includeTestData, testDataId }) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = (id: string, { includeTestData = false, testDataId }: GetProductOptions) => {
	const sourceProduct = data.find(p => p.id === id.toString()) as Record<string, unknown> | undefined;
	const product = sourceProduct ? { ...sourceProduct } : undefined;

	if (!includeTestData && !testDataId) {
		delete product?.testData;
		delete product?.testDataEN14825;
	}

	if (testDataId) {
		const testData = Array.isArray(product?.testData) ? product.testData as Record<string, unknown>[] : [];
		const match = testData.find((entry) => (entry.ID ?? entry.id)?.toString() === testDataId);

		if (product && match) {
			product.testData = match;
		}
		return product;
	}

	return product;
};

const toDisplayProduct = (item: Record<string, unknown>, fallbackTechnologyType?: TechnologyType): DisplayProduct | DisplayProduct[] | undefined => {
	const id = (item.id ?? item.ID)?.toString();
	if (!id) {
		return undefined;
	}

	const technologyType = (item.technologyType ?? fallbackTechnologyType) as TechnologyType;
	if (technologyType === "HeatNetworks") {
		return generateHeatNetworkSubNetworkDisplayProductCombinations(item);
	}

	if (technologyType === "ConvectorRadiator") {
		if (typeof item.type !== "string") {
			return undefined;
		}

		const height = typeof item.height === "number" ? item.height : typeof item.height === "string" ? parseFloat(item.height) : NaN;
		if (!isFinite(height)) {
			return undefined;
		}

		return {
			displayProduct: true,
			id,
			type: item.type,
			height,
			technologyType,
		};
	}

	return {
		displayProduct: true,
		id,
		brandName: typeof item.brandName === "string" ? item.brandName : "",
		modelName: typeof item.modelName === "string" ? item.modelName : "",
		modelQualifier: typeof item.modelQualifier === "string" ? item.modelQualifier : "",
		technologyType,
		...(item.backupCtrlType ? { backupCtrlType: item.backupCtrlType as string } : {}),
		...(item.powerMaxBackup ? { powerMaxBackup: item.powerMaxBackup as number } : {}),
		...(item.boilerLocation === "internal" || item.boilerLocation === "external" || item.boilerLocation === "unknown"
			? { boilerLocation: item.boilerLocation }
			: {}),
		...(typeof item.communityHeatNetworkName === "string" ? { communityHeatNetworkName: item.communityHeatNetworkName } : {}),
		...(item.boilerProductID ? { boilerProductID: item.boilerProductID.toString() } : {}),
		...(item.vesselType ? { vesselType: item.vesselType as VesselType } : {}),
	};
};

const getProductsByTechnologyType = (technologyType: TechnologyType, pageSize?: number, startKey?: string) => {
	const filteredProducts = data.filter(p => p.technologyType === technologyType);

	const startIndex = startKey ? parseInt(startKey) : 0;
	const size = !pageSize || pageSize > filteredProducts.length ? filteredProducts.length : pageSize;

	let endIndex: number | undefined = startIndex + size;
	endIndex = endIndex < filteredProducts.length ? endIndex : undefined;

	const products = filteredProducts.slice(startIndex, endIndex)
		.flatMap(x => toDisplayProduct(x as Record<string, unknown>, technologyType) ?? [])
		.filter((x): x is DisplayProduct => x !== undefined);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: endIndex?.toString(),
	};

	return paginatedProducts;
};

const getProductsByTechnologyGroup = (technologyGroup: TechnologyGroup) => {
	const filteredProducts = data.filter(p => p.technologyGroup === technologyGroup);
	const products = filteredProducts
		.flatMap(x => toDisplayProduct(x as Record<string, unknown>) ?? [])
		.filter((x): x is DisplayProduct => x !== undefined);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};