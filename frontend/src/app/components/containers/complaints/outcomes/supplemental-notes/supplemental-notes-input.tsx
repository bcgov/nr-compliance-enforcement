import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ValidationTextArea } from "../../../../../common/validation-textarea";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import Option from "../../../../../types/app/option";
import { OfficerDto } from "../../../../../types/app/people/officer";

type props = {
  notes: string;
  currentOfficer: OfficerDto | null;
};

export const SupplementalNotesInput: FC<props> = ({ notes, currentOfficer }) => {
  const maxCharacters = 4000;
  const [defaultOfficer, setDefaultOfficer] = useState<Option>();

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

  return (
    <div className="comp-outcome-supporting-notes">
      <div>
        <ValidationTextArea
          className="comp-form-control"
          id="supporting-notes-textarea-id"
          defaultValue={notes}
          placeholderText="Add supporting notes"
          rows={4}
          errMsg=""
          onChange={() => {}}
          maxLength={maxCharacters}
        />
      </div>
      <div className="right-float">
        {notes.length} / {maxCharacters}
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
              selected={new Date()}
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
            // onClick={handleSupportingNotesCancel}
          >
            Cancel
          </Button>
          <Button
            id="supporting-notes-save-button"
            title="Save Supporting Notes"
            className="comp-outcome-save"
            // onClick={handleSupportingNotesSave}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
