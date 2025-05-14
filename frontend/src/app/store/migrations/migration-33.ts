export const AddParkCache = {
  33: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        complaint: { park: "" },
      },
      parks: {
        park: {},
      },
    };
  },
};
