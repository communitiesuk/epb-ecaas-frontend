import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, TechnologyType } from "../pcdb.types";
import type { Command, Client, DisplayTechnologyProducts, DisplayTechnologyGroupProducts } from "./client.types";
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
	if ("id" in query) {
		return await getProductDetailsById(query) as U["output"];
	}
	if ("technologyType" in query) {
		return getProductsByTechnologyType(query);
	}
	if ("technologyGroup" in query) {
		return getProductsByTechnologyGroup(query);
	}

	return undefined as U["output"];
};

const getProductDetailsById = async (query: { id: number; }) => {
	const result = await docClient.send(new GetCommand({
		TableName: "products",
		Key: { id: query.id },
	}));

	const { Item } = result;

	delete Item?.testData;
	delete Item?.testDataEN14825;

	return Item;
};

const getProductsByTechnologyType = async <U extends DisplayTechnologyProducts>(query: U["input"]): Promise<U["output"]> => {
	const result = await docClient.send(new QueryCommand({
		TableName: "products",
		IndexName: "by-technology-type",
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
			...(x.backupCtrlType ? { backupCtrlType: x.backupCtrlType as string } : {}),
			...(x.powerMaxBackup ? { powerMaxBackup: x.powerMaxBackup as number } : {}),
			...(x.boilerLocation ? { boilerLocation: x.boilerLocation } : {}),
			...(x.communityHeatNetworkName ? { communityHeatNetworkName: x.communityHeatNetworkName } : null),
		};

		return product;
	}) ?? [];

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
		lastEvaluationKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : undefined,
	};

	return paginatedProducts;
};

const getProductsByTechnologyGroup = async <U extends DisplayTechnologyGroupProducts>(query: U["input"]): Promise<U["output"]> => {
	const products: DisplayProduct[] = [];
	let lastEvaluationKey: Record<string, unknown> | undefined;

	do {
		const result = await docClient.send(new QueryCommand({
			TableName: "products",
			IndexName: "by-technology-group",
			KeyConditionExpression: "technologyGroup = :technologyGroup",
			ExpressionAttributeValues: { ":technologyGroup": query.technologyGroup },
			...lastEvaluationKey && { ExclusiveStartKey: lastEvaluationKey },
		}));

		products.push(...(result.Items?.map(x => {
			const product: DisplayProduct = {
				id: x.id as string,
				brandName: x.brandName as string,
				modelName: x.modelName as string,
				modelQualifier: x.modelQualifier as string,
				technologyType: x.technologyType as TechnologyType,
				...(x.boilerLocation ? { boilerLocation: x.boilerLocation } : {}),
				...(x.communityHeatNetworkName ? { communityHeatNetworkName: x.communityHeatNetworkName } : null),
			};

			return product;
		}) ?? []));

		lastEvaluationKey = result.LastEvaluatedKey;
	} while (lastEvaluationKey);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};