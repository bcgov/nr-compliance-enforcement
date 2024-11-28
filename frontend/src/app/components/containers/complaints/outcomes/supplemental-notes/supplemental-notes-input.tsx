import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ValidationTextArea } from "@common/validation-textarea";
import { CompSelect } from "@components/common/comp-select";
import DatePicker from "react-datepicker";
import Option from "@apptypes/app/option";
import { OfficerDto } from "@apptypes/app/people/officer";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { upsertNote, getCaseFile } from "@store/reducers/case-thunks";
import { BsExclamationCircleFill } from "react-icons/bs";
import { ToggleError } from "@common/toast";

type props = {
  id: string;
  complaintType: string;
  notes: string;
  currentOfficer: OfficerDto | null;
  mode: "create" | "update";
  setShowInput: Function;
};

export const SupplementalNotesInput: FC<props> = ({ id, complaintType, notes, currentOfficer, mode, setShowInput }) => {
  const currentDate = new Date();

  const dispatch = useAppDispatch();

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  const [defaultOfficer, setDefaultOfficer] = useState<Option>();
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [notesError, setNotesError] = useState("");

  useEffect(() => {
    if (currentOfficer) {
      const {
        authorizedUserId,
        person: { firstName, lastName },
      } = currentOfficer;
      setDefaultOfficer({ label: `${lastName}, ${firstName}`, value: authorizedUserId });
    } else {
      setDefaultOfficer({ label: "Unknown", value: "" });
    }
  }, [currentOfficer]);

  const handleNotesChange = (input: string) => {
    setNotesError("");
    setCurrentNotes(input.trim());
  };

  const handleCancelChanges = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            setCurrentNotes(notes);
            setShowInput(false);
          },
        },
      }),
    );
  };

  const handleSaveNotes = () => {
    if (validateInput()) {
      dispatch(upsertNote(id, complaintType, currentNotes)).then((result) => {
        if (result === "success") {
          dispatch(getCaseFile(id));
          setShowInput(false);
        }
      });
    } else {
      setNotesError("Additional notes required");
      ToggleError("Error updating additional notes");
    }
  };

  const validateInput = (): boolean => {
    return !!currentNotes;
  };

  return (
    <>
      <div className="comp-details-section-header">
        <h3>Additional notes</h3>
      </div>
      <Card
        className="comp-outcome-supporting-notes"
        border={showSectionErrors ? "danger" : "default"}
      >
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message mb-4">
              <BsExclamationCircleFill />
              <span>Save section before closing the complaint.</span>
            </div>
          )}

          <p className="mb-4">Use this field to add critical contextual information not reported in the form above</p>

          <div className="comp-details-form">
            <div className="comp-details-form-row">
              <label htmlFor="supporting-notes-textarea-id">Notes</label>
              <div className="comp-details-input full-width">
                <ValidationTextArea
                  className="comp-form-control"
                  id="supporting-notes-textarea-id"
                  defaultValue={currentNotes}
                  rows={4}
                  errMsg={notesError}
                  onChange={handleNotesChange}
                />
              </div>
            </div>

            <div
              className="comp-details-form-row"
              id="officer-supporting-notes-pair-id"
            >
              <label
                id="officer-supporting-notes-pair-id"
                htmlFor="officer-supporting-notes-select-id"
              >
                Officer
              </label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="officer-supporting-notes-select-id"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  isDisabled={true}
                  enableValidation={false}
                  value={defaultOfficer}
                />
              </div>
            </div>

            <div
              className="comp-details-form-row"
              id="supporting-notes-time-pair-id"
            >
              <label htmlFor="supporting-notes-time-pair-id">Date</label>
              <div className="comp-details-input">
                <DatePicker
                  id="supporting-notes-time-pair-id"
                  selected={currentDate}
                  onChange={(e) => e}
                  dateFormat="yyyy-MM-dd"
                  wrapperClassName="comp-details-edit-calendar-input datepicker-disabled"
                  readOnly
                  disabled
                  showIcon
                />
              </div>
            </div>

            <div className="comp-details-form-buttons">
              <Button
                variant="outline-primary"
                id="supporting-notes-cancel-button"
                title="Cancel Additional Notes"
                onClick={handleCancelChanges}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                id="supporting-notes-save-button"
                title="Save Additional Notes"
                onClick={handleSaveNotes}
              >
                {mode === "create" ? "Add" : "Update"}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
