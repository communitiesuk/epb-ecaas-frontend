import { dynamodbClient } from "~/pcdb/clients/dynamodb_client";
//import { noopClient } from "./../../pcdb/clients/no-op_client";
import type { DisplayProduct, PaginatedResult, TechnologyType } from "~/pcdb/pcdb.types";

export async function productsByTechnologyType(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>> {
	/*const result = await noopClient({
		technologyType,
		pageSize,
		startKey,
	});*/

	const result = await dynamodbClient({
		technologyType,
		pageSize,
		startKey,
	});

	return result as PaginatedResult<DisplayProduct>;
}