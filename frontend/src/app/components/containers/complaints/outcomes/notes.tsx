import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { selectIsInEdit, selectNotes } from "@store/reducers/case-selectors";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { Note } from "./notes/note";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";

export const Notes: FC = () => {
  const { id = "", complaintType = "" } = useParams<ComplaintParams>();
  const isInEdit = useAppSelector(selectIsInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const notes = useAppSelector(selectNotes);

  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    if (!isInEdit.notes) {
      setShowAddNote(false);
    }
  }, [isInEdit.notes]);

  return (
    <section
      id="outcome-note"
      className="comp-details-section mb-4"
    >
      <div className="comp-details-section-header">
        <h3>Additional notes</h3>
      </div>
      {notes?.map((noteItem: any) => (
        <Note
          key={noteItem.id}
          id={id}
          complaintType={complaintType}
          note={noteItem}
        />
      ))}
      {showAddNote && (
        <Note
          id={id}
          complaintType={complaintType}
        />
      )}
      {!isInEdit.notes && !showAddNote && (
        <Button
          variant="primary"
          id="outcome-report-add-note"
          title="Add additional notes"
          onClick={(e) => setShowAddNote(true)}
          disabled={isReadOnly}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Add note</span>
        </Button>
      )}
    </section>
  );
};
