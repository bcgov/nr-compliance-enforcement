import { FC, useRef } from "react";
import { BsPlus } from "react-icons/bs";

type Props = {
  complaintIdentifier: string;
  onFileSelect: (selectedFile: FileList) => void;
};

export const AttachmentUpload: FC<Props> = ({ complaintIdentifier, onFileSelect }) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();

}

    return (
      <div>
        <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} 
        style={{ display: 'none' }} />
        <div className="coms-carousel-upload-container" onClick={handleDivClick}>
          <div className="upload-icon">
            <BsPlus />
          </div>
          <div className="upload-text">Upload</div>
        </div>
      </div>
    );
  };
