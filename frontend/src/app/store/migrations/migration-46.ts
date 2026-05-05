export const AddInvestigationListUrl = {
  46: (state: any) => {
    return {
      ...state,
      investigationListUrl: {
        url: "/investigations?investigationStatus=OPEN",
      },
    };
  },
};
