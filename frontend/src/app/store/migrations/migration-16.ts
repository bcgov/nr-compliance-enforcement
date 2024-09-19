//Add Complaint Method Received Codes in code table
export const AddComplaintMethodReceivedCodes = {
  16: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "complaint-method-received-codes": [],
      },
    };
  },
};
