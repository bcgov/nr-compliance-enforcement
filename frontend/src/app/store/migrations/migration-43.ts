export const AddBulkDownload = {
  43: (state: any) => {
    return {
      ...state,
      bulkDownload: {
        isBulkDownloadInProgress: false,
        currentDownload: null,
      },
    };
  },
};
