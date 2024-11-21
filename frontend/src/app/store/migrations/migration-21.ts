//Add Assessment Cat1 Type and Location Codes in code table
export const AddCat1TypeAndLocationType = {
  21: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "assessment-cat1-type": [],
        "case-location-type": [],
      },
    };
  },
};
