//Add Complaint Method Received Codes in code table
export const AddComplaintMethodReceivedCodes = {
  15: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "complaint-method-received-codes": [],
      },
    };
  },
};
