import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { BsPencil, BsPlusCircle } from "react-icons/bs";
import { ValidationTextArea } from "../../../../common/validation-textarea";
import { CompSelect } from "../../../common/comp-select";
import DatePicker from "react-datepicker";
import { profileDisplayName, profileInitials } from "../../../../store/reducers/app";
import { useAppSelector } from "../../../../hooks/hooks";
import { formatDate } from "../../../../common/methods";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";


export const HWCRSupplementalNotes: FC = () => {  
    const maxCharacters = 4000;
    const ADD_STATE = 0;
    const EDIT_STATE = 1;
    const DISPLAY_STATE = 2;
    const [currentCharactersState, setCurrentCharactersState] = useState<number>(0);
    const [componentState, setComponentState] = useState<number>(0);
    const [supportingNotes, setSupportingNotes] = useState<string>("");

    const handleStateChange = (value: number) => {
        setComponentState(value);
      };
    
    const handleSupportingNotesChange = (value: string) => {
        setSupportingNotes(value);
        setCurrentCharactersState(value.length);
    };

    const handleSupportingNotesSave = () => {
        handleStateChange(DISPLAY_STATE);
    };

    const handleSupportingNotesCancel = () => {
        setSupportingNotes("");
        setCurrentCharactersState(0);
        handleStateChange(ADD_STATE);
    };

    const initials = useAppSelector(profileInitials);
    const displayName = useAppSelector(profileDisplayName);

    return (
        <div className="comp-outcome-report-block">
            <h6>Supporting notes</h6>
            {componentState === ADD_STATE && (
                <div className="comp-outcome-report-button">
                    <Button
                        id="outcome-report-add-outcome"
                        title="Add outcome"
                        variant="primary"
                        onClick={e => handleStateChange(EDIT_STATE)}>
                        <span>Add supporting notes</span>
                        <BsPlusCircle />
                    </Button>
                </div>
            )}
            {componentState === EDIT_STATE && (
                <div className="comp-outcome-supporting-notes">
                    <div>
                    <ValidationTextArea
                      className="comp-form-control"
                      id="supporting-notes-textarea-id"
                      defaultValue={supportingNotes}
                      placeholderText="Add supporting notes"
                      rows={4}
                      errMsg=""
                      onChange={handleSupportingNotesChange}
                      maxLength={maxCharacters}
                    />
                    </div>
                    <div className="right-float">
                        {currentCharactersState} / {maxCharacters}
                    </div>
                    <div className="clear-right-float" />
                    <div className="comp-details-edit-container">
                        <div className="comp-details-edit-column">
                            <div className="comp-details-label-input-pair" id="officer-supporting-notes-pair-id">
                                <label id="officer-supporting-notes-pair-id" htmlFor="officer-supporting-notes-select-id">Officer</label>
                                <CompSelect
                                    id="officer-supporting-notes-select-id"
                                    classNamePrefix="comp-select"
                                    className="comp-details-input"
                                    isDisabled={true}
                                    enableValidation={false}
                                    value={{ value: displayName, label: displayName }}
                                />
                            </div>
                        </div>
                        <div className="comp-details-edit-column comp-details-right-column">
                            <div className="comp-details-label-input-pair" id="supporting-notes-time-pair-id">
                                <label htmlFor="supporting-notes-time-pair-id">Date</label>
                                <DatePicker
                                    id="supporting-notes-time-pair-id"
                                    selected={new Date()}
                                    onChange={e => (e)}
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
                                onClick={handleSupportingNotesCancel}
                                >
                                Cancel
                            </Button>
                            <Button
                                id="supporting-notes-save-button"
                                title="Save Supporting Notes"
                                className="comp-outcome-save"
                                onClick={handleSupportingNotesSave}
                                >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {componentState === DISPLAY_STATE && (
                <div className="comp-outcome-supporting-notes">
                    <div className="comp-details-edit-container">
                        <div className="comp-details-edit-column">
                            <p>
                                {supportingNotes}
                            </p>
                            <div className="comp-details-edit-container">
                                <div className="comp-details-edit-column">
                                        <div className="comp-details-label-div-pair">
                                            <label className="comp-details-inner-content-label" htmlFor="comp-review-required-officer">Officer</label>
                                            <div
                                                data-initials-sm={initials}
                                                className="comp-orange-avatar-sm comp-details-inner-content"
                                            >
                                                <span id="comp-review-required-officer" className="comp-padding-left-xs">{displayName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comp-details-edit-column" id="complaint-supporting-date-div">
                                        <div className="comp-details-label-div-pair">
                                            <label className="comp-details-inner-content-label" htmlFor="file-review-supporting-date">Date</label>
                                            <div
                                                className="bi comp-margin-right-xxs comp-details-inner-content"
                                                id="file-review-supporting-date"
                                            >{formatDate(new Date().toString())}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="supporting-width"></div>
                            </div>
                        </div>
                        <div className="comp-details-right-column">
                            <CompTextIconButton
                                buttonClasses="button-text"
                                text="Edit"
                                icon={BsPencil}
                                click={e => handleStateChange(EDIT_STATE)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
  