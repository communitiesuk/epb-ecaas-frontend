import { getGroupProducts, getProducts } from "../../services/products";
import type { TechnologyGroup, TechnologyType } from "~/pcdb/pcdb.types";

export default defineEventHandler(async (event) => {
	const { technologyType, technologyGroup, pageSize, startKey } = getQuery(event);

	if (technologyGroup) {
		return await getGroupProducts(technologyGroup as TechnologyGroup);
	}

	return await getProducts(
		technologyType as TechnologyType,
		pageSize ? parseInt(pageSize.toString()) : undefined,
		startKey?.toString());
});
