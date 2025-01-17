import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { CompInput } from "@components/common/comp-input";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM, DELETE_CONFIRM } from "@apptypes/modal/modal-types";
import { getComplaintById, selectComplaint, updateComplaintById } from "@store/reducers/complaints";
import { getComplaintType } from "@common/methods";

export const ExternalFileReference: FC = () => {
  const dispatch = useAppDispatch();

  const complaintData = useAppSelector(selectComplaint);

  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [referenceNumberError, setReferenceNumberError] = useState<string>("");

  // State Management for when reference number changes, or page is first loaded
  useEffect(() => {
    if (complaintData?.referenceNumber) {
      setReferenceNumber(complaintData.referenceNumber);
      setIsEditable(false);
    } else setIsEditable(true);
  }, [complaintData?.referenceNumber]);

  // function for handling the cancel modal
  const cancelConfirmed = () => {
    resetValidationErrors();

    if (complaintData) {
      if (complaintData.referenceNumber !== "") {
        setIsEditable(false);
      } else setIsEditable(true); //allow the field to be editable

      setReferenceNumber(complaintData.referenceNumber);
    }
  };

  // function for handling the delete  modal
  const deleteConfirmed = async () => {
    if (complaintData) {
      let data = { ...complaintData, referenceNumber: "" };
      let complaintType = getComplaintType(complaintData);
      //since the updateComplaintById thunk has an asynchronous operation inside it we need to make sure it finishes before moving on
      dispatch(updateComplaintById(data, complaintType));
      setReferenceNumber("");
      dispatch(getComplaintById(complaintData.id, complaintType));
    }
  };

  // Clear out existing validation errors
  const resetValidationErrors = () => {
    setReferenceNumberError("");
  };

  // function for form validation
  const isValid = (): boolean => {
    resetValidationErrors();
    if (!referenceNumber) {
      setReferenceNumberError("COORS number is required.");
      return false;
    }

    if (!/^\d{1,20}$/.test(referenceNumber)) {
      setReferenceNumberError("Invalid format. Please only include numbers.");
      return false;
    }

    return true;
  };

  // function for handling the save button
  const handleExternalFileReferenceSave = async () => {
    if (complaintData && isValid()) {
      let data = { ...complaintData, referenceNumber: referenceNumber };
      let complaintType = getComplaintType(complaintData);
      //since the updateComplaintById thunk has an asynchronous operation inside it we need to make sure it finishes before moving on
      dispatch(updateComplaintById(data, complaintType));
      dispatch(getComplaintById(complaintData.id, complaintType));
    }
  };

  // function for handling the delete button
  const handleExternalFileReferenceDelete = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_CONFIRM,
        data: {
          title: "Delete external file reference",
          description: "All the data in this section will be lost.",
          ok: "Yes, delete",
          cancel: "No, go back",
          deleteConfirmed,
        },
      }),
    );
  };

  // function for popping up the modal
  const handleExternalFileReferenceCancel = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  // function for keeping the value on the component in sync with redux
  const handleExternalFileReferenceChange = (value: string) => {
    setReferenceNumber(value);
  };

  return (
    <section className="comp-details-body comp-container">
      <hr className="comp-details-body-spacer"></hr>
      <section
        className="comp-details-section comp-external-file-reference"
        id="external-file-reference"
      >
        <div className="comp-details-section-header">
          <h2>External file reference</h2>
          {!isEditable && (
            <div className="comp-details-section-header-actions">
              <Button
                variant="outline-primary"
                size="sm"
                id="external-file-reference-edit-button"
                onClick={(e) => setIsEditable(true)}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                id="external-file-reference-delete-button"
                onClick={() => handleExternalFileReferenceDelete()}
              >
                <i className="bi bi-trash3"></i>
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>

        <Card>
          <Card.Body>
            <div className="comp-details-form">
              {isEditable && (
                <>
                  <div className="comp-details-form-row">
                    <label htmlFor="external-file-reference-number-input">COORS Number</label>
                    <CompInput
                      id="external-file-reference-number-input"
                      divid="external-file-reference-number-div"
                      type="input"
                      inputClass="comp-form-control"
                      value={referenceNumber}
                      error={referenceNumberError}
                      maxLength={20}
                      onChange={(evt: any) => {
                        const {
                          target: { value },
                        } = evt;
                        handleExternalFileReferenceChange(value);
                      }}
                    />
                  </div>
                  <div className="comp-details-form-buttons">
                    <Button
                      variant="outline-primary"
                      id="external-file-reference-cancel-button"
                      title="Cancel"
                      onClick={handleExternalFileReferenceCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      id="external-file-reference-save-button"
                      title="Save"
                      onClick={handleExternalFileReferenceSave}
                    >
                      Save
                    </Button>
                  </div>
                </>
              )}

              {!isEditable && (
                <dl>
                  <div id="external-file-reference-number-div">
                    <dt>COORS Number</dt>
                    <dd>
                      <span id="external-file-reference-number">{referenceNumber}</span>
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </Card.Body>
        </Card>
      </section>
    </section>
  );
};
