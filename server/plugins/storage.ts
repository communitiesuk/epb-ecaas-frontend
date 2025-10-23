import { defineDriver } from "unstorage";
import {
	getSessionData,
	setSessionData,
} from "../api/dynamoDbQueries";

export default defineNitroPlugin(() => {
	const storage = useStorage();
	
	if (process.env.NODE_ENV === "production") {
		console.log("building custom dynamo DB driver");
		const driver = defineDriver((options) => {
			return {
				name: "dynamoDb-driver",
				options,
				async hasItem(_key, _opts) {
					return false;
				},
				async getItem(key, _opts) {
					return getSessionData(key);
				},
				async setItem(key, value, _opts) {
					return setSessionData(key, value);
				},
				// async removeItem(key, _opts) {},
				async getKeys(_base, _opts) {
					return [];
				},
			// async clear(base, _opts) {},
			// async dispose() {},
			// async watch(callback) {},
			};
		})({});

		storage.mount("cache", driver);
	}
});
