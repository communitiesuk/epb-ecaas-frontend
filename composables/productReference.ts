import type { Product } from "~/pcdb/pcdb.types";

export async function useProductReference<TFormData extends object, TProductData>(
	formData: EcaasForm<TFormData>[],
	setProductData: (product: Product) => TProductData,
): Promise<Record<string, TProductData>> {
	const productData: Record<string, TProductData> = {};

	await Promise.all(formData.map(async (element) => {
		if ("productReference" in element.data && element.data.productReference) {
			const { data: { value: product } } = await useFetch(`/api/products/${element.data.productReference}`);

			if (product && product.modelName) {	
				productData[element.data.productReference as string] = setProductData(product);
			}
		}
	}));

	return productData;
}