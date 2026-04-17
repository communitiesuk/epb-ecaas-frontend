import { arrayIncludes } from "ts-extras";
import { createPcdbClient } from "~/pcdb/clients/pcdb_client";
import { technologyTypes, type Product, type DisplayProduct, type PaginatedResult, type TechnologyType, type TechnologyGroup, technologyGroups } from "~/pcdb/pcdb.types";

const client = createPcdbClient();

export async function getProducts(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	ensureValidTechnologyType(technologyType);

	return await client.getProductsByTechnologyType(technologyType, pageSize, startKey);
};

export async function getGroupProducts(technologyGroup: TechnologyGroup): Promise<PaginatedResult<DisplayProduct>> {
	if (!technologyGroup || !arrayIncludes(technologyGroups, technologyGroup as string)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product group",
		});
	}

	return await client.getProductsByTechnologyGroup(technologyGroup);
};

export async function getProductDetails(id: string, includeTestData: boolean = false): Promise<Product | undefined> {
	ensureValidProductId(id);

	const product = await client.getProduct(id, { includeTestData });

	ensureProductExists(product);

	return product;
};

const ensureValidTechnologyType = (technologyType: TechnologyType) => {
	if (!technologyType || !arrayIncludes(technologyTypes, technologyType as string)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product type",
		});
	}
};

const ensureValidProductId = (id: string) => {
	if (isNaN(parseInt(id))) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product ID",
		});
	}
};

const ensureProductExists = (product: object | undefined) => {
	if (!product) {
		throw createError({
			statusCode: 404,
			statusMessage: "Product not found",
		});
	}
};