export const AddFeatureFlag = {
  12: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        featureFlags: [],
      },
    };
  },
};
