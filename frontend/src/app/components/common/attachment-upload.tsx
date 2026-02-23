import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onFileSelect: (selectedFile: FileList) => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  disabled?: boolean | null;
};

export const AttachmentUpload: FC<Props> = ({ onFileSelect, onDirtyChange, disabled }) => {
  // Dirty tracking
  const { markDirty } = useFormDirtyState(onDirtyChange, 0);

  // Function to handle files being dropped onto the component
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      onFileSelect(dataTransfer.files);
      markDirty();
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
      style={(disabled ?? false) ? { cursor: "default" } : {}}
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
