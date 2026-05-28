import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DisplayProduct, PaginatedResult, Product, TechnologyGroup, TechnologyType, VesselType } from "../pcdb.types";
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
	async getProductsByIds(ids) {
		return await getProductsByIds(ids);
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

const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
	const uniqueIds = Array.from(new Set(ids));
	const chunks: string[][] = [];

	for (let index = 0; index < uniqueIds.length; index += 100) {
		chunks.push(uniqueIds.slice(index, index + 100));
	}

	const products: Record<string, unknown>[] = [];

	for (const chunk of chunks) {
		let pendingKeys = chunk.map(id => ({ id }));

		while (pendingKeys.length > 0) {
			const result = await docClient.send(new BatchGetCommand({
				RequestItems: {
					products: { Keys: pendingKeys },
				},
			}));

			products.push(...((result.Responses?.products ?? []) as Record<string, unknown>[]));
			pendingKeys = (result.UnprocessedKeys?.products?.Keys as { id: string }[] | undefined) ?? [];
		}
	}

	return products as Product[];
};

const toDisplayProduct = (item: Record<string, unknown>, fallbackTechnologyType?: TechnologyType): DisplayProduct | DisplayProduct[] | undefined => {
	const id = (item.id ?? item.ID)?.toString();
	if (!id) {
		return undefined;
	}

	const technologyType = (item.technologyType ?? fallbackTechnologyType) as TechnologyType;
	if (!technologyType) return undefined;

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

	if (technologyType === "UnderFloorHeating") {
		if (typeof item.systemName !== "string") return undefined;
		if (typeof item.floorFinishCompatibility !== "string") return undefined;
		if (typeof item.pipeCentres !== "number") return undefined;

		return {
			displayProduct: true,
			id,
			systemName: item.systemName,
			floorFinishCompatibility: item.floorFinishCompatibility,
			pipeCentres: item.pipeCentres,
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

const hasUnderfloorHeatingDisplayFields = (item: Record<string, unknown>) => {
	if (typeof item.systemName !== "string") return false;
	if (typeof item.floorFinishCompatibility !== "string") return false;

	const pipeCentres =
		typeof item.pipeCentres === "number"
			? item.pipeCentres
			: typeof item.pipeCentres === "string"
				? parseFloat(item.pipeCentres)
				: NaN;

	if (!isFinite(pipeCentres)) return false;

	return true;
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

const hydrateUnderfloorHeatingItems = async (items: Record<string, unknown>[]) => {
	return await Promise.all(items.map(async (item) => {
		if (hasUnderfloorHeatingDisplayFields(item)) {
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
	console.log("Query result:", result.Count, result.Items?.length);
	const queryItems = result.Items ?? [];
	let itemsToDisplay: Record<string, unknown>[];
	switch (technologyType) {
		case "HeatNetworks":
			itemsToDisplay = await hydrateHeatNetworkItems(queryItems);
			break;
		case "UnderFloorHeating":
			itemsToDisplay = await hydrateUnderfloorHeatingItems(queryItems);
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
		console.log("Query result:", result);
		products.push(...(result.Items?.flatMap(x => toDisplayProduct(x)).filter((x): x is DisplayProduct => x !== undefined) ?? []));

		lastEvaluationKey = result.LastEvaluatedKey;
	} while (lastEvaluationKey);

	const paginatedProducts: PaginatedResult<DisplayProduct> = {
		data: products,
	};

	return paginatedProducts;
};