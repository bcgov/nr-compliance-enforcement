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

Bootstrap’s utility classes let you quickly apply margins, padding, colors, or
positioning. This approach reduces the need for custom styling classes and
avoids inline styling.

- Use Bootstrap's Utility API based classes for as much styling as possible
  (https://getbootstrap.com/docs/5.0/utilities/api/).
- If custom styles are needed, create a \_styles.scss file and import it in your
  component
- If shared custom styles are needed, place the in /scss/common

## TanStack Router

TanStack Router is used to handle route definitions within the app, supporting
nested routes and code-splitting. It simplifies how views and paths are linked
without complicating component logic:

- Routes are inferred by the files in the /routes/ folder, see
  (https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing).
- Use /auth/createProtectedRoute to enforce authentication. A list of roles can
  also be passed in to restrict access only to those roles.

## TanStack Form

TanStack Form offers a structured way to manage form state. It handles
validation, submission, and other form events while minimizing boilerplate code:

- (https://tanstack.com/form/latest/docs/overview)

## TanStack Query and GraphQL

TanStack Query manages server-state data. It handles caching, updates, and
background refetching. Combined with GraphQL, it offers efficient queries and
mutations, reducing the burden of manual data handling:

- (https://tanstack.com/query/latest/docs/framework/react/overview)
- For fetching data, import and use useRequest from /graphql/client to handle
  authenticated API calls

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
support for Apply WebKit (Safari). The significance of Safari support is
inflated by the amount of iPad traffic this project gets.

#### Configuration

Configuration of Playwright can be found in `frontend/playwright.config.ts`.
Here, dependencies can be set, and browsers to run the tests against can be
selected. Environment variables have also been added to the `sample.env` that
will need to be copied to `frontend/.env` with the appropriate values.

#### Authentication

To further drive efficiency, the Playwright test suite has been setup to use
shared authentication across the tests. Setup can be found in
`frontend/e2e/authStorage.setup.ts`. Since our tool has multiple test users with
different roles, the following is performed for each test user:

- The user is logged into keycloak using the appropriate environments realm
- The resulting cookie containing the token and session info are saved to the
  `frontned/e2e/.auth` directory whose contents should **never be committed**.
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
