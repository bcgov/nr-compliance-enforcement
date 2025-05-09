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

export const MultipleAssessments = {
  32: (state: any) => {
    return {
      ...state,
      cases: {
        assessments: [],
      },
    };

