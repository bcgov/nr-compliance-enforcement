export interface BulkDownloadState {
  isBulkDownloadInProgress: boolean;
  currentDownload: CurrentDownload | null;
}

export interface CurrentDownload {
  downloadId: string;
}
