import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { CompInput } from "../../../common/comp-input";
import { openModal } from "../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { selectComplaint, updateComplaintById } from "../../../../store/reducers/complaints";
import { getComplaintType } from "../../../../common/methods";

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

    //determine if there is existing data on the complaint, otherwise set to blank
    const refNum = complaintData?.referenceNumber ? complaintData?.referenceNumber : "";
    setReferenceNumber(refNum);

    if (refNum !== "") {
      //there is data - display the view
      setIsEditable(false);
    } else setIsEditable(true); //allow the field to be editable
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

  // function for form validation
  const isValid = (): boolean => {
    if (!referenceNumber) {
      setReferenceNumberError("COORS number is required.");
      return false;
    }

    if (!referenceNumber.match(/^\d{1,10}$/)) {
      setReferenceNumberError("COORS number should include only numbers.");
      return false;
    }

    return true;
  };

  // Clear out existing validation errors
  const resetValidationErrors = () => {
    setReferenceNumberError("");
  };

  // function for handling the save button
  const handleExternalFileReferenceSave = () => {
    if (complaintData && isValid()) {
      resetValidationErrors();
      let data = { ...complaintData, referenceNumber: referenceNumber };
      setIsEditable(false);

      let complaintType = getComplaintType(complaintData);

      dispatch(updateComplaintById(data, complaintType));
    }
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
                id="review-edit-button"
                onClick={(e) => setIsEditable(true)}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit</span>
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
                    <label htmlFor="external-file-reference-number">COORS Number</label>
                    <CompInput
                      id="external-file-reference-number"
                      divid="external-file-reference-number-div"
                      type="input"
                      inputClass="comp-form-control"
                      value={referenceNumber}
                      error={referenceNumberError}
                      maxLength={10}
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
                  <div id="file-review-officer-id">
                    <dt>COORS Number</dt>
                    <dd>
                      <span id="comp-review-required-officer">{referenceNumber}</span>
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
