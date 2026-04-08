import { getProductDetails } from "@/server/services/products";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	return await getProductDetails(id ?? "");
});
