import { FC } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { getOfficers, updateOfficer } from "@/app/store/reducers/officer";

type props = {
  close: () => void;
  submit: () => void;
};

export const ToggleDeactivateModal: FC<props> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const { title, description, ok, cancel, app_user_guid, deactivate_ind, user_roles, auth_user_guid } = modalData;

  const handleSubmit = () => {
    dispatch(updateOfficer(app_user_guid, { deactivate_ind, user_roles, auth_user_guid }))
      .then((res) => {
        if (res === "success") {
          dispatch(getOfficers());
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
        <Button onClick={() => handleSubmit()}>{ok}</Button>
      </Modal.Footer>
    </>
  );
};
