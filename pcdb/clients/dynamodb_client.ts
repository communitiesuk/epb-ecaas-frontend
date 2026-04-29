import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, TechnologyGroup, TechnologyType, VesselType } from "../pcdb.types";
import type { PcdbClient } from "./client.types";
import { DynamoDBDocumentClient, BatchGetCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { generateHeatNetworkSubNetworkDisplayProductCombinations } from "../utils/subheatnetwork-combination-display";

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
interface GetProductOptions {
	includeTestData: boolean;
	testDataId?: string;
}
export const dynamodbClient: PcdbClient = {
	async getProduct<T>(id: string, { includeTestData = false, testDataId }: GetProductOptions) {
		return await getProduct(id, { includeTestData, testDataId }) as T;
	},
	async getProductsByTechnologyType(technologyType, pageSize, startKey) {
		return await getProductsByTechnologyType(technologyType, pageSize, startKey);
	},
	async getProductsByTechnologyGroup(technologyGroup) {
		return await getProductsByTechnologyGroup(technologyGroup);
	},
};

const getProduct = async (id: string, { includeTestData = false, testDataId }: GetProductOptions) => {
	const result = await docClient.send(new GetCommand({
		TableName: "products",
		Key: { id },
	}));

	const { Item } = result;

	if (!includeTestData && !testDataId) {
		delete Item?.testData;
		delete Item?.testDataEN14825;
	}
	if (testDataId) {
		const testData = Array.isArray(Item?.testData) ? Item.testData as Record<string, unknown>[] : [];
		const match = testData.find((entry) => (entry.ID ?? entry.id)?.toString() === testDataId);

		if (Item && match) {
			Item.testData = match;
		}
		return Item;
	};

	return Item;
};

const toDisplayProduct = (item: Record<string, unknown>, fallbackTechnologyType?: TechnologyType): DisplayProduct | DisplayProduct[] | undefined => {
	const id = (item.id ?? item.ID)?.toString();
	if (!id) {
		return undefined;
	}

	const technologyType = (item.technologyType ?? fallbackTechnologyType) as TechnologyType;
	if (technologyType === "HeatNetworks") {
		return generateHeatNetworkSubNetworkDisplayProductCombinations(item);
	}
	if (technologyType === "ConvectorRadiator") {
		if (typeof item.type !== "string") {
			return undefined;
		}

		const height = typeof item.height === "number" ? item.height : typeof item.height === "string" ? parseFloat(item.height) : NaN;
		if (!isFinite(height)) {
			return undefined;
		}

		return {
			displayProduct: true,
			id,
			type: item.type,
			height,
			technologyType,
		};
	}

	return {
		displayProduct: true,
		id,
		brandName: typeof item.brandName === "string" ? item.brandName : "",
		modelName: typeof item.modelName === "string" ? item.modelName : "",
		modelQualifier: typeof item.modelQualifier === "string" ? item.modelQualifier : "",
		technologyType,
		...(item.backupCtrlType ? { backupCtrlType: item.backupCtrlType as string } : {}),
		...(item.powerMaxBackup ? { powerMaxBackup: item.powerMaxBackup as number } : {}),
		...(item.boilerLocation === "internal" || item.boilerLocation === "external" || item.boilerLocation === "unknown"
			? { boilerLocation: item.boilerLocation }
			: {}),
		...(typeof item.communityHeatNetworkName === "string" ? { communityHeatNetworkName: item.communityHeatNetworkName } : {}),
		...(item.boilerProductID ? { boilerProductID: item.boilerProductID.toString() } : {}),
		...(item.vesselType ? { vesselType: item.vesselType as VesselType } : {}),
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

const hydrateHeatNetworkItems = async (items: Record<string, unknown>[]) => {
	const keys = items
		.map(item => item.id ?? item.ID)
		.filter((key): key is string => key != null)
		.map(key => ({ id: key }));

	if (keys.length === 0) {
		return items;
	}

	const result = await docClient.send(new BatchGetCommand({
		RequestItems: {
			products: { Keys: keys },
		},
	}));

	const fetched = (result.Responses?.products ?? []) as Record<string, unknown>[];
	return fetched.length > 0 ? fetched : items;
};

const hydrateConvectorItems = async (items: Record<string, unknown>[]) => {
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
	let itemsToDisplay: Record<string, unknown>[];
	switch (technologyType) {
		case "ConvectorRadiator":
			itemsToDisplay = await hydrateConvectorItems(queryItems);
			break;
		case "HeatNetworks":
			itemsToDisplay = await hydrateHeatNetworkItems(queryItems);
			break;
		default:
			itemsToDisplay = queryItems;
	}


	const products = itemsToDisplay.flatMap(x => toDisplayProduct(x, technologyType) ?? []).filter((x): x is DisplayProduct => x !== undefined);

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

		products.push(...(result.Items?.flatMap(x => toDisplayProduct(x)).filter((x): x is DisplayProduct => x !== undefined) ?? []));

		lastEvaluationKey = result.LastEvaluatedKey;
	} while (lastEvaluationKey);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};