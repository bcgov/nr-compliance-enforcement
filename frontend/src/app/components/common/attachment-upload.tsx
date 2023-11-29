import { FC, useState, useRef } from "react";
import { generateApiParameters, putFile } from "../../common/api";
import config from "../../../config";
import { useAppDispatch } from "../../hooks/hooks";
import { BsPlus } from "react-icons/bs";

type Props = {
  complaintIdentifier: string;
  onFileSelect: (selectedFile: File) => void;
};

export const AttachmentUpload: FC<Props> = ({ complaintIdentifier, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const header = {
    "x-amz-meta-complaint-id": complaintIdentifier,
    "Content-Disposition": `attachment; filename=${selectedFile?.name}`,
    "Content-Length": selectedFile?.size,
    "Content-Type": selectedFile?.type,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      onFileSelect(event.target.files[0]);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleDivClick = () => {
    fileInputRef.current?.click();

    const handleUpload = async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const parameters = generateApiParameters(
            `${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}`
          );

          const response = await putFile<string>(
            dispatch,
            parameters,
            header,
            selectedFile
          );
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
}

    return (
      <div>
        <input type="file" onChange={handleFileChange} ref={fileInputRef} 
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
