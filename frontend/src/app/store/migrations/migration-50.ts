export const RemoveTaskSubCategories = {
  49: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "task-type": [],
        "task-category-type": [],
      },
    };
  },
};
