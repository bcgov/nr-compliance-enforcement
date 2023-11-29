import React, { useState } from 'react';
import { generateApiParameters, put, putFile } from '../../common/api';
import config from '../../../config';
import { useAppDispatch } from '../../hooks/hooks';

type Props = {
    complaintIdentifier: string;
  };

const AttachmentUpload: React.FC<Props> = ({
    complaintIdentifier,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const header = {
    'x-amz-meta-complaint-id':complaintIdentifier,
    'Content-Disposition':`attachment; filename=${selectedFile?.name}`,
    'Content-Length': selectedFile?.size,
    'Content-Type': selectedFile?.type,
    }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const dispatch = useAppDispatch();

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {

        const parameters = generateApiParameters(
            `${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}`
          );
 
          const response = await putFile<string>(dispatch, parameters,header, selectedFile);
      

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default AttachmentUpload;
