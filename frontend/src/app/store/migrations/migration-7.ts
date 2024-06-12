//Add isInEdit in cases
export const AddIsInEdit = {
  7: (state: any) => {
    return {
      ...state,
      cases: {
        ...state.cases,
        isInEdit: {
          assessment: false,
          prevention: false,
          equipment: false,
          animal: false,
          note: false,
          attachments: false,
          fileReview: false,
          showSectionErrors: false,
        },
      },
    };
  },
};
