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
    const [reviewRequired, setReviewRequired] = useState<boolean>(false);
    const [reviewCompleted, setReviewCompleted] = useState<boolean>(false);

    const handleStateChange = (value: number) => {
        setComponentState(value);
    };

    const handleFileReviewSave = () => {
        if(componentState === EDIT_STATE)
        {
            setComponentState(DISPLAY_STATE);
        }
    };

    const handleFileReviewCancel = () => {
        if(componentState === EDIT_STATE)
        {
            setComponentState(COMPLETE_REVIEW_STATE);
            setReviewCompleted(false);
        }
    };

    const handleReviewRequiredClick = () => {
        if(!reviewRequired)
        {
            setComponentState(COMPLETE_REVIEW_STATE);
        }
        else
        {
            setComponentState(REQUEST_REVIEW_STATE);
            setReviewCompleted(false);
        }
        setReviewRequired(!reviewRequired);
    };

    const handleReviewCompleteClick = () => {
        if(!reviewCompleted)
        {
            setComponentState(EDIT_STATE);
        }
        else
        {
            setComponentState(COMPLETE_REVIEW_STATE);
        }
        setReviewCompleted(!reviewCompleted);
    };

    const initials = useAppSelector(profileInitials);
    const displayName = useAppSelector(profileDisplayName);

    return (
        <div className="comp-outcome-report-block">
            <h6>File review</h6>
            <div className="comp-outcome-report-file-review">
                {(componentState === REQUEST_REVIEW_STATE || componentState === COMPLETE_REVIEW_STATE || componentState === EDIT_STATE) && (<div className="comp-details-edit-container">
                    <div className="comp-details-label-input-pair" id="review-required-file-review-pair-id">
                        <label className="form-check-label" htmlFor="review-required">Review required</label>
                        <input className="form-check-input" id="review-required" type="checkbox" checked={reviewRequired} onChange={handleReviewRequiredClick} />
                    </div>
                </div>)}
                {(componentState === COMPLETE_REVIEW_STATE || componentState === EDIT_STATE) && (
                <div className="comp-details-edit-container">
                    <div className="comp-details-label-input-pair" id="review-complete-file-review-id">
                        <label className="form-check-label" htmlFor="review-complete">Review complete</label>
                        <input className="form-check-input" id="review-complete" type="checkbox" checked={reviewCompleted} onClick={handleReviewCompleteClick} />
                    </div>
                </div>)}
                {componentState === EDIT_STATE && (
                <div className="comp-details-edit-container">
                    <div className="comp-details-edit-column">
                        <div className="comp-details-label-input-pair" id="file-review-pair-id">
                            <label id="officer-file-review-pair-id" htmlFor="officer-file-review-select-id">Officer</label>
                            <CompSelect
                                id="officer-file-review-select-id"
                                classNamePrefix="comp-select"
                                className="comp-details-input"
                                isDisabled={true}
                                enableValidation={false}
                                value={{ value: displayName, label: displayName }}
                            />
                        </div>
                    </div>
                    <div className="comp-details-edit-column comp-details-right-column">
                        <div className="comp-details-label-input-pair" id="file-review-time-pair-id">
                            <label htmlFor="file-review-time-pair-id">Date</label>
                            <DatePicker
                                id="file-review-time-pair-id"
                                selected={new Date()}
                                onChange={e => (e)}
                                dateFormat="yyyy-MM-dd"
                                wrapperClassName="comp-details-edit-calendar-input datepicker-disabled"
                                showIcon
                                readOnly
                                disabled
                            />
                        </div>
                    </div>
                </div>)}
                {componentState !== DISPLAY_STATE && (
                <div className="comp-outcome-report-container">
                    <div className="comp-outcome-report-actions">
                        <Button
                            id="file-review-cancel-button"
                            title="Cancel File Review"
                            className="comp-outcome-cancel"
                            onClick={handleFileReviewCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            id="file-review-save-button"
                            title="Save File Review"
                            className="comp-outcome-save"
                            onClick={handleFileReviewSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>)}
                {componentState === DISPLAY_STATE && (<div className="comp-details-edit-container">
                    <div className="comp-details-edit-column">
                        <div className="comp-details-edit-container">
                            <div className="comp-details-edit-column">
                                <div className="comp-details-label-input-pair" id="review-required-file-review-notes-pair-id">
                                    <label className="form-check-label" htmlFor="review-required">Review required</label>
                                    <input className="form-check-input" id="review-required" type="checkbox" checked disabled />
                                </div>
                            </div>
                            <div className="comp-details-right-column">
                                <Button
                                    id="file-review-edit-button"
                                    title="Edit Complaint"
                                    variant="outline-primary"
                                    className="sub-section-edit-button"
                                    onClick={e => handleStateChange(EDIT_STATE)}
                                >
                                    <span>Edit</span>
                                    <BsPencil />
                                </Button>
                            </div>
                        </div>
                        <div className="comp-details-edit-container">
                            <div className="comp-details-label-input-pair" id="review-complete-file-review-notes-id">
                                <label className="form-check-label" htmlFor="review-complete">Review complete</label>
                                <input className="form-check-input" id="review-complete" type="checkbox" checked disabled />
                            </div>
                        </div>
                        <div className="comp-details-edit-container">
                            <div className="comp-details-edit-column" id="complaint-file-review-officer-div">
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
                                    <div className="comp-details-edit-column" id="complaint-file-review-date-div">
                                        <div className="comp-details-label-div-pair">
                                            <label className="comp-details-inner-content-label" htmlFor="file-review-date">Date</label>
                                            <div
                                                className="bi comp-margin-right-xxs comp-details-inner-content"
                                                id="file-review-date"
                                            >{formatDate(new Date().toString())}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="supporting-width"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    );
};
