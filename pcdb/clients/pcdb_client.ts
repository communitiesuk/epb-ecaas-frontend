import type { Client } from "./client.types";
import { dynamodbClient } from "./dynamodb_client";
import { noopClient } from "./no-op_client";

export const createPcdbClient = (): Client => {
	if (process.env.NODE_ENV === "development" && !process.env.LOCAL_DYNAMODB_ENDPOINT) {
		return noopClient;
	}

	return dynamodbClient;
};