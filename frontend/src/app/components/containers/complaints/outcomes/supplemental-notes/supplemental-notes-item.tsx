import { FC } from "react";
import { useAppSelector } from "@hooks/hooks";
import { formatDate } from "@common/methods";

import { CaseAction } from "@apptypes/outcomes/case-action";
import { selectNotesOfficer } from "@store/reducers/case-selectors";
import { Button, Card } from "react-bootstrap";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";

type props = {
  notes: string;
  action: CaseAction;
  enableEditMode: Function;
  deleteNote: Function;
};

export const SupplementalNotesItem: FC<props> = ({ notes, action, enableEditMode, deleteNote }) => {
  const { displayName } = useAppSelector(selectNotesOfficer);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  return (
    <>
      <div className="comp-details-section-header">
        <h3>Additional notes</h3>
        <div className="comp-details-section-header-actions">
          <Button
            variant="outline-primary"
            size="sm"
            id="notes-edit-button"
            onClick={(e) => enableEditMode(true)}
            disabled={isReadOnly}
          >
            <i className="bi bi-pencil"></i>
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            id="notes-delete-button"
            onClick={() => deleteNote()}
            disabled={isReadOnly}
          >
            <i className="bi bi-trash3"></i>
            <span>Delete</span>
          </Button>
        </div>
      </div>
      <Card className="comp-outcome-supporting-notes">
        <Card.Body>
          <div className="comp-details-section">
            <dl>
              <div>
                <dt>Notes</dt>
                <dd>
                  <pre>{notes}</pre>
                </dd>
              </div>
              <div>
                <dt>Officer</dt>
                <dd>
                  <span id="comp-notes-officer">{displayName}</span>
                </dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd id="file-review-supporting-date">
                  <pre>{formatDate(new Date(action?.date).toString())}</pre>
                </dd>
              </div>
            </dl>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
