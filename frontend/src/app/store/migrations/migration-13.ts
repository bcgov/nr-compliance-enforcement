export const DecisonAndActiveTab = {
  13: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        activeTab: "",
      },
      codeTables: {
        discharge: [],
        "non-compliance": [],
        rationale: [],
        section: [],
        schedule: [],
        "decision-type": [],
      },
    };
  },
};
