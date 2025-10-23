import { defineDriver } from "unstorage";
import {
	getItem as getSession,
	setItem as setSession,
} from "../api/dynamoDbQueries";

export default defineNitroPlugin(() => {
	const storage = useStorage();

	if (process.env.NODE_ENV === "production") {
		console.log("building custom driver");
		const driver = defineDriver(() => {
			return {
				name: "dynamoDb-driver",
				options: {},
				async hasItem(_key, _opts) {
					return false;
				},
				async getItem(key, _opts) {
					return getSession(key);
				},
				async setItem(key, value, _opts) {
					return setSession(key, value);
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