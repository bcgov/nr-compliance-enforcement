/**
 * IMPORTANT
 * These numbers are the values used PER TEST. That means that if you run tests hitting 5 endpoints, each
 * with its own test, you will get 5 times the number of users specified by the stages of total traffic.
 * These values were entered assuming 1 test is run at a time. Adjust them accordingly.
 */
const TEST_RUN_USERS = 1;
const MIN_USERS = 20;
const MAX_USERS = 250;
const AVERAGE_USERS = 75;
const STRESS_LOAD_USERS = 150;

export const STAGES = {
  // Test run stages to make sure all scenarios are working
  test_run: [
    { duration: "5s", target: TEST_RUN_USERS },
    { duration: "10s", target: TEST_RUN_USERS },
    { duration: "5s", target: 0 },
  ],

  // Smoke tests for minimum expected load
  smoke: [
    { duration: "3m", target: MIN_USERS }, // ramp-up of traffic to the smoke users
    { duration: "10m", target: MIN_USERS }, // stay at minimum users for 10 minutes
    { duration: "2m", target: 0 }, // ramp-down to 0 users
  ],

  // Load tests for average load
  load: [
    { duration: "2m", target: MIN_USERS }, // ramp up to minimum users
    { duration: "5m", target: MIN_USERS }, // maintain minimum users
    { duration: "5m", target: AVERAGE_USERS }, // ramp up to average user  base
    { duration: "30m", target: AVERAGE_USERS }, // maintain average user base
    // Small spike
    { duration: "2m", target: STRESS_LOAD_USERS }, // scale up to stress load
    { duration: "2m", target: STRESS_LOAD_USERS }, // briefly maintain stress load
    { duration: "2m", target: AVERAGE_USERS }, // scale back to average users
    { duration: "5m", target: AVERAGE_USERS }, // maintain average users
    { duration: "10m", target: 0 }, // gradually drop to 0 users
  ],

  // Stress tests for heavy load
  stress: [
    { duration: "2m", target: MIN_USERS }, // ramp up to minimum users
    { duration: "1m", target: MIN_USERS }, // maintain minimum users
    { duration: "3m", target: AVERAGE_USERS }, // maintain average users
    { duration: "5m", target: AVERAGE_USERS }, // maintain average users
    { duration: "5m", target: STRESS_LOAD_USERS }, // ramp up to stress load
    { duration: "30m", target: STRESS_LOAD_USERS }, // maintain stress load
    { duration: "10m", target: 0 }, // gradually drop to 0 users
  ],

  // Spike tests for maximum expected load (e.g. entire expected user base)
  // Initial scenario this is intended to simulate is the COS wide training session
  // when a significant portion of the user base will likely all log on at the same time.
  spike: [
    { duration: "2m", target: MAX_USERS }, // simulate fast ramp up of users to max users
    { duration: "20m", target: MAX_USERS }, // stay at max users
    { duration: "2m", target: 0 }, // ramp-down to 0 users
  ],

  // Soak tests for extended varrying standard load
  soak: [
    { duration: "2m", target: MIN_USERS }, // ramp up to minimum users
    { duration: "5m", target: MIN_USERS }, // maintain minimum users
    { duration: "5m", target: AVERAGE_USERS }, // ramp up to average user  base
    { duration: "480m", target: AVERAGE_USERS }, // maintain average user base
    { duration: "5m", target: MIN_USERS }, // slow down to minimum users
    { duration: "20m", target: MIN_USERS }, // maintain low numbers
    { duration: "10m", target: 0 }, // gradually drop to 0 users
  ],
};
