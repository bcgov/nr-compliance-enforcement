// Clears cached inaction justification codes so the PARKS and CEEB rows are fetched
export const PersonProfileUpdates = {
  48: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "approximate-age-type": [],
      },
    };
  },
};
