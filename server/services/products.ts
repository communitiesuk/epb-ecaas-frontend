import { arrayIncludes } from 'ts-extras';
import type { Category, Product, ProductEntity, ProductForCategory, ProductReference, TechnologyType } from '~/pcdb/products';
import products, { categoryTechnologies } from '~/pcdb/products';

export async function productsInCategory<T extends Category>(category: T): Promise<ProductEntity<ProductForCategory<T>>[]> {
	return productsForTechnologies(categoryTechnologies[category]);
}

async function productsForTechnologies<T extends TechnologyType[]>(technologies: T) {
	const technologyProducts = Array.from(products.entries())
		.filter(([_, product]) => arrayIncludes(technologies, product['technologyType']))
		.map(([reference, product]) => ({
			reference: reference as ProductReference,
			product,
		})) as ProductEntity<Extract<Product, { technologyType: T[number] }>>[];

	// still need to narrow fields down to only those that could be displayed

	return Promise.resolve(technologyProducts);
}