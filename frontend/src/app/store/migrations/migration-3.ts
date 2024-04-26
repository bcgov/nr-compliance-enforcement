export const Migration3 = {
  1: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        codeTableVersion: {
          complaintManagement: {
            configurationCode: "",
            configurationValue: "",
            activeInd: true,
          },
          caseManagement: {
            configurationCode: "",
            configurationValue: "",
            activeInd: true,
          },
        },
      },
    };
  },
};
