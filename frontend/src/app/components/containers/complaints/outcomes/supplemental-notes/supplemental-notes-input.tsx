import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ValidationTextArea } from "../../../../../common/validation-textarea";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import Option from "../../../../../types/app/option";
import { OfficerDto } from "../../../../../types/app/people/officer";
import { useAppDispatch } from "../../../../../hooks/hooks";
import { openModal } from "../../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../../types/modal/modal-types";
import { MAX_CHARACTERS } from "../../../../../constants/general";
import { upsertNote, getCaseFile } from "../../../../../store/reducers/case-thunks";

type props = {
  id: string;
  notes: string;
  currentOfficer: OfficerDto | null;
  mode: "create" | "update";
  setShowInput: Function;
};

export const SupplementalNotesInput: FC<props> = ({ id, notes, currentOfficer, mode, setShowInput }) => {
  const currentDate = new Date();

  const dispatch = useAppDispatch();

  const [defaultOfficer, setDefaultOfficer] = useState<Option>();

  const [currentNotes, setCurrentNotes] = useState(notes);
  const [notesError, setNotesError] = useState("");

  useEffect(() => {
    if (currentOfficer) {
      const {
        id,
        person: { firstName, lastName },
      } = currentOfficer;
      setDefaultOfficer({ label: `${firstName} ${lastName}`, value: id });
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
          title: "Cancel Changes?",
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
      dispatch(upsertNote(id, currentNotes)).then((result) => {
        if (result === "success") {
          dispatch(getCaseFile(id));
          setShowInput(false);
        }
      });
    } else {
      setNotesError("Supporting notes required");
    }
  };

  const validateInput = (): boolean => {
    return !!currentNotes;
  };

  return (
    <div className="comp-outcome-supporting-notes">
      <div>
        <ValidationTextArea
          className="comp-form-control"
          id="supporting-notes-textarea-id"
          defaultValue={currentNotes}
          placeholderText="Add supporting notes"
          rows={4}
          errMsg={notesError}
          onChange={handleNotesChange}
        />
      </div>
      <div className="clear-right-float" />
      <div className="comp-details-edit-container">
        <div className="comp-details-edit-column">
          <div
            className="comp-details-label-input-pair"
            id="officer-supporting-notes-pair-id"
          >
            <label
              id="officer-supporting-notes-pair-id"
              htmlFor="officer-supporting-notes-select-id"
            >
              Officer
            </label>
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
        <div className="comp-details-edit-column comp-details-right-column">
          <div
            className="comp-details-label-input-pair"
            id="supporting-notes-time-pair-id"
          >
            <label htmlFor="supporting-notes-time-pair-id">Date</label>
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
      </div>
      <div className="comp-outcome-report-container">
        <div className="comp-outcome-report-actions">
          <Button
            id="supporting-notes-cancel-button"
            title="Cancel Supporting Notes"
            className="comp-outcome-cancel"
            onClick={handleCancelChanges}
          >
            Cancel
          </Button>
          <Button
            id="supporting-notes-save-button"
            title="Save Supporting Notes"
            className="comp-outcome-save"
            onClick={handleSaveNotes}
          >
            {mode === "create" ? "Add" : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};
