export const ExternalAgencies = {
  35: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        agency: [],
      },
    };
  },
};
