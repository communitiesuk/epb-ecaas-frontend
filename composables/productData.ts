import type { Product } from "~/pcdb/pcdb.types";

export async function useProductData(id: string) {
	const { data } = await useFetch(`/api/products/${id}`);
	return data.value as Product | undefined;
}

export async function useProductDetails(id: string, testDataId?: string): Promise<Product | undefined> {
	const { data: { value: data } } = await useFetch(`/api/products/${id}/details`, {
		query: {
			testDataId,
		},
	});

	return data as Product | undefined;
}