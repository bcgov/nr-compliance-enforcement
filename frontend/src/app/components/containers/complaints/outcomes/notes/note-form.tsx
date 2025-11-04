import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ValidationTextArea } from "@common/validation-textarea";
import { CompSelect } from "@components/common/comp-select";
import DatePicker from "react-datepicker";
import Option from "@apptypes/app/option";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { upsertNote, getCaseFile } from "@/app/store/reducers/complaint-outcome-thunks";
import { BsExclamationCircleFill } from "react-icons/bs";
import { ToggleError } from "@common/toast";
import { Note } from "@/app/types/outcomes/note";
import UserService from "@/app/service/user-service";

type props = {
  id: string;
  complaintType: string;
  note?: Note;
  currentOfficer: AppUser | null;
  mode: "create" | "update";
  handleCancel: Function;
};

export const NoteForm: FC<props> = ({ id, complaintType, note, currentOfficer, mode, handleCancel }) => {
  const currentDate = new Date();

  const dispatch = useAppDispatch();

  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  const [defaultOfficer, setDefaultOfficer] = useState<Option>();
  const [currentNote, setCurrentNote] = useState(note?.note ?? "");
  const [notesError, setNotesError] = useState("");

  useEffect(() => {
    if (currentOfficer) {
      const { auth_user_guid, first_name, last_name } = currentOfficer;
      setDefaultOfficer({ label: `${last_name}, ${first_name}`, value: auth_user_guid });
    } else {
      setDefaultOfficer({ label: "Unknown", value: "" });
    }
  }, [currentOfficer]);

  const handleNotesChange = (input: string) => {
    setNotesError("");
    setCurrentNote(input.trim());
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
            setCurrentNote(note?.note ?? "");
            handleCancel();
          },
        },
      }),
    );
  };

  const handleSaveNotes = () => {
    if (validateInput()) {
      dispatch(upsertNote(id, complaintType, currentNote, UserService.getUserAgency(), note?.id)).then((result) => {
        if (result === "success") {
          dispatch(getCaseFile(id));
          handleCancel();
        }
      });
    } else {
      setNotesError("Additional notes required");
      ToggleError("Error updating additional notes");
    }
  };

  const validateInput = (): boolean => {
    return !!currentNote;
  };

  return (
    <Card
      className="comp-outcome-notes"
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
          <div
            className="comp-details-form-row"
            id="officer-supporting-notes-pair-id"
          >
            <label
              id="officer-supporting-notes-pair-id"
              htmlFor="officer-supporting-notes-select-id"
            >
              {mode === "create" ? "Created by" : "Updated by"}
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="officer-supporting-notes-select-id"
                classNamePrefix="comp-select"
                className="comp-details-input"
                isDisabled={true}
                enableValidation={false}
                value={defaultOfficer}
                showInactive={false}
              />
            </div>
          </div>

          <div
            className="comp-details-form-row"
            id="supporting-notes-time-pair-id"
          >
            <label htmlFor="supporting-notes-time-pair-id">Date logged</label>
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
          <div className="comp-details-form-row">
            <label htmlFor="supporting-notes-textarea-id">
              Note<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <ValidationTextArea
                className="comp-form-control"
                id="supporting-notes-textarea-id"
                defaultValue={currentNote}
                rows={8}
                errMsg={notesError}
                onChange={handleNotesChange}
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
  );
};
