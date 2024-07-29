//Add AddGirTypeCode in cases
export const AddGirTypeCode = {
  8: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "gir-type": [],
      },
    };
  },
};
