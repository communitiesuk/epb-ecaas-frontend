import {
  runWithAmplifyServerContext,
} from "aws-amplify/adapter-core";
import { generateClient } from "aws-amplify/data/server";
import { parseAmplifyConfig } from "aws-amplify/utils";
import type {
    GraphQLOptionsV6,
    GraphQLResponseV6,
} from "@aws-amplify/api-graphql";
import { defineDriver } from "unstorage";
import { EcaasState } from "~/stores/ecaasStore.types";
import outputs from "~/amplify_outputs.json";

const amplifyConfig = parseAmplifyConfig(outputs);

const gqlServerClient = generateClient({ config: amplifyConfig });

const graphql = <
    FALLBACK_TYPES = unknown,
    TYPED_GQL_STRING extends string = string
    >(
    options: GraphQLOptionsV6<FALLBACK_TYPES, TYPED_GQL_STRING>,
    additionalHeaders?: Record<string, string>
    ) =>
    runWithAmplifyServerContext<
    GraphQLResponseV6<FALLBACK_TYPES, TYPED_GQL_STRING>
    >(amplifyConfig, {}, (contextSpec) =>
    gqlServerClient.graphql(
        contextSpec,
        options,
        additionalHeaders
    )
);

// make a custom driver for unstorage
const amplifyDataDriver = defineDriver((options) => {
    console.error(Object.getOwnPropertyNames(graphql));
    const store = graphql.models.KeyValueStore;

    return {
        name: "amplify-data-driver",
        options,
        async hasItem(key, _opts) {
            return store.get(key).then((data: EcaasState | null) => !!data);
        },
        async getItem(key, _opts) {
            return store.get(key);
        },
        async setItem(key, value, _opts) {
            await this.removeItem(key, _opts);
            return store.create({key, value});
        },
        async removeItem(key, _opts) {
            return store.delete({key});
        },
        async getKeys(base, _opts) {
            return store.list().then((data: any[]) => data.map((entry: { key: any; }) => entry.key));
        },
        async clear(base, _opts) {
            return store.delete();
        },
        async dispose() {
            // tbc
        },
        async watch(callback) {
            // tbc
        },
      };
});

export default amplifyDataDriver;