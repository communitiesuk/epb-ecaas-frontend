import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType } from "../pcdb.types";
import type { PcdbClient } from "./client.types";
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

export const dynamodbClient: PcdbClient = {
	async getProduct<T>(id: number, includeTestData: boolean) {
		return await getProduct(id, includeTestData) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return await getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return await getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = async (id: number, includeTestData: boolean) => {
	const result = await docClient.send(new GetCommand({
		TableName: "products",
		Key: { id },
	}));

	const { Item } = result;

	if (!includeTestData) {
		delete Item?.testData;
		delete Item?.testDataEN14825;
	}

	return Item;
};

const getProductsByTechnologyType = async (technologyType: TechnologyType, pageSize?: number, startKey?: string) => {
	const result = await docClient.send(new QueryCommand({
		TableName: "products",
		IndexName: "by-technology-type",
		KeyConditionExpression: "technologyType = :technologyType",
		ExpressionAttributeValues: { ":technologyType": technologyType },
		Limit: pageSize,
		...startKey && { ExclusiveStartKey: JSON.parse(startKey) },
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

const getProductsByTechnologyGroup = async (technologyGroup: TechnologyGroup) => {
	const products: DisplayProduct[] = [];
	let lastEvaluationKey: Record<string, unknown> | undefined;

	do {
		const result = await docClient.send(new QueryCommand({
			TableName: "products",
			IndexName: "by-technology-group",
			KeyConditionExpression: "technologyGroup = :technologyGroup",
			ExpressionAttributeValues: { ":technologyGroup": technologyGroup },
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