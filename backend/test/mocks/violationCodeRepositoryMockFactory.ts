export const ViolationCodeRepositoryMockFactory = () => ({
  // mock repository functions for testing
  // any values returned by the repository that are asserted in the Jest tests need to be mocked here
  find: jest.fn().mockResolvedValue([
    {
      violation_code: "AINVSPC",
      short_description: "Aquatic: Invasive Species",
      long_description: "Aquatic: Invasive Species",
      display_order: "1",
      active_ind: "Y",
    },
    {
      violation_code: "BOATING",
      short_description: "Boating",
      long_description: "Boating",
      display_order: "2",
      active_ind: "Y",
    },
    {
      violation_code: "DUMPING",
      short_description: "Dumping",
      long_description: "Dumping",
      display_order: "3",
      active_ind: "Y",
    },
  ]),
  findOneByOrFail: jest.fn().mockResolvedValue({
    violation_code: "AINVSPC",
    short_description: "Aquatic: Invasive Species",
    long_description: "Aquatic: Invasive Species",
    display_order: "1",
    active_ind: "Y",
  }),
  create: jest.fn().mockResolvedValue({
    violation_code: "NEWCODE",
    short_description: "New description",
    long_description: "New long description",
    display_order: "10",
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
