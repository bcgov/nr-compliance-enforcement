import { FC, useRef } from "react";
import { BsPlus } from "react-icons/bs";

type Props = {
  complaintIdentifier: string;
  onFileSelect: (selectedFile: FileList) => void;
};

export const AttachmentUpload: FC<Props> = ({
  complaintIdentifier,
  onFileSelect,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files);
    }
  };

  // Without this, I'm unable to re-add the same file twice.
  const handleFileClick = () => {
    // Clear the current file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        onClick={handleFileClick}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <div
        className="coms-carousel-upload-container"
        tabIndex={0}
        onClick={handleDivClick}
        onKeyDown={handleDivClick}
        role="button"
      >
        <div className="upload-icon">
          <BsPlus />
        </div>
        <div className="upload-text">Upload</div>
      </div>
    </div>
  );
};
