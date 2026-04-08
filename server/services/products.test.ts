import { beforeEach, describe, expect, it } from "vitest";
import { getGroupProducts, getProductDetails, getProducts } from "./products";
import type { TechnologyGroup, TechnologyType } from "~/pcdb/pcdb.types";
import type { H3Error } from "h3";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import products from "@/pcdb/data/products.json";

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

			ddbMock.on(QueryCommand, {
				TableName: "products",
				IndexName: "by-technology-type",
				KeyConditionExpression: "technologyType = :technologyType",
				ExpressionAttributeValues: { ":technologyType": technologyType },
			}).resolves({
				Items: projectedQueryItems,
			});

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
				id: x.id,
				brandName: x.brandName,
				modelName: x.modelName,
				modelQualifier: x.modelQualifier,
				technologyType: x.technologyType,
			})));
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