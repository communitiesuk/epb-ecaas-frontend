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


### Running as a [Tauri](https://v2.tauri.app) app

```sh
npm ci
npx tauri dev
```

## Components
Many common UI components have been abstracted in an attempt to make code and components as reusable as possible. These primarily include:

- Fields: Form inputs inclusive of label, corresponding help text, validation etc.
- Gov: VueJS versions of GovUK components
- FormKit: Custom FormKit components

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