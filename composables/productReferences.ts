import type { Product } from "~/pcdb/pcdb.types";

export async function useProductReferences<TFormData extends object, TProductData>(
	formData: EcaasForm<TFormData>[],
	setProductData: (product: Product) => TProductData,
): Promise<Record<string, TProductData>> {
	const productData: Record<string, TProductData> = {};

	const references = extractProductReferences(formData);

	if (references.length === 0) {
		return productData;
	}

	const fetchedProductData = await fetchProductDataForMultipleReferences(references);

	for (const reference of references) {
		const product = fetchedProductData[reference];
		if (product) {
			productData[reference] = setProductData(product);
		}
	}

	return productData;
}

function extractProductReferences<TFormData extends object>(formData: EcaasForm<TFormData>[]): string[] {
	const references: string[] = [];

	formData.forEach((element) => {
		if ("productReference" in element.data && element.data.productReference) {
			references.push(element.data.productReference as string);
		}

		if ("airPressureShowerProductReference" in element.data && element.data.airPressureShowerProductReference) {
			references.push(element.data.airPressureShowerProductReference as string);
		}

		if ("wwhrsProductReference" in element.data && element.data.wwhrsProductReference) {
			references.push(element.data.wwhrsProductReference as string);
		}
	});
	return references;
}


async function fetchProductDataForMultipleReferences(references: string[]): Promise<Record<string, Product>> {
	// new endpoint 
	const { data: { value: products } } = await useFetch("/api/products/batch", {
		method: "GET",
		query: {
			ids: references.join(","),
		},
	});
	const productData: Record<string, Product> = {};
	if (Array.isArray(products)) {
		for (const product of products) {
			if (product && product.modelName) {
				productData[product.id] = product;
			}
		}
	}
	return productData;
}