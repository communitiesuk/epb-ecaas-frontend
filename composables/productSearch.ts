import type { DisplayProduct } from "~/pcdb/pcdb.types";

export type SearchOption = "productId" | "modelAndBrand";

export interface ProductSearchModel {
	searchOption?: SearchOption;
	productId?: string;
	brandName?: string;
	modelName?: string;
	modelQualifier?: string;
}

export function useProductSearch(products: DisplayProduct[], model: ProductSearchModel): DisplayProduct[] {
	const productIdLower = model.productId?.trim().toLowerCase();
	const brandNameLower = model.brandName?.trim().toLowerCase();
	const modelNameLower = model.modelName?.trim().toLowerCase();
	const modelQualifierLower = model.modelQualifier?.trim().toLowerCase();

	let searchResults = [...products];

	if (productIdLower?.length) {
		searchResults = searchResults.filter(p => p.id == productIdLower);
	}

	if (brandNameLower?.length) {
		searchResults = searchResults
			.filter(p => p.brandName.trim().toLowerCase().startsWith(brandNameLower));
	}

	if (modelNameLower?.length) {
		searchResults = searchResults
			.filter(p => p.modelName.trim().toLowerCase().startsWith(modelNameLower));
	}

	if (modelQualifierLower?.length) {
		searchResults = searchResults
			.filter(p => p.modelQualifier?.trim().toLowerCase().startsWith(modelQualifierLower));
	}

	return searchResults;
}