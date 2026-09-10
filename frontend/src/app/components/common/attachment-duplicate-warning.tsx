import { FC } from "react";
import { Alert, Button } from "react-bootstrap";

type Props = {
  /** Display names of the incoming files that match an existing attachment. */
  fileNames: string[];
  /** Discards the pending selection. */
  onCancel: () => void;
  /** Accepts the selection, replacing the existing attachment(s). */
  onConfirm: () => void;
};

/** Warns that incoming files share a name with existing attachments, before they are staged for upload. */
export const AttachmentDuplicateWarning: FC<Props> = ({ fileNames, onCancel, onConfirm }) => (
  <Alert
    variant="warning"
    className="comp-complaint-details-alert mt-3"
  >
    <div className="d-flex align-items-start gap-2">
      <i className="bi bi-exclamation-triangle mt-1" />
      <span>
        <strong>Duplicate file detected</strong>
        <p>
          {fileNames.length === 1 ? (
            <>
              An attachment with the name <strong>{fileNames[0]}</strong> already exists. If this is the latest version
              of that document, please click <strong>"Update document"</strong>. If this is intended to be a new,
              separate document, please click <strong>"Cancel"</strong> and rename the file before uploading it.
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
                If this is the latest version of the documents, please click <strong>"Update document"</strong>. If they
                are intended to be new, separate documents, please click <strong>"Cancel"</strong> and rename the files
                before uploading them.
              </span>
            </>
          )}
        </p>
      </span>
    </div>
    <div className="d-flex justify-content-end gap-2 mt-2">
      <Button
        variant="outline-primary"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="warning"
        onClick={onConfirm}
      >
        Update document
      </Button>
    </div>
  </Alert>
);

export default AttachmentDuplicateWarning;
