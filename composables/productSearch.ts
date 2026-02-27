import type { DisplayProduct } from "~/pcdb/pcdb.types";
import Fuse from "fuse.js";

const productSortOption = ["id", "brandName", "modelName", "modelQualifier", "communityHeatNetworkName"] as const;

export type SearchOption = "productId" | "modelAndBrand" | "networkName";
export type ProductSortOption = typeof productSortOption[number];
export type ProductOrderOption = "asc" | "desc";

export interface ProductSearchModel {
	searchOption?: SearchOption;
	productId?: string;
	searchTerm?: string;
	sort?: ProductSortOption;
	order?: ProductOrderOption;
}

export function useProductSearch(products: DisplayProduct[], model: ProductSearchModel): DisplayProduct[] {
	const productId = model.productId?.trim();
	const searchTerm = model.searchTerm?.trim();
	const order: ProductOrderOption = model.order ?? "asc";

	let searchResults = [...products];

	let fuse: Fuse<DisplayProduct>;

	if (productId?.length) {
		fuse = new Fuse(products, {
			threshold: 0,
			keys: ["id"],
		});

		searchResults = fuse.search(productId).map(r => r.item);

	} else if (searchTerm?.length) {
		fuse = new Fuse(products, {
			threshold: 0.2,
			keys: [
				"brandName",
				"modelName",
				"modelQualifier",
				"communityHeatNetworkName",
			],
		});
		searchResults = fuse.search(searchTerm).map(r => r.item);
	}

	if (model.sort && productSortOption.includes(model.sort)) {
		searchResults = sortProducts(searchResults, model.sort, order);
	}

	return searchResults;
}

export function sortProducts(searchResults: DisplayProduct[], sort: keyof Partial<DisplayProduct>, order: ProductOrderOption) {
	return searchResults.sort((productA: DisplayProduct, productB: DisplayProduct) => {
		const aValue = productA[sort];
		const bValue = productB[sort];
		
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