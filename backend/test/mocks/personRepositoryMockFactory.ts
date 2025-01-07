//As this is a complex object we will need to handle some direct SQL statements and joins
const createQueryBuilder: any = {
  leftJoinAndSelect: () => createQueryBuilder,
  where: () => createQueryBuilder,
  getMany: () => createQueryBuilder,
};

export const PersonRepositoryMockFactory = () => ({
  // mock repository functions for testing
  // any values returned by the repository that are asserted in the Jest tests need to be mocked here
  find: jest.fn().mockResolvedValue([
    {
      person_guid: "81c5d19b-b188-4b52-8ca3-f00fa987ed88",
      first_name: "William",
      middle_name_1: "Sherlock",
      middle_name_2: "Scott",
      last_name: "Holmes",
    },
    {
      person_guid: "d8ce2b57-8b1a-4574-8542-76400e6c5033",
      first_name: "Smokey",
      middle_name_1: "The",
      middle_name_2: "",
      last_name: "Bear",
    },
    {
      person_guid: "92c38653-4269-4de8-8e89-9e7c87c621d0",
      first_name: "Jack",
      middle_name_1: "",
      middle_name_2: "",
      last_name: "Reacher",
    },
  ]),
  findOneBy: jest.fn().mockResolvedValue({
    person_guid: "81c5d19b-b188-4b52-8ca3-f00fa987ed88",
    first_name: "William",
    middle_name_1: "Sherlock",
    middle_name_2: "Scott",
    last_name: "Holmes",
  }),
  findOneByOrFail: jest.fn().mockResolvedValue({
    person_guid: "81c5d19b-b188-4b52-8ca3-f00fa987ed88",
    first_name: "William",
    middle_name_1: "Sherlock",
    middle_name_2: "Scott",
    last_name: "Holmes",
  }),
  create: jest
    .fn()
    .mockReturnValueOnce({
      person_guid: "8a5131e6-1dd0-484d-8cdc-78ba205dfac8",
      first_name: "Miss",
      middle_name_1: "Jane",
      middle_name_2: null,
      last_name: "Marple",
    })
    .mockReturnValueOnce(new Error("Simulated error")),
  // as these do not actually use their return values in our tests
  // we just make sure that their resolve is true to not crash
  save: jest.fn(() => {
    return Promise.resolve(true);
  }),
  update: jest.fn(() => {
    return Promise.resolve(true);
  }),
  delete: jest.fn(() => {
    return Promise.resolve(true);
  }),
  // This final set of mocks are for complex data relations.   We don't need to model the whole relationship
  // We just the final outcome we are expecting the call to return.
  // The e2e / integration tests are responsible for testing that all the relationships and joins are working properly
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      {
        person_guid: "d8ce2b57-8b1a-4574-8542-76400e6c5033",
        first_name: "Smokey",
        middle_name_1: "The",
        middle_name_2: "",
        last_name: "Bear",
      },
      {
        person_guid: "92c38653-4269-4de8-8e89-9e7c87c621d0",
        first_name: "Jack",
        middle_name_1: "",
        middle_name_2: "",
        last_name: "Reacher",
      },
    ]),
  })),
});
