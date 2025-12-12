import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, TechnologyType } from "../pcdb.types";
import type { Command, Client, DisplayTechnologyProducts, DisplayById } from "./client.types";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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
		return await getProductById(query);
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
		return await getProductsByTechnologyType(query);
	}

	return undefined as U["output"];
};

const getProductById = async <U extends DisplayById>(query: U["input"]): Promise<U["output"]> => {
	const result = await docClient.send(new GetCommand({
		TableName: "products",
		Key: { id: query.id },
	}));

	const { Item } = result;

	if (!Item) {
		return undefined;
	}

	const product: DisplayProduct = {
		id: Item.id as string,
		brandName: Item.brandName as string,
		modelName: Item.modelName as string,
		modelQualifier: Item.modelQualifier as string,
		technologyType: Item.technologyType as TechnologyType,
	};

	return product;
};

const getProductsByTechnologyType = async <U extends DisplayTechnologyProducts>(query: U["input"]): Promise<U["output"]> => {
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
};