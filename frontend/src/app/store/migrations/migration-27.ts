//Add Assessment Cat1 Type and Location Codes in code table
export const AddIPMAuthCategoryCode = {
  21: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "ipm-auth-category": [],
      },
    };
  },
};
