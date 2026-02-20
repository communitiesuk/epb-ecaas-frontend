import type { DisplayProduct } from "~/pcdb/pcdb.types";

const productSortOption = ["id", "communityHeatNetworkName"] as const;

export type HeatNetworkSearchOption = "productId" | "networkName";
export type HeatNetworkProductSortOption = typeof productSortOption[number];

export interface HeatNetworkProductSearchModel {
	searchOption?: HeatNetworkSearchOption;
	productId?: string;
	networkName?: string;
	sort?: HeatNetworkProductSortOption;
	order?: ProductOrderOption;
}

export function useHeatNetworkProductSearch(products: DisplayProduct[], model: HeatNetworkProductSearchModel): DisplayProduct[] {
	const productIdLower = model.productId?.trim().toLowerCase();
	const networkNameLower = model.networkName?.trim().toLowerCase();
	const order: ProductOrderOption = model.order ?? "asc";

	let searchResults = [...products];

	if (productIdLower?.length) {
		searchResults = searchResults.filter(p => p.id == productIdLower);
	}

	if (networkNameLower?.length) {
		searchResults = searchResults
			.filter(p => p.communityHeatNetworkName?.trim().toLowerCase().startsWith(networkNameLower));
	}

	if (model.sort && productSortOption.includes(model.sort)) {
		searchResults = sortProducts(searchResults, model.sort, order);
	}

	return searchResults;
}