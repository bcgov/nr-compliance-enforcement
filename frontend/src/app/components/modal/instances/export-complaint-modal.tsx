import { FC, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface ExportComplaintModalProps {
  show: boolean;
  onHide: () => void;
  onExport: (includeAttachments: boolean) => void;
}

export const ExportComplaintModal: FC<ExportComplaintModalProps> = ({ show, onHide, onExport }) => {
  const [includeAttachments, setIncludeAttachments] = useState(false);

  const handleHide = () => {
    setIncludeAttachments(false);
    onHide();
  };

  const handleExport = () => {
    onExport(includeAttachments);
    handleHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      size="sm"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Export complaint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="radio"
            id="export-pdf-only"
            name="export-option"
            label="PDF only"
            checked={!includeAttachments}
            onChange={() => setIncludeAttachments(false)}
          />
          <Form.Check
            type="radio"
            id="export-pdf-with-attachments"
            name="export-option"
            label="PDF with attachments"
            checked={includeAttachments}
            onChange={() => setIncludeAttachments(true)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="export-complaint-modal-cancel-button"
          variant="outline-primary"
          onClick={handleHide}
        >
          Cancel
        </Button>
        <Button
          id="export-complaint-modal-export-button"
          variant="primary"
          onClick={handleExport}
        >
          Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
