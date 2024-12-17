import { defineBackend } from '@aws-amplify/backend';
import { data } from "./data/resource";

const backend = defineBackend({
    data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables["KeyValueStore"].timeToLiveAttribute = {
    attributeName: "ttl",
    enabled: true
};
