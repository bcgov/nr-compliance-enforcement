export const Decision = {
  15: (state: any) => {
    return {
      ...state,
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
