import { FC, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { SupplementalNotesInput } from "./supplemental-notes/supplemental-notes-input";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectCurrentOfficer } from "../../../../store/reducers/officer";
import { SupplementalNotesItem } from "./supplemental-notes/supplemental-notes-item";
import { useParams } from "react-router-dom";
import { selectSupplementalNote } from "../../../../store/reducers/case-selectors";

type ComplaintParams = {
  id: string;
};

export const HWCRSupplementalNotes: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();

  const officer = useAppSelector(selectCurrentOfficer());
  const supplementalNote = useAppSelector(selectSupplementalNote);

  const [showInput, setShowInput] = useState(false);

  const renderNote = useMemo(() => {
    const { action, note } = !supplementalNote ? { action: undefined, note: "" } : supplementalNote;

    if (action && !showInput) {
      return (
        <SupplementalNotesItem
          notes={note}
          action={action}
          enableEditMode={setShowInput}
        />
      );
    } else if (!showInput) {
      return (
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-note"
            title="Add outcome"
            variant="primary"
            onClick={(e) => setShowInput(true)}
          >
            <span>Add supporting notes</span>
            <BsPlusCircle />
          </Button>
        </div>
      );
    } else {
      const { note } = supplementalNote;
      return (
        <SupplementalNotesInput
          id={id}
          notes={note}
          currentOfficer={officer}
          setShowInput={setShowInput}
          mode={!action ? "create" : "update"}
        />
      );
    }
  }, [showInput, id, officer, supplementalNote]);

  return (
    <div className="comp-outcome-report-block">
      <h6>Supporting notes</h6>
      {renderNote}
    </div>
  );
};
