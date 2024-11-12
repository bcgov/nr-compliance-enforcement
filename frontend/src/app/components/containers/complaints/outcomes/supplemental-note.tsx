import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { SupplementalNotesInput } from "./supplemental-notes/supplemental-notes-input";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectCurrentOfficer } from "../../../../store/reducers/officer";
import { SupplementalNotesItem } from "./supplemental-notes/supplemental-notes-item";
import { useParams } from "react-router-dom";
import { selectSupplementalNote } from "../../../../store/reducers/case-selectors";
import { openModal } from "../../../../store/reducers/app";
import { DELETE_NOTE } from "../../../../types/modal/modal-types";
import { setIsInEdit } from "../../../../store/reducers/cases";
import { ComplaintParams } from "../details/complaint-details-edit";

export const SupplementalNote: FC = () => {
  const { id = "", complaintType = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  const officer = useAppSelector(selectCurrentOfficer());
  const supplementalNote = useAppSelector(selectSupplementalNote);

  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    dispatch(setIsInEdit({ note: showInput }));
    return () => {
      dispatch(setIsInEdit({ note: false }));
    };
  }, [dispatch, showInput]);

  const openDeleteSupplementalNoteModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_NOTE,
        data: {
          title: "Delete supplemental note",
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
        <>
          <div className="comp-details-section-header">
            <h3>Additional notes</h3>
          </div>
          <Button
            variant="primary"
            id="outcome-report-add-note"
            title="Add additional notes"
            onClick={(e) => setShowInput(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add notes</span>
          </Button>
        </>
      );
    } else {
      const { note } = supplementalNote;
      return (
        <SupplementalNotesInput
          id={id}
          complaintType={complaintType}
          notes={note}
          currentOfficer={officer}
          setShowInput={setShowInput}
          mode={!action ? "create" : "update"}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInput, id, officer, supplementalNote]);

  return (
    <section
      id="outcome-note"
      className="comp-details-section mb-4"
    >
      {renderNote}
    </section>
  );
};
