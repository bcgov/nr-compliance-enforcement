// Refresh drug methods
export const DrugAdministeredChanges = {
  20: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "drug-methods": [],
        "drug-remaining-outcomes": [],
      },
    };
  },
};
