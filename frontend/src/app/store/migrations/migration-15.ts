export const Decision = {
  15: (state: any) => {
    return {
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
