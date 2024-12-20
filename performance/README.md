# Performance Testing

## Tools

Performance testing of this app was done using k6 by Grafana (https://k6.io/). Frontend performance
tests made use of the k6 browser testing tools (https://grafana.com/docs/k6/latest/using-k6-browser/).

## Running the Tests

Backend and frontend have thier own test scripts, and their own make commands to run.
For the most accurate results, it is generally best to run one scenario at a time. Note that if running multiple test
scenarios at once, such as hitting several endpoints continuously, each test will have its own set of the number of
users specified in the stages, so change the numbers as needed.

## Setup

In order to configure the tests, the following settings are available:

- Stages: set in `common/params.js`, these are the scenarios of user counts and times that the tests will simulate.
- LOAD: set in the `Makefile`, this dictates which stages the tests will use. The value must match one of the keys
  from the `STAGES` object in `common/params.js` e.g. `smoke`, `spike` etc.
- HOST: set in the `Makefile`, this points to the server being tested. Front- and back-end each have a value.
- REQUESTS_PER_SECOND: set i the `Makefile`, this dictates the rate that the requests will be made at.
  ** Important: if setting above 50rps, alert platform services first **
- Credentials and tokens: set in `common/auth.js` these are the credentials used to run the tests. User
  credentials will need to be added for the browser test. A valid auth token & refresh token are needed for the
  protocol level tets.
- Tests: determining which tests will run in a given suite is done by simply commenting out tests that you want skipped
  in the respective `frontend_script.js` or `backend_script.js` file. Comment out the tests entry in both
  `options.scenario` and the corresponding if statement in the default function.

### Token and Credentials

Valid user credentials with the appropriate roles are required for the browser tests, along with that users officer ID
from the officer table. For the protocol level tests a token and refresh token that are valid at the time of running
the test will be needed, and the tests will refresh the values as they run. The logic for this can be found in
`backend_script.js` and `frontend_script.js`. The initial values for the token and refresh token can be found be loggin
into the environment that is being used for the load test and copying the values out of the response of the network
call titled `token` from browser tools network tab. If you leave an instance open in your browser these network
requests will continue to be made with the latest token, which can save time between tests. Once the rest of the setup
is done and you are ready to run the tests, copy the latest values into `common/auth.js` and don't forget to save.

### Running from Local

1. Install k6 - https://k6.io/docs/get-started/installation/

2. If results files already exist in `/performance/k6_results` rename or move them, or else they will be
   overwritten.

3. Configure the tests (see "Setup" above) to be pointed at the correct servers with the desired load and scenarios.
   The load is set for the front- and backend separately in the Makefile, be sure to set the correct one.

4. Ensure that the servers being used for testing are running and ready with the correct test data, and setup any
   cluster / resource monitoring needed during the testing. It is a good idea to watch resource usage on the machine
   running the tests as well just to ensure that its own resource constraints are not affecting results.

5. From the `/performance` directory, run `make bakend_perf_test` or `make frontend_perf_test` depending on
   which suite you are running. To run the frontend browser test with a regular browser, instead run
   `K6_BROWSER_HEADLESS=false make  frontend_perf_test` however this is very resource intesive to do with more than one
   virtual user so adjust the number of vus. If running one of the more intensive tests such as `spike` or
   `stress`, it is recommended that a `test_run` is done first to ensure that everything is working as intended.

6. When the tests finish, k6 will present you with a summary of the test in the terminal that ran the tests, it is
   recommended to copy the summary into a text file. The detailed results can be found in `/performance/k6_results/`.
