import { arrayIncludes } from "ts-extras";
import type { Category, DisplayProduct, ProductEntity, ProductReference, TechnologyType } from "~/pcdb/pcdb.types";
import products, { categoryTechnologies } from "~/pcdb/pcdb.types";

export async function productsInCategory(category: Category): Promise<ProductEntity<DisplayProduct>[]> {
	return productsForTechnologies(categoryTechnologies[category]);
}

async function productsForTechnologies<T extends TechnologyType[]>(technologies: T) {
	const technologyProducts = Array.from(products.entries())
		.filter(([_, product]) => arrayIncludes(technologies, product["technologyType"]))
		.map(([reference, product]) => {
			const {
				brandName,
				modelName,
				modelQualifier,
				technologyType,
			} = product;
			const displayProduct: DisplayProduct = {
				brandName,
				modelName,
				modelQualifier,
				technologyType,
			};
			return {
				reference: reference as ProductReference,
				product: displayProduct,
			};
		}) as ProductEntity<DisplayProduct>[];

	return Promise.resolve(technologyProducts);
}