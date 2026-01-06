import { arrayIncludes } from "ts-extras";
import { createPcdbClient } from "~/pcdb/clients/pcdb_client";
import { technologyTypes, type Product, type DisplayProduct, type PaginatedResult, type TechnologyType } from "~/pcdb/pcdb.types";

export async function getProducts(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	ensureValidTechnologyType(technologyType);

	const client = createPcdbClient();

	return await client({
		technologyType,
		pageSize,
		startKey,
	}) as PaginatedResult<DisplayProduct>;
};

export async function getProduct(id: number): Promise<DisplayProduct | undefined> {
	ensureValidProductId(id);

	const client = createPcdbClient();

	const product = await client({ id }) as DisplayProduct | undefined;

	ensureProductExists(product);

	return product;
};

export async function getProductDetails(id: number, technologyType: TechnologyType): Promise<Product | undefined> {
	ensureValidProductId(id);
	ensureValidTechnologyType(technologyType);

	const client = createPcdbClient();

	const product = await client({ id, technologyType }) as Product | undefined;

	ensureProductExists(product);

	return product;
};

const ensureValidTechnologyType = (technologyType: TechnologyType) => {
	if (!technologyType || !arrayIncludes(technologyTypes, technologyType as string)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Expected a technology type query parameter.",
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