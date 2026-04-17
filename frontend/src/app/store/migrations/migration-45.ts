export const AddEnforcementActions = {
  45: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "enforcement-action-type": [],
      },
    };
  },
};
