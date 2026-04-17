import { beforeEach, describe, expect, it } from "vitest";
import { getGroupProducts, getProductDetails, getProducts } from "./products";
import type { TechnologyGroup, TechnologyType } from "~/pcdb/pcdb.types";
import type { H3Error } from "h3";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import products from "@/pcdb/data/products.json";
import { dynamodbClient } from "~/pcdb/clients/dynamodb_client";

describe("Products service", () => {
	const ddbMock = mockClient(DynamoDBDocumentClient);

	beforeEach(() => {
		ddbMock.reset();
	});

	describe("Get products", () => {
		it("Returns bad request error when technology type is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProducts("invalid type" as TechnologyType);
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Invalid product type",
			});
		});

		it("Returns products by technology type", async () => {
			// Arrange
			const technologyType: TechnologyType = "AirSourceHeatPump";
			const airSourceHeatPumps = products.filter(p => p.technologyType === technologyType);

			ddbMock.on(QueryCommand, {
				TableName: "products",
				IndexName: "by-technology-type",
				KeyConditionExpression: "technologyType = :technologyType",
				ExpressionAttributeValues: { ":technologyType": technologyType },
			}).resolves({
				Items: airSourceHeatPumps,
			});

			// Act
			const result = await getProducts(technologyType);

			// Assert
			expect(result.data).toStrictEqual(airSourceHeatPumps.map(x => ({
				displayProduct: true,
				id: x.id,
				brandName: x.brandName,
				modelName: x.modelName,
				modelQualifier: x.modelQualifier,
				technologyType,
				...(x.backupCtrlType ? { backupCtrlType: x.backupCtrlType } : {}),
				...(x.powerMaxBackup ? { powerMaxBackup: x.powerMaxBackup } : {}),
			})));
		});

		it("Hydrates ConvectorRadiator products when query projection omits radiator fields", async () => {
			// Arrange
			const technologyType: TechnologyType = "ConvectorRadiator";
			const projectedQueryItems = [{ id: "58" }];
			const fullRadiator = {
				id: "58",
				technologyType,
				type: "T33",
				height: 700,
			};
			// first we list the product ids for the technology type, then we get the full product details for each radiator to hydrate the display product fields
			ddbMock.on(QueryCommand, {
				TableName: "products",
				IndexName: "by-technology-type",
				KeyConditionExpression: "technologyType = :technologyType",
				ExpressionAttributeValues: { ":technologyType": technologyType },
			}).resolves({
				Items: projectedQueryItems,
			});
			// this will be simplified when we can query by convector radiator type and height to avoid the need for hydration
			ddbMock.on(GetCommand, {
				TableName: "products",
				Key: { id: "58" },
			}).resolves({
				Item: fullRadiator,
			});

			// Act
			const result = await getProducts(technologyType);

			// Assert
			expect(result.data).toStrictEqual([
				{
					displayProduct: true,
					id: "58",
					technologyType,
					type: "T33",
					height: 700,
				},
			]);
		});

		it("Returns bad request error when technology group is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getGroupProducts("invalid type" as TechnologyGroup);
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Invalid product group",
			});
		});

		it("Returns products by technology group", async () => {
			const technologyGroup: TechnologyGroup = "heatPump";
			const mockedProducts = products.filter(x => x.technologyGroup === technologyGroup);

			ddbMock.on(QueryCommand).resolves({
				Items: mockedProducts,
			});

			const result = await getGroupProducts("heatPump");

			expect(result.data).toStrictEqual(mockedProducts.map(x => ({
				displayProduct: true,
				id: x.id,
				brandName: x.brandName,
				modelName: x.modelName,
				modelQualifier: x.modelQualifier,
				technologyType: x.technologyType,
				...(x.backupCtrlType ? { backupCtrlType: x.backupCtrlType } : {}),
				...(x.powerMaxBackup ? { powerMaxBackup: x.powerMaxBackup } : {}),
			})));
		});
	});
	describe("Get product with options", () => {
		it("Returns product with matching test data entry when testDataId is provided", async () => {
			// Arrange
			const productId = "network-123";
			const testDataId = "td-2";
			const productFromTestData = {
				id: productId,
				technologyType: "HeatNetworks",
				communityHeatNetworkName: "Network Alpha",
				testData: { ID: testDataId, subheatNetworkName: "Sub 2" },
			};

			ddbMock.on(GetCommand, {
				TableName: "products",
				Key: { id: productId },
			}).resolves({
				Item: {
					id: productId,
					technologyType: "HeatNetworks",
					communityHeatNetworkName: "Network Alpha",
					testData: [
						{ ID: "td-1", subheatNetworkName: "Sub 1" },
						{ ID: testDataId, subheatNetworkName: "Sub 2" },
					],
				},
			});

			// Act
			const result = await dynamodbClient.getProduct(productId, { includeTestData: false, testDataId });

			// Assert
			expect(result).toStrictEqual(productFromTestData);
		});
	});
	describe("Get display product", async () => {
		it("Returns bad request error when product ID is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProductDetails("");
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Invalid product ID",
			});
		});

		it("Returns not found error when product does not exist", async () => {
			// Arrange
			ddbMock.on(GetCommand).resolves({ Item: undefined });
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProductDetails("1");
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 404,
				statusMessage: "Product not found",
			});
		});

		it("Returns display product when product ID is valid", async () => {
			// Arrange
			const product = products.find(p => p.id === "1234");
			ddbMock.on(GetCommand).resolves({ Item: product });

			// Act
			const result = await getProductDetails("1234");

			// Assert
			expect(result).toStrictEqual(product);
		});
	});

	describe("Get product details", async () => {
		it("Returns bad request error when product ID is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProductDetails("");
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Invalid product ID",
			});
		});

		it("Returns not found error when product does not exist", async () => {
			// Arrange
			ddbMock.on(GetCommand).resolves({ Item: undefined });
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProductDetails("1");
			} catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 404,
				statusMessage: "Product not found",
			});
		});

		it("Returns product details when product ID is valid", async () => {
			// Arrange
			const product = products.find(p => p.id === "1234");
			ddbMock.on(GetCommand).resolves({ Item: product });

			// Act
			const result = await getProductDetails("1234");

			// Assert
			expect(result).toStrictEqual(product);
		});
	});
});