import type { TechnologyType } from "~/pcdb/pcdb.types";
import { getProductDetails } from "~/server/services/products";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const productId = parseInt(id ?? "");
	const { technologyType } = getQuery(event);

	return await getProductDetails(productId, technologyType as TechnologyType);
});