export const addHwcrOutcomeActionedByCodes = {
  30: (state: any) => {
    // Also includes new wildlife outcome codes
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "wildlife-outcomes": [],
        "hwcr-outcome-actioned-by-codes": [],
      },
    };
  },
};
