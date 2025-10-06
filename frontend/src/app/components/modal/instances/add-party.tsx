import { FC, memo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { PartyListSearch } from "@/app/components/common/party-list-search";
import { Party } from "@/generated/graphql";

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type AddPartyModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddPartyModal: FC<AddPartyModalProps> = ({ close, submit }) => {
  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);

  // Vars
  const { title } = modalData;

  // State
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSearchPartyChange = (selected: Party) => {
    setSelectedParty(selected);
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {loading && <ModalLoading />}
        <div
          className="comp-details-body"
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          <div
            className="comp-details-form-row"
            id="add-party-div"
            style={{ paddingBottom: "16px" }}
          >
            <label htmlFor="createAddCase">Search for an existing party</label>
            <div
              className="comp-details-input full-width"
              style={{ width: "100%" }}
            >
              <PartyListSearch
                id="createParty"
                onChange={(e: Party) => handleSearchPartyChange(e)}
                errorMessage={errorMessage}
              />
            </div>
          </div>
          {selectedParty?.person && (
            <>
              <h4>Person details</h4>
              <div className="comp-details-form-row">
                <div className="col-md-6">
                  <strong>First Name:</strong>
                  <p id="selected-party-firstName">{selectedParty?.person?.firstName}</p>
                </div>
                <div className="col-md-6">
                  <strong>Last Name:</strong>
                  <p id="selected-party-firstName">{selectedParty?.person?.lastName}</p>
                </div>
              </div>
            </>
          )}
          {selectedParty?.business && (
            <>
              <h4>Business details</h4>
              <div className="comp-details-form-row">
                <div className="col-md-6">
                  <strong>Business name:</strong>
                  <p id="selected-party-businessName">{selectedParty?.business?.name}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-party-cancel-button"
            title="Cancel Add Party"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-party-save-button"
            title="Save Add Party"
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
