export const RefreshCourtProsecutionStatus = {
  53: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "court-prosecution-status-type": [],
      },
    };
  },
};
