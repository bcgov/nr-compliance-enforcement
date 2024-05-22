import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CompSelect } from "../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { openModal, profileDisplayName, profileInitials } from "../../../../store/reducers/app";
import { formatDate } from "../../../../common/methods";
import { BsPencil } from "react-icons/bs";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";
import { getComplaintById, selectComplaint } from "../../../../store/reducers/complaints";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { createReview, updateReview } from "../../../../store/reducers/case-thunks";
import ComplaintType from "../../../../constants/complaint-types";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";

export const HWCRFileReview: FC = () => {
  const REQUEST_REVIEW_STATE = 0;
  const EDIT_STATE = 1;
  const DISPLAY_STATE = 2;
  const dispatch = useAppDispatch();
  const complaintData = useAppSelector(selectComplaint);
  const personGuid = useAppSelector((state) => state.app.profile.personGuid);
  const isReviewRequired = useAppSelector((state) => state.cases.isReviewRequired);
  const reviewCompleteAction = useAppSelector((state) => state.cases.reviewComplete);
  const { officers } = useAppSelector((state) => state.officers);
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);

  const [componentState, setComponentState] = useState<number>(REQUEST_REVIEW_STATE);
  const [reviewRequired, setReviewRequired] = useState<boolean>(false);
  const [reviewCompleted, setReviewCompleted] = useState<boolean>(false);
  const [officerInitials, setOfficerInitials] = useState<string>(initials);
  const [officerName, setOfficerName] = useState<string>(displayName);
  const [reviewCompleteDate, setReviewCompleteDate] = useState<Date>(new Date());

  useEffect(() => {
    setReviewRequired(isReviewRequired);
    if (isReviewRequired) setComponentState(DISPLAY_STATE);
  }, [isReviewRequired]);

  useEffect(() => {
    if (reviewCompleteAction) {
      let initials = "UN";
      let displayName = "Unknown";
      if (officers) {
        const officer = officers.filter((person) => person.person_guid.person_guid === reviewCompleteAction.actor);
        if (officer.length > 0) {
          const {
            person_guid: { first_name: givenName, last_name: surName },
          } = officer[0];
          initials = `${givenName?.substring(0, 1)}${surName?.substring(0, 1)}`;
          displayName = `${givenName} ${surName}`;
          setOfficerInitials(initials);
          setOfficerName(displayName);
          setReviewCompleteDate(reviewCompleteAction.date);
        }
      }
      setReviewCompleted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewCompleteAction]);

  useEffect(() => {
    if (!reviewRequired) setReviewCompleted(false);
  }, [reviewRequired]);

  const handleStateChange = (value: number) => {
    setComponentState(value);
  };

  const handleFileReviewSave = () => {
    if (complaintData) {
      if (!reviewCompleted) {
        if (componentState === REQUEST_REVIEW_STATE) {
          dispatch(createReview(complaintData.id, reviewRequired, null));
        } else {
          dispatch(updateReview(complaintData.id, reviewRequired));
        }
      } else {
        const completeAction = {
          actor: personGuid,
          date: new Date(),
          actionCode: "COMPLTREVW",
        };
        dispatch(createReview(complaintData.id, reviewRequired, completeAction));
      }

      dispatch(getComplaintById(complaintData.id, COMPLAINT_TYPES.HWCR));
    }
    if (componentState === EDIT_STATE && (reviewRequired || reviewCompleted)) setComponentState(DISPLAY_STATE);
  };

  const handleFileReviewCancel = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            setReviewRequired(isReviewRequired);
            if (componentState === EDIT_STATE) {
              reviewCompleteAction ? setReviewCompleted(true) : setReviewCompleted(false);
              if (isReviewRequired) setComponentState(DISPLAY_STATE);
            }
          },
        },
      }),
    );
  };

  const handleReviewRequiredClick = () => {
    setReviewRequired(!reviewRequired);
  };

  const handleReviewCompleteClick = () => {
    setReviewCompleted(!reviewCompleted);
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>File review</h6>
      <div className="comp-outcome-report-file-review">
        {(componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) && (
          <div className="comp-details-edit-container">
            <div
              className="comp-details-label-input-pair"
              id="review-required-file-review-pair-id"
            >
              <label
                className="form-check-label"
                htmlFor="review-required"
              >
                Review required
              </label>
              <input
                className="form-check-input"
                id="review-required"
                type="checkbox"
                checked={reviewRequired}
                onChange={handleReviewRequiredClick}
              />
            </div>
          </div>
        )}
        {reviewRequired && (componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) && (
          <div className="comp-details-edit-container">
            <div
              className="comp-details-label-input-pair"
              id="review-complete-file-review-id"
            >
              <label
                className="form-check-label"
                htmlFor="review-complete"
              >
                Review complete
              </label>
              <input
                className="form-check-input"
                id="review-complete"
                type="checkbox"
                checked={reviewCompleted}
                onChange={handleReviewCompleteClick}
              />
            </div>
          </div>
        )}
        {(componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) &&
          reviewRequired &&
          reviewCompleted && (
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div
                  className="comp-details-label-input-pair"
                  id="file-review-officer-id"
                >
                  <label
                    id="officer-file-review-pair-id"
                    htmlFor="officer-file-review-select-id"
                  >
                    Officer
                  </label>
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
                <div
                  className="comp-details-label-input-pair"
                  id="file-review-time-pair-id"
                >
                  <label htmlFor="file-review-time-pair-id">Date</label>
                  <DatePicker
                    id="file-review-time-pair-id"
                    selected={new Date()}
                    onChange={(e) => e}
                    dateFormat="yyyy-MM-dd"
                    wrapperClassName="comp-details-edit-calendar-input datepicker-disabled"
                    showIcon
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          )}
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
          </div>
        )}
        {componentState === DISPLAY_STATE && (
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-edit-container">
                <div
                  className="comp-details-label-input-pair"
                  id="review-required-file-review-notes-pair-id"
                >
                  <label
                    className="form-check-label"
                    htmlFor="review-required"
                  >
                    Review required
                  </label>
                  <input
                    className="form-check-input"
                    id="review-required"
                    type="checkbox"
                    checked={reviewRequired}
                    disabled
                  />
                </div>
              </div>
              {reviewRequired && (
                <div className="comp-details-edit-container">
                  <div
                    className="comp-details-label-input-pair"
                    id="review-complete-file-review-notes-id"
                  >
                    <label
                      className="form-check-label"
                      htmlFor="review-complete"
                    >
                      Review complete
                    </label>
                    <input
                      className="form-check-input"
                      id="review-complete"
                      type="checkbox"
                      checked={reviewCompleted}
                      disabled
                    />
                  </div>
                </div>
              )}
              {reviewCompleted && (
                <div className="comp-details-edit-container">
                  <div className="comp-details-edit-column">
                    <div className="comp-details-label-div-pair">
                      <label
                        className="comp-details-inner-content-label"
                        htmlFor="comp-review-required-officer"
                      >
                        Officer
                      </label>
                      <div
                        data-initials-sm={officerInitials}
                        className="comp-orange-avatar-sm comp-details-inner-content"
                      >
                        <span
                          id="comp-review-required-officer"
                          className="comp-padding-left-xs"
                        >
                          {officerName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="comp-details-edit-column comp-details-right-column"
                    id="complaint-file-review-date-div"
                  >
                    <div className="comp-details-label-div-pair">
                      <label
                        className="comp-details-inner-content-label"
                        htmlFor="file-review-date"
                      >
                        Date
                      </label>
                      <div
                        className="bi comp-margin-right-xxs comp-details-inner-content"
                        id="file-review-date"
                      >
                        {formatDate(new Date(reviewCompleteDate).toString())}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="comp-details-right-column">
              <CompTextIconButton
                id="review-edit-button"
                buttonClasses="button-text"
                text="Edit"
                icon={BsPencil}
                click={(e) => handleStateChange(EDIT_STATE)}
                isDisabled={reviewCompleted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
