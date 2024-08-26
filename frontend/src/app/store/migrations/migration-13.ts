export const AddActiveTab = {
  13: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        activeTab: "",
      },
    };
  },
};
