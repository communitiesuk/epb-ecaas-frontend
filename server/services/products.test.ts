import { beforeEach, describe, expect, it } from "vitest";
import { getProducts } from "./products";
import type  { TechnologyType } from "~/pcdb/pcdb.types";
import type { H3Error } from "h3";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import products from "@/pcdb/data/products.json";

describe("Products service", () => {
	const ddbMock = mockClient(DynamoDBDocumentClient);

	beforeEach(() => {
		ddbMock.reset();
	});

	describe("Get products", () => {
		it("Returns bad request error when technology type is invalid", async () => {
			let h3Error: H3Error | undefined;

			try {
				await getProducts("invalid type" as TechnologyType);
			}
			catch (error) {
				h3Error = error as H3Error;
			}

			expect(h3Error?.cause).toStrictEqual({
				statusCode: 400,
				statusMessage: "Expected a technology type query parameter.",
			});
		});

		it("Returns products by technology type", async () => {
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

			const result = await getProducts(technologyType);

			expect(result.data).toStrictEqual(airSourceHeatPumps.map(x => ({
				id: x.id,
				brandName: x.brandName,
				modelName: x.modelName,
				modelQualifier: x.modelQualifier,
				technologyType,
			})));
		});
	});
});