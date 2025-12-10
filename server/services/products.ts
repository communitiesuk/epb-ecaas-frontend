import { arrayIncludes } from "ts-extras";
import { technologyTypes, type DisplayProduct, type PaginatedResult, type TechnologyType } from "~/pcdb/pcdb.types";
import { createPcdbClient } from "~/pcdb/clients/pcdb_client";

export async function getProducts(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	if (!technologyType || !arrayIncludes(technologyTypes, technologyType as string)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Expected a technology type query parameter.",
		});
	}

	const client = createPcdbClient();

	return await client({
		technologyType,
		pageSize,
		startKey,
	}) as PaginatedResult<DisplayProduct>;
}