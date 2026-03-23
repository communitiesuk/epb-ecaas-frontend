import { getProductDetails } from "~/server/services/products";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const productId = parseInt(id ?? "");

	return await getProductDetails(productId);
});