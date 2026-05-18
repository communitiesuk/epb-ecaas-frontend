import { getProductsBatch } from "~/server/services/products";

const parseIds = (queryIds: string | undefined) => {
	if (!queryIds) {
		return [];
	}

	return queryIds?.split(",")
		.map(id => id.trim())
		.filter(id => id.length > 0);
};

export default defineEventHandler(async (event) => {
	const { ids } = getQuery(event);
	const parsedIds = parseIds(ids as string | undefined);

	if (parsedIds.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing product IDs",
		});
	}

	return await getProductsBatch(parsedIds);
});
