import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
	region: process.env.DYNAMODB_REGION ?? useRuntimeConfig().dynamodbRegion,
	endpoint: process.env.DYNAMODB_ENDPOINT ?? useRuntimeConfig().dynamodbEndpoint,
});
client.config.credentials({
	accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID ?? useRuntimeConfig().dynamodbEndpoint,
	secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY ?? useRuntimeConfig().dynamodbEndpoint,
});
const docClient = DynamoDBDocumentClient.from(client);

export async function getSessionData(key: string): Promise<string | undefined> {
	const { Item: item } = await docClient.send(
		new GetCommand({
			TableName: "sessions",
			Key: { session_id: key },
		}),
	);
	return item?.ecaas;
}

export async function setSessionData(
	key: string,
	value: string,
	timeToLive: number | undefined,
) {
	await docClient.send(
		new PutCommand({
			TableName: "sessions",
			Item: {
				session_id: key,
				ecaas: value,
				...(timeToLive ? { ttl: timeToLive } : {}),
			},
		}),
	);
}