import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
	region: "fakeRegion",
	endpoint: "http://localhost:8000",
});
client.config.credentials({
	accessKeyId: "fakeMyKeyId",
	secretAccessKey: "fakeSecretAccessKey",
});
const docClient = DynamoDBDocumentClient.from(client);

export async function getItem(key: string): Promise<Record<string, unknown> | undefined> {
	const { Item: item } = await docClient.send(
		new GetCommand({
			TableName: "Sessions",
			Key: { Sessionid: key },
		}),
	);

	return item;
}

export async function setItem(
	key: string,
	value: string,
) {
	await docClient.send(
		new PutCommand({
			TableName: "Sessions",
			Item: {
				Sessionid: key,
				Ecaas: value,
			},
		}),
	);
}

// console.log(
// 	setItem("123", '{"data":"data"}').then((data) => {
// 		console.log(data);
// 	}),
// );

// console.log(
// 	getItem("123").then((data) => {
// 		console.log(data);
// 	}),
// );
 