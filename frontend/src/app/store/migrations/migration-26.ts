export const ComplaintReadOnlyIndicator = {
  26: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        complaint: {
          ...state.complaints.complaint,
          readOnly: false,
        },
      },
    };
  },
};
