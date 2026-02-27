export const RefreshCommunities = {
  42: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        communities: [],
      },
    };
  },
};
