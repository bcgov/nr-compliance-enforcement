export const ExternalAgencies = {
  34: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        agency: [],
      },
    };
  },
};
