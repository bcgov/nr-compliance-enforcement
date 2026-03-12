import { COMSObject } from "@/app/types/coms/object";
import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onFileSelect: (selectedFile: FileList) => void;
  previousValues: COMSObject[] | null; // existing files that were previously selected for accurate counts and sizes
  disabled?: boolean | null;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const AttachmentUpload: FC<Props> = ({ onFileSelect, disabled, previousValues }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      onFileSelect(dataTransfer.files);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: disabled ?? false,
  });

  const selectedFiles = previousValues ?? [];
  const totalSize = selectedFiles.reduce((sum, file) => sum + (file.size ?? 0), 0);
  const hasFiles = selectedFiles.length > 0;

  return (
    <div
      {...getRootProps()}
      className={`comp-attachment-upload-btn${hasFiles ? " comp-attachment-upload-btn--has-files" : ""}`}
      style={(disabled ?? false) ? { cursor: "default" } : {}}
    >
      <input {...getInputProps()} />
      {hasFiles ? (
        <>
          <div className="upload-icon">
            <i className="bi bi-file-earmark-text"></i>
          </div>
          <div className="upload-text">
            <div>
              {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
            </div>
            <div>{formatFileSize(totalSize)}</div>
          </div>
        </>
      ) : (
        <>
          <div className="upload-icon">
            <i className="bi bi-upload"></i>
          </div>
          <div className="upload-text">Drop files here or click to browse</div>
        </>
      )}
    </div>
  );
};

export default AttachmentUpload;
