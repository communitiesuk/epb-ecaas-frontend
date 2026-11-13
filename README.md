![test status](https://github.com/communitiesuk/epb-ecaas-frontend/actions/workflows/test.yml/badge.svg)

# EPB ECaaS Front-end

This is the codebase for the ECaaS front-end which acts as a user-interface for the ECaaS API to check part L building compliance.

The project is built using a combination of Nuxt, VueJS, FormKit (for forms) and TypeScript. This is to leverage the server-side rendering capabilities of Nuxt, whilst providing responsive UI components.

[Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)\
[VueJS documentation](https://vuejs.org/guide/introduction)\
[FormKit documentation](https://formkit.com/getting-started/what-is-formkit)

## Getting Started

### Prerequisites

- Node.js - 22.x or newer (but we recommend the active LTS release)
- One of these JavaScript package managers: `npm`, `yarn`, `bun` or `pnpm`
- See an up-to-date list of [Nuxt prerequisites](https://nuxt.com/docs/getting-started/installation#prerequisites)

### Setup

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Environment Variables

The following environment variables are required to perform a calculation. These can be set locally using a .env file in the project root.

| Environment Variable  | Description                     |
| --------------------- | ------------------------------- |
| `CLIENT_ID`           | ECaaS API client ID             |
| `CLIENT_SECRET`       | ECaaS API client secret         |
| `ECAAS_AUTH_API_URL`  | ECaaS authentication server URL |
| `ECAAS_API_URL`       | ECaaS API URL                   |


### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Components
Many common UI components have been abstracted in an attempt to make code and components as reusable as possible. These primarily include:

- Fields: Form inputs inclusive of label, corresponding help text, validation etc.
- Gov: VueJS versions of GovUK components
- FormKit: Custom FormKit components

## Composables
Composables contain reusable functionality which depend on Vue/Nuxt features such as reactivity, or access to state management.

## Routing
Routing is automatically handled by Nuxt using the file structure in the ./pages directory. However, breadcrumbs and links are generated using the data in `./data/pages/pages.ts`.
Each page has an id, title, url, type and parent Id. When rendering a link to a page, rather than hardcoding the link, there is a `page` utility function in pages.ts which takes a page Id as a parameter. This should be the preferred way of retrieving page URLs so that if any need to be changed, it can be done in a single place rather than across the codebase.

## Mapping
The mapping folder contains functionality to map data saved in the store to the FHS schema. Each section of the Check Part L tool has a corresponding mapping file.

## Pages

This is where the pages and forms for Check Part L live. The file and folder structure forms the URLs of each page. Each page should have a corresponding test file containing component / unit tests for that page.

## PCDB

The PCDB data is stored in DynamoDB which can be setup locally following instructions [here](https://github.com/communitiesuk/epb-ecaas-pcdb-sync).

Communication with the database is done server-side via internal API endpoints. These communicate with the database via the pcdb_client.ts. This will return an object which implements the `PcdbClient` interface, depending on if a database is accessible. If running in production, or a local instance of the PCDB is running and the `LOCAL_DYNAMODB_ENDPOINT` env variable is pointing to that instance, then the Dynamo DB client (`./pcdb/clients/dynamodb_client.ts`) will be used. Otherwise, the no-op client (`./pcdb/clients/no-op_client.ts`) will be used which will simply read data from a local JSON file.

## Event handlers

There are several instances of custom hooks and event handlers for when hooks are invoked. These are used to respond to certain events but where handlers should be decoupled from the code triggering the event. E.g. if a cold water source is removed, it also needs to be removed from where it's referenced.

Custom hooks are registered in `common.types.ts` by extending the `RuntimeNuxtHooks` interface. Handlers for these hooks can then be registered as part of a plugin (added to the ./plugins directory).

## Server
All server-side code lives in the `./server` directory. This contains the following folders:

`/api`: API endpoints for performing a calculation, saving and retrieving session data and reading data from PCDB.

`/routes`: Server routes (currently just used for authentication with Cognito).

`/services`: Business logic used by API endpoints.

`/plugins`: Plugins to extend Nitro's runtime. Currently contains a plugin to configure a DynamoDB storage driver for reading and saving session data.

`/utils`: Utility functions used on the server

## State management

The Check Part L front-end uses [Pinia](https://pinia.vuejs.org/ssr/nuxt.html) for managing state. This is a store where form data will be collated and saved in memory in the browser. The state conforms to a schema defined by [Zod](https://zod.dev/) with each form has a corresponding Zod schema. TypeScript types are then inferred from the Zod schema.

Pinia is configured to save its state to an entry in the browser's local storage (with the key `ecaas`).

There are 2 plugins (load-store.client.ts and update-cache.client.ts) which are responsible for retrieving and sending the state the server to be saved into a session table in DynamoDB. This is to persist session data on the server so that if local storage is cleared, it can be hydrated with data from the server.

## ECaaS API Integration
Requests to the ECaaS API to perform calculations are performed server-to-server via a Nuxt API endpoint (`check-compliance.post.ts`).

Form data is mapped from the stored format, to the format required by the ECaaS API.

An access token is obtained from the ECaaS authentication server using client credentials which is then subsequently used in the Authorization header of the ECaaS API calculation request.

### API Schema in TypeScript
The ECaaS API provides an OpenAPI schema which the front-end consumes on generates TypeScript types for using ['openapi-typescript'](https://openapi-ts.dev/).

The types can be updated by running:
```
npm run schema-ts
```

## Contributing

### Using the commit template

If you've done work in a pair or ensemble why not add your co-author(s) to the commit? This way everyone involved is
given credit and people know who they can approach for questions about specific commits. To make this easy there is a
commit template with a list of regular contributors to this code base. You will find it at the root of this
project: `commit-template.txt`. Each row represents a possible co-author, however everyone is commented out by default (
using `#`), and any row that is commented out will not show up in the commit.

#### Editing the template

If your name is not in the `commit-template.txt` yet, edit the file and add a new row with your details, following the
format `#Co-Authored-By: Name <email>`, e.g. `#Co-Authored-By: Maja <maja@gmail.com>`. The email must match the email
you use for your GitHub account. To protect your privacy, you can activate and use your noreply GitHub addresses (find
it in GitHub under Settings > Emails > Keep my email addresses private).

#### Getting set up

To apply the commit template navigate to the root of the project in a terminal and
use: `git config commit.template commit-template.txt`. This will edit your local git config for the project and apply
the template to every future commit.

#### Using the template (committing with co-authors)

When creating a new commit, edit your commit (e.g. using vim, or a code editor) and delete the `#` in front of any
co-author(s) you want to credit. This means that it's probably easier and quicker to use `git commit` (instead
of `git commit -m ""` followed by a `git commit --amend`), as it will show you the commit template content for you to
edit.