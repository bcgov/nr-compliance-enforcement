export const AddTaskTables = {
  40: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "task-status-type": [],
        "task-category-type": [],
        "task-type": [],
      },
    };
  },
};
