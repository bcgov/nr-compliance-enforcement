export const AddParkCache = {
  32: (state: any) => {
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
