import { FC } from "react";
import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import {
  closeModal,
  selectCallback,
  selectClosingCallback,
  selectModalData,
  selectModalOpenState,
  selectModalSize,
  selectModalType,
} from "../../store/reducers/app";
import { MODAL_COMPONENTS } from "./model-components";
import { setOfficersInZone } from "../../store/reducers/assign-officers";

export const ModalComponent: FC = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectModalOpenState);
  const modalSize = useAppSelector(selectModalSize);
  const modalType = useAppSelector(selectModalType);
  const modalData = useAppSelector(selectModalData);
  const callback = useAppSelector(selectCallback);
  const closingCallback = useAppSelector(selectClosingCallback)

  const Content = MODAL_COMPONENTS[modalType];

  const submitModal = (data: any) => {
    if(callback){
      callback()
    }
    dispatch(closeModal());
  };

  const handleCloseModal = () => {
    dispatch(setOfficersInZone({}));
    if(closingCallback){
      closingCallback()
    }
    dispatch(closeModal());
  };

  return (
    <Modal
      size={modalSize}
      show={isOpen}
      onHide={handleCloseModal}
      centered
    >
      {modalType && (
        <Content
          {...modalData}
          close={handleCloseModal}
          submit={(data: any) => submitModal(data)}
        />
      )}
    </Modal>
  );
};
