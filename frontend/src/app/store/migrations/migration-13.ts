export const RebuildCodeTable = {
  13: (state: any) => {
    return {
      ...state,
      codeTables: {
        discharge: [],
        "non-compliance": [],
        rational: [],
        section: [],
        schedule: [],
      },
    };
  },
};
