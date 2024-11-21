import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { Button, Modal } from "react-bootstrap";
import { deleteAnimalOutcome, getCaseFile } from "@store/reducers/case-thunks";

type props = {
  close: () => void;
  submit: () => void;
};

export const DeleteAnimalOutcomeModal: FC<props> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const { title, description, ok, cancel } = modalData;

  const handleSubmit = () => {
    const { outcomeId, caseFileId } = modalData;

    if (caseFileId) {
      dispatch(deleteAnimalOutcome(outcomeId))
        .then((res) => {
          if (res === "success") {
            dispatch(getCaseFile(caseFileId));
          }
        })
        .finally(() => {
          submit();
        });
    }
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
        <div className="cancel_confirm_modal_description">{description}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          {cancel}
        </Button>
        <Button onClick={() => handleSubmit()}>{ok}</Button>
      </Modal.Footer>
    </>
  );
};
