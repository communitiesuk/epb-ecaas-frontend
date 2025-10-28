import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";

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
