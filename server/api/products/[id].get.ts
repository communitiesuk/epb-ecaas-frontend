import { getProduct } from "../../services/products";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const productId = parseInt(id ?? "");

	return await getProduct(productId);
});
