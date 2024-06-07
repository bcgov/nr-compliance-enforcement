import { FC } from "react";
import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { useAppSelector } from "../../../../../hooks/hooks";
import { formatDate } from "../../../../../common/methods";

import { CaseAction } from "../../../../../types/outcomes/case-action";
import { selectNotesOfficer } from "../../../../../store/reducers/case-selectors";
import { Button } from "react-bootstrap";

type props = {
  notes: string;
  action: CaseAction;
  enableEditMode: Function;
  deleteNote: Function;
};

export const SupplementalNotesItem: FC<props> = ({ notes, action, enableEditMode, deleteNote }) => {
  const { initials, displayName } = useAppSelector(selectNotesOfficer);

  return (
    <section className="comp-details-section comp-outcome-supporting-notes">
      <div className="comp-details-section-header">
        <h3>Additional notes</h3>
        <div className="comp-details-section-header-actions">
          <Button
            id="notes-edit-button"
            aria-label="Edit additional notes"
            variant="outline-primary"
            size="sm"
            onClick={(e) => enableEditMode(true)}
          >
            <i className="bi bi-pencil"></i>
            Edit
          </Button>
          <Button
            id="notes-delete-button"
            aria-label="Delete additional notes"
            variant="outline-primary"
            size="sm"
            onClick={() => deleteNote()}
          >
            <i className="bi bi-trash3"></i>
            Delete
          </Button>
        </div>
      </div>
      <div className="comp-details-section-body">
        <pre className="mb-4">{notes}</pre>
        <dl>
          <div>
            <dt>Officer</dt>
            <dd id="comp-notes-officer">
              <div
                data-initials-sm={initials}
                className="comp-avatar comp-avatar-sm comp-avatar-orange"
              >
                <span>{displayName}</span>
              </div>
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd
              id="file-review-supporting-date"
              className="comp-date-time-value"
            >
              <div>
                <i className="bi bi-calendar"></i>
                {formatDate(new Date(action?.date).toString())}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
