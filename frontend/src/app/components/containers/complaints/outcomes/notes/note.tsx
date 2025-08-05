import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectCurrentOfficer } from "@store/reducers/officer";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { openModal } from "@store/reducers/app";
import { DELETE_NOTE } from "@apptypes/modal/modal-types";
import { Note as NoteType } from "@/app/types/outcomes/note";
import { NoteItem } from "./note-item";
import { NoteForm } from "./note-form";

type props = {
  id: string;
  complaintType: string;
  note?: NoteType;
};

export const Note: FC<props> = ({ id = "", complaintType = "", note }) => {
  const dispatch = useAppDispatch();
  const officer = useAppSelector(selectCurrentOfficer);

  const [showInput, setShowInput] = useState(!note);

  useEffect(() => {
    dispatch(setIsInEdit({ notes: showInput }));
    return () => {
      dispatch(setIsInEdit({ notes: false }));
    };
  }, [dispatch, showInput]);

  const openDeleteNoteModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_NOTE,
        data: {
          title: "Delete note",
          description: "All the data in this note will be lost.",
          complaintOutcomeGuid: id,
          ok: "Yes, delete note",
          cancel: "No, go back",
          id: note?.id,
        },
      }),
    );
  };

  return (
    <>
      {showInput ? (
        <NoteForm
          id={id}
          complaintType={complaintType}
          note={note}
          currentOfficer={officer}
          mode={note ? "update" : "create"}
          handleCancel={() => setShowInput(false)}
        />
      ) : (
        note && (
          <NoteItem
            note={note.note}
            actions={note.actions}
            handleEdit={() => setShowInput(true)}
            handleDelete={openDeleteNoteModal}
            agencyCode={note.outcomeAgencyCode}
          />
        )
      )}
    </>
  );
};
