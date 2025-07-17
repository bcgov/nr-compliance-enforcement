This is the awesome frontend readme.

## Vite

Vite is used for fast development builds and hot module reloading. By splitting
dependencies into separate modules and serving them efficiently, it reduces
start-up times compared to traditional bundlers:

- Run "npm run dev" to start a local dev server.

## Components and Styles

React and React-Bootstrap components are the foundation of our components:

- Create new components in "src/components" and import them into pages.
- Use React-Bootstrap components as described in its documentation
  (https://react-bootstrap.netlify.app/docs/getting-started/introduction).

## Styling with Bootstrap Utility API and SCSS

Bootstrap's utility classes let you quickly apply margins, padding, colors, or
positioning. This approach reduces the need for custom styling classes and
avoids inline styling.

- Use Bootstrap's Utility API based classes for as much styling as possible
  (https://getbootstrap.com/docs/5.0/utilities/api/).
- If custom styles are needed, create a \_styles.scss file and import it in your
  component
- If shared custom styles are needed, place them in /scss/common

## TanStack Query and GraphQL

TanStack Query manages server-state data. It handles caching, updates, and
background refetching. Combined with GraphQL, it offers efficient queries and
mutations, reducing the burden of manual data handling:

- (https://tanstack.com/query/latest/docs/framework/react/overview)
- For fetching data, import and use useRequest from /graphql/client to handle
  authenticated API calls

### Code Generation

Use GraphQL Code Generator to automatically generate TypeScript types and
operations from the GraphQL schema. The configuration is in `codegen.ts`.

Run this command to generate types:

```bash
npm run codegen
```

The code generator connects to your GraphQL API to introspect its schema, then
scans all `.ts` and `.tsx` files in the `src` directory for GraphQL queries
and mutations.

### TanStack Query Integration

Use TanStack Query for state management, caching, and synchronization of server
state. TanStack Query provides powerful features for managing asynchronous data
fetching, caching, and background updates.

#### useGraphQLQuery Hook

Use the custom `useGraphQLQuery` hook that wraps TanStack Query with
GraphQL-specific functionality. The hook provides type-safe query execution,
automatic caching with TanStack Query, built-in loading and error states, and
configurable stale time (5 minutes default) and garbage collection time
(10 minutes default).

#### TanStack Query Features

**Caching Strategy**: TanStack Query automatically caches query results and
provides intelligent cache invalidation. Configure with:

- `staleTime: 5 * 60 * 1000` (5 minutes) - Data is considered fresh for
  5 minutes
- `gcTime: 10 * 60 * 1000` (10 minutes) - Cached data is garbage collected
  after 10 minutes

**Query Keys**: Use unique keys for caching and invalidation.

**Conditional Queries**: Use the `enabled` option to conditionally execute
queries.

**Background Refetching**: TanStack Query automatically refetches data in the
background when:

- Window regains focus
- Network reconnects
- Component remounts

**Query States**: Use these states in your components:

- `isLoading`: True when the query is fetching for the first time
- `isFetching`: True when the query is fetching (including background
  refetches)
- `isError`: True when the query has encountered an error
- `error`: Contains the error object if the query failed
- `data`: Contains the successful response data

### GraphQL Client

The GraphQL client is configured in `src/app/graphql/client.ts`. This setup
automatically includes authentication headers and provides a simple interface for
executing GraphQL requests.

### Inline Query Definitions

Define queries inline with components using the `gql` template literal. The
GET_CASE_FILE example demonstrates this pattern with a case details query that
fetches case information including status, lead agency, and activities.

This approach keeps queries close to where they're used but also allows for
easy refactoring later to a mixture of shared and inline queries or a seperate
path for queries.

## Environment Variables

Environment variables are defined in .env.sample:

- Copy "sample.env" to ".env" and adjust values.

## Building and Running

1. Install dependencies:  
   npm install
2. Start the dev server:  
   npm run dev

## Testing

### End-to-end

This project uses Playwright (https://playwright.dev/) as the e2e testing
framework. It was selected after a comparison to Cypress
(https://www.cypress.io/). Playwright was chosen for its parallelization and
overall superior performance over Cypress, as well as having out-of-the-box
support for Apple WebKit (Safari). The significance of Safari support is
inflated by the amount of iPad traffic this project gets.

#### Configuration

Configuration of Playwright can be found in `frontend/playwright.config.ts`.
Here, dependencies can be set, and browsers to run the tests against can be
selected. Environment variables have also been added to the `sample.env` that
will need to be copied to `frontend/.env` with the appropriate values.

#### Authentication

To further drive efficiency, the Playwright test suite has been setup to use
shared authentication across the tests. Setup can be found in
`frontend/e2e/authStorage.setup.ts`. Since our tool has multiple test users
with different roles, the following is performed for each test user:

- The user is logged into keycloak using the appropriate environments realm
- The resulting cookie containing the token and session info are saved to the
  `frontend/e2e/.auth` directory whose contents should **never be committed**.
  The gitignore covers all contents of that directory, however if the directory
  moves or changes, the `.gitignore` file will need to be updated as well. The
  path of each cookie is added to the exported `STORAGE_STATE_BY_ROLE` variable
  found in `frontend/e2e/utils/authConfig.ts`.
- In `frontend/playwright.config.ts`, the setup step has been marked as a
  requirement for all subsequent tests, making the cookie available to all tests
  that depend on the setup.
- All other tests can make use of the stored credentials, e.g.
  `test.use({ storageState: STORAGE_STATE_BY_ROLE.COS })`. In doing so, that
  test can bypass the process of logging in and go straight to visiting and
  testing the appropriate protected routes.

#### Adding Tests

Tests can be added either directly in `frontend/e2e` if they are a top level
test, or in the appropriate subdirectory of `frontend/e2e` if they are a tighter
scoped test that will be imported to a top level spec. Test files must follow
the naming convention `<descriptor>.spec.ts` or `<descriptor>.test.ts` to be
detected when running the tests. See "Authentication" above for instructions on
writing tests to run as specific users with select roles.

#### Running Tests

Two scripts have been added to the `package.json` for running Playwright tests:

- `npm run test:e2e` will run the tests
- `npm run test:e2e-ui` will open the Playwright UI where you can visually run
  and debug the tests

A note when using the UI: by default it filters the tests that it shows to just
the setup tests. In the UI itself, open the filters tab and select the
appropriate browsers and the other tests will appear.
