export const AddTaskAttachments = {
  41: (state: any) => {
    return {
      ...state,
      attachments: {
        ...state.attachments,
        taskAttachments: [],
      },
    };
  },
};
