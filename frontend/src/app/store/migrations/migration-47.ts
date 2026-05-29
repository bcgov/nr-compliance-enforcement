// Clears cached inaction justification codes so the PARKS and CEEB rows are fetched
export const Countries = {
  47: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        countries: [],
        countrySubdivisions: [],
      },
    };
  },
};
