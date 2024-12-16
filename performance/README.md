# Performance Testing

## Tools

Performance testing of this app was done using k6 by Grafana (https://k6.io/). Frontend performance
tests made use of the k6 browser testing tools (https://grafana.com/docs/k6/latest/using-k6-browser/).

## Setup

In order to configure the tests, the following settings are available:

- Stages: set in `common/params.js`, these are the scenarios of user counts and times that the tests will simulate.
- LOAD: set in the `Makefile`, this dictates which stages the tests will use. The value must match one of the keys
  from the `STAGES` object in `common/params.js` e.g. `smoke`, `spike` etc.
- HOST: set in the `Makefile`, this points to the server being tested. Front- and back-end each have a value.
- REQUESTS_PER_SECOND: set i the `Makefile`, this dictates the rate that the requests will be made at.
  ** Important: if setting above 50rps, alert platform services first **
- Credentials and request headers: set in `common/auth.js` these are the credentials used to run the tests. User
  credentials will need to be added for the browser test. A valid auth token is needed for the protocol level tets.
- Tests: determining which tests will run in a given suite is done by simply commenting out tests that you want skipped
  in the respective `frontend_script.js` or `backend_script.js` file. Comment out the tests entry in both `options.scenario`
  and the corresponding if statement in the default function.

## Running the Tests

Backend and frontend have thier own test scripts, and their own make commands to run.

### Locally

1. Install k6 - https://k6.io/docs/get-started/installation/

2. If results files already exist in `/performance/k6_results` consider dating them or moving them, or else they will be
   overwritten.

3. Configure the tests (see "Setup" above) to be pointed at the correct servers with the desired load and scenarios.

4. Ensure that the servers being used for testing are running and ready with the correct test data, and setup any
   monitoring needed during the testing. It is a good idea to watch resource usage on the machine running the tests as
   well just to ensure that its own resource constraints are not affecting results.

5. From the `/performance` directory, run either `make bakend_perf_test` or `make frontend_perf_test` depending on
   which suite you are running. (If running one of the more intensive tests such as `spike` or `stress`, it is
   recommended that a `test_run` is done first to ensure that everything is working as intended.)

6. When the tests finish, k6 will present you with a summary of the test in the terminal that ran the tests, it is
   recommended to copy the summary into a text file. The detailed results can be found in `/performance/k6_results/`.
