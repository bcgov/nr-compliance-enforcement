import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { SupplementalNotesInput } from "./supplemental-notes/supplemental-notes-input";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectCurrentOfficer } from "../../../../store/reducers/officer";
import { SupplementalNotesItem } from "./supplemental-notes/supplementa-notes-item";
import { useParams } from "react-router-dom";
import { selectSupplementalNote } from "../../../../store/reducers/cases";

type ComplaintParams = {
  id: string;
};

export const HWCRSupplementalNotes: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();

  const officer = useAppSelector(selectCurrentOfficer());
  const supplementalNote = useAppSelector(selectSupplementalNote);

  const { note, action } = !supplementalNote ? { note: "", action: undefined } : supplementalNote;

  const [showInput, setShowInput] = useState(false);

  return (
    <div className="comp-outcome-report-block">
      <h6>Supporting notes</h6>
      {action && !showInput ? (
        <SupplementalNotesItem
          notes={note}
          enableEditMode={setShowInput}
        />
      ) : !showInput ? (
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-outcome"
            title="Add outcome"
            variant="primary"
            onClick={(e) => setShowInput(true)}
          >
            <span>Add supporting notes</span>
            <BsPlusCircle />
          </Button>
        </div>
      ) : (
        <SupplementalNotesInput
          id={id}
          notes={note}
          currentOfficer={officer}
          setShowInput={setShowInput}
        />
      )}
    </div>
  );
};
