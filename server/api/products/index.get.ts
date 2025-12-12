import { getProducts } from "../../services/products";
import type { TechnologyType } from "~/pcdb/pcdb.types";

export default defineEventHandler(async (event) => {
	const { technologyType, pageSize, startKey } = getQuery(event);

	return await getProducts(
		technologyType as TechnologyType,
		pageSize ? parseInt(pageSize.toString()) : undefined,
		startKey?.toString());
});
