//Add complaintSearchParameters in complaints
export const AddComplaintSearchParameters = {
  19: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        complaintSearchParameters: { sortColumn: "", sortOrder: "" },
      },
    };
  },
};
