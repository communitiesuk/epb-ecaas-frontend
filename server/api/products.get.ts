import { arrayIncludes } from "ts-extras";
import { productsByTechnologyType } from "../services/products";
import type { TechnologyType } from "~/pcdb/pcdb.types";
import { technologyTypes } from "~/pcdb/pcdb.types";

export default defineEventHandler(async (event) => {

	const { technologyType, pageSize, startKey } = getQuery(event);

	if (!technologyType || !arrayIncludes(technologyTypes, technologyType)) {
		throw createError({ statusCode: 400, statusMessage: "Expected a technology type query parameter." });
	}

	return await productsByTechnologyType(
		technologyType as TechnologyType,
		pageSize ? parseInt(pageSize.toString()) : undefined,
		startKey?.toString());
});
