import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { deleteNote, getCaseFile } from "@/app/store/reducers/complaint-outcome-thunks";

type props = {
  close: () => void;
  submit: () => void;
};

export const DeleteNoteModal: FC<props> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, description, ok, cancel, complaintOutcomeGuid, id } = modalData;

  const handleSubmit = () => {
    dispatch(deleteNote(complaintOutcomeGuid, id))
      .then((res) => {
        if (res === "success") {
          dispatch(getCaseFile(complaintOutcomeGuid));
        }
      })
      .finally(() => {
        submit();
      });
  };
  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          {" "}
          {/* set true / false to display the close button */}
          <Modal.Title>{title}</Modal.Title>
          {/* <!-- additional header content should go here --> */}
        </Modal.Header>
      )}
      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          {cancel}
        </Button>
        <Button
          id="confirm-delete-note-button"
          onClick={() => handleSubmit()}
        >
          {ok}
        </Button>
      </Modal.Footer>
    </>
  );
};
