import { FC, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { SupplementalNotesInput } from "./supplemental-notes/supplemental-notes-input";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectCurrentOfficer } from "../../../../store/reducers/officer";
import { SupplementalNotesItem } from "./supplemental-notes/supplemental-notes-item";
import { useParams } from "react-router-dom";
import { selectSupplementalNote } from "../../../../store/reducers/case-selectors";
import { openModal } from "../../../../store/reducers/app";
import { DELETE_NOTE } from "../../../../types/modal/modal-types";

type ComplaintParams = {
  id: string;
};

export const HWCRSupplementalNotes: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  const officer = useAppSelector(selectCurrentOfficer());
  const supplementalNote = useAppSelector(selectSupplementalNote);

  const [showInput, setShowInput] = useState(false);

  const openDeleteSupplementalNoteModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_NOTE,
        data: {
          title: "Delete Supplemental Note",
          description: "All the data in this section will be lost.",
          caseIdentifier: id,
          ok: "Yes, delete note",
          cancel: "No, go back",
        },
      }),
    );
  };

  const renderNote = useMemo(() => {
    const { action, note } = !supplementalNote ? { action: undefined, note: "" } : supplementalNote;
    if (action?.activeIndicator && !showInput) {
      return (
        <SupplementalNotesItem
          notes={note}
          action={action}
          enableEditMode={setShowInput}
          deleteNote={openDeleteSupplementalNoteModal}
        />
      );
    } else if (!showInput) {
      return (
        <section className="comp-details-section comp-outcome-supporting-notes">
          <div className="comp-details-section-header">
            <h3>Additional notes</h3>
          </div>
          <Button
            id="outcome-report-add-note"
            title="Add outcome"
            variant="primary"
            size="sm"
            onClick={(e) => setShowInput(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add notes</span>
          </Button>
        </section>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInput, id, officer, supplementalNote]);

  return <>{renderNote}</>;
};
