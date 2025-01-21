export const ComplaintReadOnlyIndicator = {
  26: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        complaintView: {
          ...state.complaints.complaintView,
          isReadOnly: false,
        },
      },
    };
  },
};
