import { FC, useState } from "react";
import { useAppSelector } from "@hooks/hooks";
import { formatDate, formatTime } from "@common/methods";

import { CaseAction } from "@apptypes/outcomes/case-action";
import { Badge, Button, Card } from "react-bootstrap";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";
import { selectOfficers } from "@/app/store/reducers/officer";

type props = {
  note: string;
  actions?: CaseAction[];
  handleEdit: Function;
  handleDelete: Function;
};

export const NoteItem: FC<props> = ({ note, actions = [], handleEdit, handleDelete }) => {
  const officers = useAppSelector(selectOfficers);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const { actor } = actions[0];
  const officer = officers?.find((item) => item.auth_user_guid === actor);
  const displayName = officer ? `${officer.person_guid.last_name}, ${officer.person_guid.first_name}` : "";

  const longNoteLength = 600;
  const isLongNote = note.length > longNoteLength;
  const [showFullNote, setShowFullNote] = useState(false);

  return (
    <Card className="comp-outcome-notes">
      <Card.Body>
        <div className="comp-details-section-header">
          <div className="comp-details-section">
            <dl>
              <div>
                <dt>Created by</dt>
                <dd>
                  <span id="comp-note-created-by">{displayName}</span>
                </dd>
              </div>
            </dl>
            <dl>
              <div>
                <dt>Date logged</dt>
                <dd
                  className="comp-date-time-value"
                  id="complaint-incident-date-time"
                >
                  <i
                    className="bi bi-calendar comp-margin-right-xxs"
                    id="complaint-incident-date"
                  ></i>
                  {formatDate(new Date(actions[0]?.date).toString())}
                  <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                  {formatTime(new Date(actions[0]?.date).toString())}
                  {actions.length > 1 && (
                    <Badge className="badge comp-status-badge-closed">Updated {actions.length} times</Badge>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="comp-outcome-item-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="notes-edit-button"
              onClick={() => handleEdit()}
              disabled={isReadOnly}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline-primary"
              id="notes-delete-button"
              onClick={() => handleDelete()}
              disabled={isReadOnly}
            >
              <i className="bi bi-trash3"></i>
              <span>Delete</span>
            </Button>
          </div>
        </div>
        <div className="comp-details-section">
          <dl />
          <dl>
            <div>
              <dt>Note</dt>
              <dd className={!showFullNote && isLongNote ? "comp-outcome-notes-fade" : ""}>
                <pre id="additional-note-text">
                  {showFullNote && note}
                  {!showFullNote && note.substring(0, longNoteLength)}
                  {!showFullNote && isLongNote && " ..."}
                </pre>
              </dd>
            </div>
          </dl>
          {isLongNote && (
            <dl>
              <div className="comp-outcome-notes-see-more">
                <dt />
                <dd>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    id="notes-see-more-button"
                    onClick={() => setShowFullNote(!showFullNote)}
                  >
                    {showFullNote ? "Hide full note" : "See full note"}
                  </Button>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
