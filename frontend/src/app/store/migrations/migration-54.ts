export const RefreshCourtProsecutionStatus = {
  54: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "court-prosecution-status-type": [],
      },
    };
  },
};
