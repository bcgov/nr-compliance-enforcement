export const Migration1 = {
  1: (state: any) => {

    return {
      ...state,
      attachments: {
        complaintsAttachments: [],
        outcomeAttachments: [],
      }
    };
  },
};
