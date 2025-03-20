import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onFileSelect: (selectedFile: FileList) => void;
  disabled?: boolean | null;
};

export const AttachmentUpload: FC<Props> = ({ onFileSelect, disabled }) => {
  // Function to handle files being dropped onto the component
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

  return (
    <div
      {...getRootProps()}
      className="comp-attachment-upload-btn"
      style={disabled ?? false ? { cursor: "default" } : {}}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">
        <i className="bi bi-upload"></i>
      </div>
      <div className="upload-text">Drop files here or click to browse</div>
    </div>
  );
};

export default AttachmentUpload;
