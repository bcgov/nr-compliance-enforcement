export interface BulkDownloadState {
  isBulkDownloadInProgress: boolean;
  currentDownload: CurrentDownload | null;
}

export interface CurrentDownload {
  taskId: string;
}
