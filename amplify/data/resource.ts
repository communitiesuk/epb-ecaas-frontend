import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
    KeyValueStore: a.model({
        key: a.id(),
        value: a.json()
    }).authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: { expiresInDays: 30 }
    }
});
