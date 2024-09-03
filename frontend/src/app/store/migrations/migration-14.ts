//Add team code in code table
export const AddTeamCode = {
  14: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        team: [],
      },
    };
  },
};
