import type { DisplayProduct } from "~/pcdb/pcdb.types";
import Fuse, { type Expression } from "fuse.js";

const productSortOption = ["id", "brandName", "modelName", "modelQualifier", "type", "height", "systemName", "pipeCentres", "communityHeatNetworkName", "subheatNetworkName"] as const;

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
				"type",
				"height",
				"systemName",
				"communityHeatNetworkName",
				"subheatNetworkName",
			],
		});

		searchResults = fuse.search({
			$and: searchTerm.split(" ").map((searchValue: string) => {
				return {
					$or: [
						{ brandName: searchValue },
						{ modelName: searchValue },
						{ modelQualifier: searchValue },
						{ type: searchValue },
						{ height: searchValue },
						{ systemName: searchValue },
						{ communityHeatNetworkName: searchValue },
						{ subheatNetworkName: searchValue },
					],
				};
			}) as Expression[],
		}).map(r => r.item);
	}

	if (model.sort && productSortOption.includes(model.sort)) {
		searchResults = sortProducts(searchResults, model.sort, order);
	}

	if (!productId?.length && !searchTerm?.length) {
		const hemDefaultIndex = searchResults.findIndex(x => x.brandName === "HEM Default");
		const hemDefault = searchResults[hemDefaultIndex];

		if (hemDefault) {
			searchResults.splice(hemDefaultIndex, 1);
			searchResults.unshift(hemDefault);
		}
	}

	return searchResults;
}

function getSortValue(product: DisplayProduct, sort: ProductSortOption) {
	if (sort === "systemName") {
		return product.technologyType === "UnderFloorHeating"
			? product.systemName
			: undefined;
	}

	if (sort === "pipeCentres") {
		return product.technologyType === "UnderFloorHeating"
			? product.pipeCentres
			: undefined;
	}

	if (sort === "type" || sort === "height") {
		return product.technologyType === "ConvectorRadiator"
			? product[sort]
			: undefined;
	}

	if (sort in product) {
		return product[sort as keyof DisplayProduct];
	}

	return undefined;
}

function compareProductIds(aId: string | number, bId: string | number, order: ProductOrderOption) {
	const aNumber = typeof aId === "string" ? Number(aId.trim().match(/\d+/)?.[0] ?? "0") : aId;
	const bNumber = typeof bId === "string" ? Number(bId.trim().match(/\d+/)?.[0] ?? "0") : bId;

	if (aNumber < bNumber) {
		return order === "asc" ? -1 : 1;
	}

	if (aNumber > bNumber) {
		return order === "asc" ? 1 : -1;
	}

	return 0;
}

export function sortProducts(searchResults: DisplayProduct[], sort: ProductSortOption, order: ProductOrderOption) {
	return searchResults.sort((productA: DisplayProduct, productB: DisplayProduct) => {
		if (sort === "id") {
			return compareProductIds(productA.id, productB.id, order);
		}

		const aValue = getSortValue(productA, sort);
		const bValue = getSortValue(productB, sort);

		const heightAtoSecondarySort = productA.technologyType === "ConvectorRadiator" ? productA.height ?? 0 : 0;
		const heightBtoSecondarySort = productB.technologyType === "ConvectorRadiator" ? productB.height ?? 0 : 0;

		if (aValue != null && bValue != null) {
			const [a, b] = [aValue, bValue].map(v => typeof v === "string" ? v.toLowerCase() : v);
			if (sort === "height") {
				return order === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
			}
			if (a! < b!) {
				return order === "asc" ? -1 : 1;
			}

			if (a! > b!) {
				return order === "asc" ? 1 : -1;
			}	
			

			if (a === b && (heightAtoSecondarySort || heightBtoSecondarySort)) {
				if (heightAtoSecondarySort < heightBtoSecondarySort) {
					return -1;
				} else {
					return 1;
				}
			}
		

			return 0;
		}

		if (aValue != null) {
			return order === "asc" ? -1 : 1;
		}

		if (bValue != null) {
			return order === "asc" ? 1 : -1;
		}

		return 0;
	});
}