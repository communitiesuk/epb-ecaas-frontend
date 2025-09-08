import { arrayIncludes } from "ts-extras";
import { productsInCategory } from "../services/products";
import { knownCategories } from "~/pcdb/products";

export default defineEventHandler(async (event) => {

	const { category } = getQuery(event);

	if (!category || !arrayIncludes(knownCategories, category)) {
		throw createError({ statusCode: 400, statusMessage: "Expected a category query parameter." });
	}

	return await productsInCategory(category);
});
