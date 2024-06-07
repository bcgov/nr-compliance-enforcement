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
      setNotesError("Additional notes required");
    }
  };

  const validateInput = (): boolean => {
    return !!currentNotes;
  };

  return (
    <section className="comp-details-section">
      <div className="comp-details-section-header">
        <h3>Additional notes</h3>
      </div>
      <div className="comp-details-form">
        <p className="comp-details-form-desc">
          Use this field to add critical contextual information not reported in the form above.
        </p>
        <div className="comp-details-form-row">
          <label
            htmlFor="supporting-notes-textarea-id"
            hidden
          >
            Notes
          </label>
          <ValidationTextArea
            className="comp-form-control"
            id="supporting-notes-textarea-id"
            aria-label="Additional notes"
            defaultValue={currentNotes}
            rows={4}
            errMsg={notesError}
            onChange={handleNotesChange}
          />
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
          <div className="comp-details-input full-width">
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
    </section>
  );
};
