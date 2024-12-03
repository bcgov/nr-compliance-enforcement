// Refresh assessment_types
export const AssessmentTypeUpdates = {
  23: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "assessment-type": [],
      },
    };
  },
};
