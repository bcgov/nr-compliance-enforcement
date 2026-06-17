// Adds new shared code tables for countries and subdivisions (provinces/states)
export const Countries = {
  47: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "country-type": [],
        "country-subdivision-type": [],
      },
    };
  },
};
