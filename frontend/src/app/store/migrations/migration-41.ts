export const RemoveAttachments = {
  41: (state: any) => {
    const { outcomeAttachments } = state.attachments ?? {};

    return {
      ...state,
      attachments: outcomeAttachments,
    };
  },
};
