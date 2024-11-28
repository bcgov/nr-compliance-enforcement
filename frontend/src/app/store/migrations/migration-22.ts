//Add the active complaints view type to app state
export const AddActiveComplaintsViewType = {
  22: (state: any) => {
    return {
      ...state,
      app: {
        ...state.app,
        activeComplaintsViewType: "list",
      },
    };
  },
};
