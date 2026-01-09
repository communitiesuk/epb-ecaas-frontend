import { beforeEach, describe, expect, it } from "vitest";
import { getProduct, getProductDetails, getProducts } from "./products";
import type  { TechnologyType } from "~/pcdb/pcdb.types";
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
			}
			catch (error) {
				h3Error = error as H3Error;
			}

			// Assert
			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Expected a technology type query parameter.",
			});
		});

		it("Returns products by technology type", async () => {
			// Arrange
			const technologyType: TechnologyType = "air source heat pumps";
			const airSourceHeatPumps = products.filter(p => p.technologyType === technologyType);

			ddbMock.on(QueryCommand, {
				TableName: "products",
				IndexName: "by-brand",
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
			})));
		});
	});

	describe("Get display product", async () => {
		it("Returns bad request error when product ID is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProduct(NaN);
			}
			catch (error) {
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
				await getProduct(1);
			}
			catch (error) {
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
			const result = await getProduct(1234);
			const { id, brandName, modelName, modelQualifier, technologyType } = result!;

			// Assert
			expect(result).toStrictEqual({
				id,
				brandName,
				modelName,
				modelQualifier,
				technologyType,
			});
		});
	});

	describe("Get product details", async () => {
		it("Returns bad request error when product ID is invalid", async () => {
			// Arrange
			let h3Error: H3Error | undefined;

			// Act
			try {
				await getProductDetails(NaN, "air source heat pumps");
			}
			catch (error) {
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
				await getProductDetails(1, "air source heat pumps");
			}
			catch (error) {
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
			const result = await getProductDetails(1234, "air source heat pumps");

			// Assert
			expect(result).toStrictEqual(product);
		});
	});
});