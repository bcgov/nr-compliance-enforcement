//Add Lead Agency Code in code table
export const AddLeadAgencyCode = {
  17: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "lead-agency": [],
      },
    };
  },
};
