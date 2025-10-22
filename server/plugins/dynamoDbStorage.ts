import { createStorage, defineDriver } from "unstorage";
import {
  getItem as getSession,
  setItem as setSession,
} from "../api/dynamoDbQueries";

export default defineNitroPlugin(() => {
  const storage = useStorage();

  if (process.env.NODE_ENV === "production") {
    const driver = defineDriver(() => {
      return {
        name: "dynamoDb-driver",
        options: {},
        async hasItem(key, _opts) {
          return false;
        },
        async getItem(key, _opts) {
          return getSession("test-me");
        },
        async setItem(key, value, _opts) {
          return setSession("test-me", {});
        },
        // async removeItem(key, _opts) {},
        async getKeys(base, _opts) {
          return [];
        },
        // async clear(base, _opts) {},
        // async dispose() {},
        // async watch(callback) {},
      };
    });
    // storage.mount("cache", driver);
  }
});