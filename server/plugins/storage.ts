import { defineDriver } from "unstorage";
import { getSessionData, setSessionData } from "../utils/dynamoDbQueries";

export default defineNitroPlugin(() => {
	const storage = useStorage();

	const driver = defineDriver(() => {

		return {
			name: "dynamoDb-driver",
			async hasItem(_key, _opts) {
				return false;
			},
			async getItem(key, _opts) {
				return getSessionData(key);
			},
			async setItem(key, value, opts) {
				return setSessionData(key, value, opts.ttl);
			},
			async getKeys(_base, _opts) {
				return [];
			},
		};
	})({});

	storage.mount("dynamo", driver);
});
