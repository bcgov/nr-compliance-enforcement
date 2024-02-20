export const ExampleMigration = {
  1: (state: any) => {

    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        example: [
          {
            name: "EXAMPLE01",
            shortDescription: "Example 01",
            longDescription: "Example - 01",
            displayOrder: 1,
            isActive: true,
          },
          {
            name: "EXAMPLE02",
            shortDescription: "Example 02",
            longDescription: "Example - 02",
            displayOrder: 2,
            isActive: true,
          },
          {
            name: "EXAMPLE03",
            shortDescription: "Example 03",
            longDescription: "Example - 03",
            displayOrder: 3,
            isActive: true,
          },
        ],
      },
    };
  },
};
