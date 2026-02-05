import type { DisplayProduct } from "~/pcdb/pcdb.types";

const productSortOption = ["id", "brandName", "modelName", "modelQualifier"] as const;

export type SearchOption = "productId" | "modelAndBrand";
export type ProductSortOption = typeof productSortOption[number];
export type ProductOrderOption = "asc" | "desc";

export interface ProductSearchModel {
	searchOption?: SearchOption;
	productId?: string;
	brandName?: string;
	modelName?: string;
	modelQualifier?: string;
	sort?: ProductSortOption;
	order?: ProductOrderOption;
}

export function useProductSearch(products: DisplayProduct[], model: ProductSearchModel): DisplayProduct[] {
	const productIdLower = model.productId?.trim().toLowerCase();
	const brandNameLower = model.brandName?.trim().toLowerCase();
	const modelNameLower = model.modelName?.trim().toLowerCase();
	const modelQualifierLower = model.modelQualifier?.trim().toLowerCase();
	const order: ProductOrderOption = model.order ?? "asc";

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

	if (model.sort && productSortOption.includes(model.sort)) {
		searchResults = searchResults.sort((productA: DisplayProduct, productB: DisplayProduct) => {
			const aValue = productA[model.sort!];
			const bValue = productB[model.sort!];
			
			if (aValue && bValue) {
				const [a, b] = [aValue, bValue].map(v => typeof v === "string" ? v.toLowerCase() : v);

				if (a! < b!) {
					return order === "asc" ? -1 : 1;
				}

				if (a! > b!) {
					return order === "asc" ? 1 : -1;
				}

				return 0;
			}

			if (aValue) {
				return order === "asc" ? -1 : 1;
			}

			if (bValue) {
				return order === "asc" ? 1 : -1;
			}

			return 0;
		});
	}

	return searchResults;
}