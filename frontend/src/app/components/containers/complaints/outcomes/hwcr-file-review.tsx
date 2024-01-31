import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { CompSelect } from "../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../../hooks/hooks";
import { profileDisplayName, profileInitials } from "../../../../store/reducers/app";
import { formatDate } from "../../../../common/methods";
import { BsPencil } from "react-icons/bs";

export const HWCRFileReview: FC = () => { 
    
    const REQUEST_REVIEW_STATE = 0;
    const COMPLETE_REVIEW_STATE = 1;
    const EDIT_STATE = 2;
    const DISPLAY_STATE = 3;
    const [componentState, setComponentState] = useState<number>(REQUEST_REVIEW_STATE);
    const [supportingNotes, setSupportingNotes] = useState<string>("");

    const handleStateChange = (value: number) => {
        setComponentState(value);
      };

    const handleFileReviewSave = () => {
    };

    const handleFileReviewCancel = () => {

    };

    const initials = useAppSelector(profileInitials);
    const displayName = useAppSelector(profileDisplayName);
    
    return (
        <div className="comp-outcome-report-block">
            <h6>File review</h6>
            <div className="comp-outcome-report-file-review">
                    <div className="comp-details-edit-container">
                        <div className="comp-details-label-input-pair" id="review-required-supporting-notes-pair-id">
                        <label className="form-check-label" htmlFor="review-required">Review required</label>
                        <input className="form-check-input" id="review-required" type="checkbox" />
                        </div>
                    </div>
                    <div className="comp-details-edit-container">
                    <div className="comp-details-label-input-pair" id="review-complete-supporting-notes-id">
                        <label className="form-check-label" htmlFor="review-complete">Review complete</label>
                        <input className="form-check-input" id="review-complete" type="checkbox" />
                    </div>
                    </div>
                <div className="comp-details-edit-container">
                        <div className="comp-details-edit-column">
                            <div className="comp-details-label-input-pair" id="supporting-notes-pair-id">
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
                                    wrapperClassName="comp-details-edit-calendar-input"
                                    readOnly
                                    disabled
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
                                onClick={handleFileReviewCancel}
                                >
                                Cancel
                            </Button>
                            <Button
                                id="supporting-notes-save-button"
                                title="Save Supporting Notes"
                                className="comp-outcome-save"
                                onClick={handleFileReviewSave}
                                >
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="comp-details-edit-container">
                        <div className="comp-details-label-input-pair" id="review-required-supporting-notes-pair-id">
                        <label className="form-check-label" htmlFor="review-required">Review required</label>
                        <input className="form-check-input" id="review-required" type="checkbox" checked disabled/>
                        </div>
                    </div>
                    <div className="comp-details-edit-container">
                        <div className="comp-details-label-input-pair" id="review-complete-supporting-notes-id">
                            <label className="form-check-label" htmlFor="review-complete">Review complete</label>
                            <input className="form-check-input" id="review-complete" type="checkbox" checked disabled />
                        </div>
                    </div>
                    <div className="comp-details-edit-container">
                                    <div className="comp-details-edit-column" id="complaint-supporting-officer-div">
                                        <div className="comp-details-content-label">Officer</div>
                                        <div
                                            data-initials-listview={initials}
                                            className="comp-profile-avatar comp-details-content"
                                        >{displayName}
                                        </div>
                                    </div>
                                    <div className="comp-details-edit-column" id="complaint-supporting-date-div">
                                        <div className="comp-details-content-label">Date</div>
                                        <div
                                            className="bi comp-margin-right-xxs comp-details-content"
                                            id="complaint-complaint-supporting-date"
                                            >{formatDate(new Date().toString())}
                                        </div>
                                    </div>
                                    <div className="supporting-width"></div>
                                    <div className="comp-details-right-column">
                            <Button
                                id="details-screen-edit-button"
                                title="Edit Complaint"
                                variant="outline-primary"
                                onClick={e => handleStateChange(EDIT_STATE)}
                                >
                                <span>Edit</span>
                                <BsPencil />
                            </Button>
                        </div>
                            </div>
                </div>
        </div>
    );
};
  