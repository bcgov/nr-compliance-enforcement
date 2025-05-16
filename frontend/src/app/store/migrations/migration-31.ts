export const AddParkAreaCode = {
  31: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "park-area": [],
      },
    };
  },
};
