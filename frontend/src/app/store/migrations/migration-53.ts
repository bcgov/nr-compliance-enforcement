export const AddWMUType = {
  53: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        species: [],
        "wildlife-management-unit-type": [],
      },
    };
  },
};
