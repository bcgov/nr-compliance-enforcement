export const AddScheduleSector = {
  16: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        scheduleSectors: [],
      },
    };
  },
};
