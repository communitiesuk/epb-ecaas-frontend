import type { Product } from "~/pcdb/pcdb.types";

export async function useProductData(id: string) {
	const { data } = await useFetch(`/api/products/${id}`);
	return data.value as Product | undefined;
}