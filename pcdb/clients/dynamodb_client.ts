import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, TechnologyType } from "../pcdb.types";
import type { Command, Client } from "./client.types";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const localConfig = {
	region: "fakeRegion", 
	endpoint: "http://localhost:8000",
	credentials: {
		accessKeyId: "fakeMyKeyId",
		secretAccessKey: "fakeSecretAccessKey",
	},
};

const client = new DynamoDBClient(process.env.NODE_ENV === "development" ? localConfig : {});
const docClient = DynamoDBDocumentClient.from(client);

export const dynamodbClient: Client = async <
	T extends TechnologyType,
	U extends Command<T>,
>(
	query: U["input"],
): Promise<U["output"]> => {
	// Return sensible no-op values per command type
	if ("id" in query && "technologyType" in query) {
		// fullProductById → ProductForTechnology<T> | undefined
		return undefined as U["output"];
	}
	if ("id" in query) {
		// displayById → DisplayProduct | undefined
		return undefined as U["output"];
	}
	if ("startsWith" in query && "technologyType" in query) {
		// brandsStartingWith → string[]
		return [] as unknown as U["output"];
	}
	if ("startsWith" in query) {
		// modelsStartingWith → string[]
		return [] as unknown as U["output"];
	}
	if ("technologyType" in query) {
		const result = await docClient.send(new QueryCommand({
			TableName: "products",
			IndexName: "by-brand",
			KeyConditionExpression: "technologyType = :technologyType",
			ExpressionAttributeValues: { ":technologyType": query.technologyType },
			Limit: query.pageSize,
			...query.startKey && { ExclusiveStartKey: JSON.parse(query.startKey) },
		}));

		const products = result.Items?.map(x => {
			const product: DisplayProduct = {
				id: x.id as string,
				brandName: x.brandName as string,
				modelName: x.modelName as string,
				modelQualifier: x.modelQualifier as string,
				technologyType: x.technologyType as TechnologyType,
			};

			return product;
		}) ?? [];

		const paginatedProducts: PaginatedResult<DisplayProduct> = {
			data: products,
			lastEvaluationKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : undefined,
		};

		return paginatedProducts;
	}

	return undefined as U["output"];
};
