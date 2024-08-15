export const FeatureCodeRepositoryMockFactory = () => ({
  // mock repository functions for testing
  // any values returned by the repository that are asserted in the Jest tests need to be mocked here
  find: jest.fn().mockResolvedValue([
    {
      feature_code: "EXPERMFTRS",
      short_description: "Experimental Features",
      long_description: "Experimental Features",
      display_order: "10",
      active_ind: "Y",
    },
    {
      feature_code: "GIRCMPLNTS",
      short_description: "GIR Complaints",
      long_description: "GIR Complaints",
      display_order: "20",
      active_ind: "Y",
    },
    {
      feature_code: "ACTONSTKEN",
      short_description: "Actions Taken",
      long_description: "Actions Taken",
      display_order: "30",
      active_ind: "Y",
    },
  ]),
  findOneByOrFail: jest.fn().mockResolvedValue({
    feature_code: "EXPERMFTRS",
    short_description: "Experimental Features",
    long_description: "Experimental Features",
    display_order: "10",
    active_ind: "Y",
  }),
  create: jest.fn().mockResolvedValue({
    feature_code: "NEWCODE",
    short_description: "New description",
    long_description: "New long description",
    display_order: "40",
    active_ind: "Y",
  }),
  //Note: The two calls have to be done in the same test!
  delete: jest.fn().mockResolvedValueOnce("true").mockRejectedValueOnce(new Error("Simulated error")),
  // as these do not actually use their return values in our tests
  // we just make sure that their resolve is true to not crash
  save: jest.fn(() => {
    return Promise.resolve(true);
  }),
  update: jest.fn(() => {
    return Promise.resolve(true);
  }),
});
