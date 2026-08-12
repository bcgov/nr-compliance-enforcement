export const RemoveTaskSubCategories = {
  50: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "task-type": [],
      },
    };
  },
};
