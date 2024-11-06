// Refresh drug methods
export const DrugAdministeredChanges = {
  19: (state: any) => {
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
