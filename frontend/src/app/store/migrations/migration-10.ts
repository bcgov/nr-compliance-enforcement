export const AddAgencyCode = {
  10: (state: any) => {
    return {
      ...state,
      codeTables: {
        violation: {
          agencyCode: "COS",
        },
      },
    };
  },
};
