export const Decision = {
  13: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        activeTab: "",
      },
      codeTables: {
        ...state.codeTables,
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
