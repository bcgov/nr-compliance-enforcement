export const AddSectorComplaints = {
  37: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        complaintItems: {
          ...state.complaints.complaintItems,
          sector: [],
        },
      },
    };
  },
};
