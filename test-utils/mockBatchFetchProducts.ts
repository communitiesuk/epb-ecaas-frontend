import { ref } from "vue";

/**
 * Sets up mockFetch to handle `/api/products/batch` requests.
 *
 * @param mockFetch - The vi.fn() mock for useFetch
 * @param defaultModelName - The model name returned for any unspecified product ID
 * @param overrides - A map of productId → modelName for specific IDs
 */
export const mockBatchFetchProducts = (
	mockFetch: ReturnType<typeof vi.fn>,
	defaultModelName = "Mock product",
	overrides: Record<string, string> = {},
) => {
	mockFetch.mockImplementation((url: string, options?: { query?: { ids?: string } }) => {
		if (url === "/api/products/batch") {
			const ids = options?.query?.ids?.split(",").map(id => id.trim()).filter(Boolean) ?? [];
			return { data: ref(ids.map((id) => ({ id, modelName: overrides[id] ?? `${defaultModelName}` }))) };
		}
		throw new Error(`Unhandled URL in mockFetch: ${url}`);
	});
};
