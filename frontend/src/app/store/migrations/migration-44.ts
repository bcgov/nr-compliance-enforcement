// Clears cached inaction justification codes so the PARKS and CEEB rows are fetched
export const RefreshJustificationCodes = {
  44: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        justification: [],
      },
    };
  },
};
