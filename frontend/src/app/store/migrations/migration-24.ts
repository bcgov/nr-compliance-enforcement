// Refresh the profile for coms access indicator
export const AddComsEnrolledInd = {
  24: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        profile: {},
      },
    };
  },
};
