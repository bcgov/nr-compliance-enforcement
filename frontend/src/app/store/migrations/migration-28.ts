export const AddComplaintReferral = {
  28: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        referrals: [],
      },
    };
  },
};
