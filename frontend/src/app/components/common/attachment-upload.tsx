import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BsPlus } from "react-icons/bs";

type Props = {
  onFileSelect: (selectedFile: FileList) => void;
  disabled?: boolean | null;
};

export const AttachmentUpload: FC<Props> = ({ onFileSelect, disabled }) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled ?? false,
  });

  return (
    <div
      {...getRootProps()}
      className="comp-attachment-upload-btn"
      style={disabled ?? false ? { cursor: "default" } : {}}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">
        <BsPlus />
      </div>
      <div className="upload-text">{isDragActive ? "Drop files here" : "Upload"}</div>
    </div>
  );
};

export default AttachmentUpload;
