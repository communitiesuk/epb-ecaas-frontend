import { arrayIncludes } from "ts-extras";
import { createPcdbClient } from "~/pcdb/clients/pcdb_client";
import { technologyTypes, type Product, type DisplayProduct, type PaginatedResult, type TechnologyType, type TechnologyGroup, technologyGroups } from "~/pcdb/pcdb.types";

export async function getProducts(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	ensureValidTechnologyType(technologyType);

	const client = createPcdbClient();

	return await client({
		technologyType,
		pageSize,
		startKey,
	}) as PaginatedResult<DisplayProduct>;
};

export async function getGroupProducts(technologyGroup: TechnologyGroup, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	if (!technologyGroup || !arrayIncludes(technologyGroups, technologyGroup as string)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product group",
		});
	}

	const client = createPcdbClient();

	return await client({
		technologyGroup,
		pageSize,
		startKey,
	}) as PaginatedResult<DisplayProduct>;
};

export async function getProductDetails(id: number): Promise<Product | undefined> {
	ensureValidProductId(id);

	const client = createPcdbClient();

	const product = await client({ id }) as Product | undefined;

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

const ensureValidProductId = (id: number) => {
	if (isNaN(id)) {
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