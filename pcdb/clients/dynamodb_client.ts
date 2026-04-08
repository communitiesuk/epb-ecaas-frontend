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
	async getProduct<T>(id: string, includeTestData: boolean) {
		return await getProduct(id, includeTestData) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return await getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return await getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = async (id: string, includeTestData: boolean) => {
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

const toDisplayProduct = (item: Record<string, unknown>, fallbackTechnologyType?: TechnologyType): DisplayProduct | undefined => {
	const id = (item.id ?? item.ID)?.toString();
	if (!id) {
		return undefined;
	}

	const technologyType = (item.technologyType ?? fallbackTechnologyType) as TechnologyType;

	if (technologyType === "ConvectorRadiator") {
		if (typeof item.type !== "string") {
			return undefined;
		}

		const height = typeof item.height === "number" ? item.height : typeof item.height === "string" ? parseFloat(item.height) : NaN;
		if (!isFinite(height)) {
			return undefined;
		}

		return {
			id,
			type: item.type,
			height,
			technologyType,
		};
	}

	return {
		id,
		brandName: typeof item.brandName === "string" ? item.brandName : "",
		modelName: typeof item.modelName === "string" ? item.modelName : "",
		modelQualifier: typeof item.modelQualifier === "string" ? item.modelQualifier : null,
		technologyType,
		...(item.backupCtrlType ? { backupCtrlType: item.backupCtrlType as string } : {}),
		...(item.powerMaxBackup ? { powerMaxBackup: item.powerMaxBackup as number } : {}),
		...(item.boilerLocation === "internal" || item.boilerLocation === "external" || item.boilerLocation === "unknown"
			? { boilerLocation: item.boilerLocation }
			: {}),
		...(typeof item.communityHeatNetworkName === "string" ? { communityHeatNetworkName: item.communityHeatNetworkName } : {}),
		...(typeof item.boilerProductID === "string" ? { boilerProductID: item.boilerProductID } : {}),
	};
};

const hasConvectorDisplayFields = (item: Record<string, unknown>) => {
	if (typeof item.type !== "string") {
		return false;
	}

	const parsedHeight = typeof item.height === "number"
		? item.height
		: typeof item.height === "string"
			? parseFloat(item.height)
			: NaN;

	return isFinite(parsedHeight);
};

const hydrateConvectorItems = async (items: Record<string, unknown>[]) => {
	console.log(`Hydrating ${items.length} ConvectorRadiator items`, { items });
	return await Promise.all(items.map(async (item) => {
		if (hasConvectorDisplayFields(item)) {
			return item;
		}

		const key = item.id ?? item.ID;
		if (key == null) {
			return item;
		}

		const result = await docClient.send(new GetCommand({
			TableName: "products",
			Key: { id: key },
		}));

		return (result.Item as Record<string, unknown> | undefined) ?? item;
	}));
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

	const queryItems = result.Items ?? [];
	const itemsToDisplay = technologyType === "ConvectorRadiator"
		? await hydrateConvectorItems(queryItems)
		: queryItems;

	const products = itemsToDisplay.map(x => toDisplayProduct(x, technologyType)).filter((x): x is DisplayProduct => x !== undefined);

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

		products.push(...(result.Items?.map(x => toDisplayProduct(x)).filter((x): x is DisplayProduct => x !== undefined) ?? []));

		lastEvaluationKey = result.LastEvaluatedKey;
	} while (lastEvaluationKey);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};