export const RebuildCodeTable = {
  13: (state: any) => {
    return {
      ...state,
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
