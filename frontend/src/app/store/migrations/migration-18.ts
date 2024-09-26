//Add Schedule Sector Type Codes in code table
export const AddScheduleSectorTypes = {
  18: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "schedule-sector-type": [],
      },
    };
  },
};
