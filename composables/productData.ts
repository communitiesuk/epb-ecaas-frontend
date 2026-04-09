
export async function useProductData(id: string) {
	const { data } = await useFetch(`/api/products/${id}`);
	return data.value;
}