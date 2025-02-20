import { FC, useState } from "react";
import { useAppSelector } from "@hooks/hooks";
import { formatDate, formatTime } from "@common/methods";

import { CaseAction } from "@apptypes/outcomes/case-action";
import { Badge, Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";
import { selectOfficers } from "@/app/store/reducers/officer";

type props = {
  note: string;
  actions?: CaseAction[];
  handleEdit: Function;
  handleDelete: Function;
};

const getActorDisplayName = (actor: string, officers: any) => {
  const officer = officers?.find((item: { auth_user_guid: string }) => item.auth_user_guid === actor);
  return officer ? `${officer.person_guid.last_name}, ${officer.person_guid.first_name}` : "";
};

const longNoteLength = 300;

export const NoteItem: FC<props> = ({ note, actions = [], handleEdit, handleDelete }) => {
  const officers = useAppSelector(selectOfficers);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const displayName = getActorDisplayName(actions[0].actor, officers);

  const isLongNote = note.length > longNoteLength;
  const [showFullNote, setShowFullNote] = useState(false);

  const updateUserTooltip = (props: any) => (
    <Tooltip
      id="button-tooltip"
      className="comp-outcome-notes-tooltip"
      {...props}
    >
      {actions.slice(1).map((action) => (
        <div key={action.actor}>
          <span>{getActorDisplayName(action.actor, officers)}</span>
          <span>
            {` (${formatDate(new Date(action.date).toString())} ${formatTime(new Date(action.date).toString())})`}
          </span>
        </div>
      ))}
    </Tooltip>
  );

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
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={updateUserTooltip}
                    >
                      <Badge className="badge comp-status-badge-closed">
                        Updated {actions.length - 1} times <i className="bi bi-info-circle" />
                      </Badge>
                    </OverlayTrigger>
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
          {isLongNote && (
            <div className="comp-outcome-notes-expand-collapse-button">
              <button
                className="comp-icon-button-container"
                onClick={() => setShowFullNote(!showFullNote)}
              >
                {showFullNote ? <i className="bi bi-chevron-up h2"></i> : <i className="bi bi-chevron-down h2"></i>}
              </button>
            </div>
          )}
          <div>
            <dl />
            <dl>
              <div>
                <dt>Note</dt>
                <dd className={!showFullNote && isLongNote ? "comp-outcome-notes-fade" : ""}>
                  <button
                    onClick={() => setShowFullNote(!showFullNote)}
                    className="comp-outcome-notes-note"
                  >
                    <pre id="additional-note-text">
                      {showFullNote && note}
                      {!showFullNote && note.substring(0, longNoteLength)}
                      {!showFullNote && isLongNote && " ..."}
                    </pre>
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
