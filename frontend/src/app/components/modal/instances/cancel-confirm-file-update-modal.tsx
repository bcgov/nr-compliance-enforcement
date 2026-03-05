import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";

type CancelConfirmFileUpdateModalProps = {
  close: () => void;
  onUpdate: () => void;
};

type ModalData = {
  title: string;
  fileNames: string[];
};

export const CancelConfirmFileUpdateModal: FC<CancelConfirmFileUpdateModalProps> = ({ close, onUpdate }) => {
  const modalData = useAppSelector(selectModalData) as ModalData;
  const { title, fileNames } = modalData;

  if (fileNames?.length === 0) {
    return null;
  }

  const isSingleFile = fileNames.length === 1;

  const handleSubmit = () => {
    onUpdate();
    close();
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>
        <p>
          {isSingleFile ? (
            <>
              An attachment with the name <strong>{fileNames[0]}</strong> already exists. If this is the latest version
              of that document, please click <strong>“Update document”</strong>. If this is intended to be a new,
              separate document, please click <strong>“Cancel”</strong> and rename the file before uploading it.
            </>
          ) : (
            <>
              <span>Attachments with the following names already exist.</span>
              <ul className="mt-3 list-unstyled">
                {fileNames.map((fileName) => (
                  <li
                    key={fileName}
                    className="py-1 px-4"
                  >
                    {fileName}
                  </li>
                ))}
              </ul>
              <span>
                If this is the latest version of the documents, please click <strong>“Update document”</strong>. If they
                are intended to be new, separate documents, please click <strong>“Cancel”</strong> and rename the files
                before uploading them.
              </span>
            </>
          )}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update document</Button>
      </Modal.Footer>
    </>
  );
};
