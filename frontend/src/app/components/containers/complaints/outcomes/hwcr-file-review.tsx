import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CompSelect } from "@components/common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { openModal, profileDisplayName } from "@store/reducers/app";
import { formatDate } from "@common/methods";
import { BsExclamationCircleFill } from "react-icons/bs";
import { getComplaintStatusById, selectComplaint, selectComplaintViewMode } from "@store/reducers/complaints";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { createReview, updateReview } from "@/app/store/reducers/complaint-outcome-thunks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";

export const HWCRFileReview: FC = () => {
  const REQUEST_REVIEW_STATE = 0;
  const EDIT_STATE = 1;
  const DISPLAY_STATE = 2;
  const dispatch = useAppDispatch();
  const complaintData = useAppSelector(selectComplaint);
  const authUserGuid = useAppSelector((state) => state.app.profile.idir);
  const isReviewRequired = useAppSelector((state) => state.complaintOutcomes.isReviewRequired);
  const reviewCompleteAction = useAppSelector((state) => state.complaintOutcomes.reviewComplete);
  const { officers } = useAppSelector((state) => state.officers);
  const displayName = useAppSelector(profileDisplayName);
  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const [componentState, setComponentState] = useState<number>(REQUEST_REVIEW_STATE);
  const [reviewRequired, setReviewRequired] = useState<boolean>(false);
  const [reviewCompleted, setReviewCompleted] = useState<boolean>(false);
  const [officerName, setOfficerName] = useState<string>(displayName);
  const [reviewCompleteDate, setReviewCompleteDate] = useState<Date>(new Date());
  const showSectionErrors =
    (componentState === EDIT_STATE || (componentState === REQUEST_REVIEW_STATE && reviewRequired)) &&
    isInEdit.showSectionErrors;

  useEffect(() => {
    if (componentState === EDIT_STATE || (componentState === REQUEST_REVIEW_STATE && reviewRequired)) {
      dispatch(setIsInEdit({ fileReview: true }));
    } else dispatch(setIsInEdit({ fileReview: false }));
    return () => {
      dispatch(setIsInEdit({ fileReview: false }));
    };
  }, [dispatch, componentState, reviewRequired]);

  useEffect(() => {
    setReviewRequired(isReviewRequired ?? false);
    if (isReviewRequired) setComponentState(DISPLAY_STATE);
  }, [isReviewRequired]);

  useEffect(() => {
    if (reviewCompleteAction) {
      let displayName = "Unknown";
      if (officers) {
        const officer = officers.filter((person) => person.auth_user_guid === reviewCompleteAction.actor);
        if (officer.length > 0) {
          const {
            first_name, last_name
          } = officer[0];
          displayName = `${last_name}, ${first_name}`;
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
          const completeAction = {
            actor: authUserGuid,
            date: new Date(),
            actionCode: "COMPLTREVW",
            activeIndicator: reviewCompleted,
          };
          dispatch(updateReview(complaintData.id, reviewRequired, completeAction));
          setComponentState(REQUEST_REVIEW_STATE);
        }
      } else {
        const completeAction = {
          actor: authUserGuid,
          date: new Date(),
          actionCode: "COMPLTREVW",
          activeIndicator: reviewCompleted,
        };
        dispatch(createReview(complaintData.id, reviewRequired, completeAction));
      }
      dispatch(getComplaintStatusById(complaintData.id, COMPLAINT_TYPES.HWCR));
    }
    if (componentState === EDIT_STATE && (reviewRequired || reviewCompleted)) {
      setComponentState(DISPLAY_STATE);
    }
  };

  const handleFileReviewCancel = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
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
    <section
      className="comp-details-section comp-outcome-report-file-review"
      id="outcome-file-review"
    >
      <div className="comp-details-section-header">
        <h3>File review</h3>
        {componentState === DISPLAY_STATE && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="review-edit-button"
              onClick={(e) => {
                handleStateChange(EDIT_STATE);
              }}
              disabled={isReadOnly}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>

      <Card border={showSectionErrors ? "danger" : "default"}>
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>File must be reviewed before closing the complaint.</span>
              )}
            </div>
          )}
          <div className="comp-details-form">
            {(componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) && (
              <div className="comp-details-form-row">
                <div className="comp-details-input">
                  <div
                    className="comp-checkbox"
                    id="review-required-file-review-pair-id"
                  >
                    <input
                      className="form-check-input ms-0"
                      id="review-required"
                      type="checkbox"
                      checked={reviewRequired}
                      onChange={handleReviewRequiredClick}
                      disabled={isReadOnly}
                    />
                    <label htmlFor="review-required">
                      <span>Review required</span>
                    </label>
                  </div>
                  {reviewRequired && (componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) && (
                    <div
                      className="comp-checkbox"
                      id="review-complete-file-review-id"
                    >
                      <input
                        className="form-check-input ms-0"
                        id="review-complete"
                        type="checkbox"
                        checked={reviewCompleted}
                        onChange={handleReviewCompleteClick}
                      />
                      <label htmlFor="review-complete">
                        <span>Review complete</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(componentState === REQUEST_REVIEW_STATE || componentState === EDIT_STATE) &&
              reviewRequired &&
              reviewCompleted && (
                <>
                  <div
                    className="comp-details-form-row mt-3"
                    id="file-review-officer-id"
                  >
                    <label
                      id="officer-file-review-pair-id"
                      htmlFor="officer-file-review-select-id"
                    >
                      Officer
                    </label>
                    <div className="comp-details-input full-width">
                      <CompSelect
                        id="officer-file-review-select-id"
                        showInactive={false}
                        classNamePrefix="comp-select"
                        isDisabled={true}
                        enableValidation={false}
                        value={{ value: displayName, label: displayName }}
                      />
                    </div>
                  </div>

                  <div
                    className="comp-details-form-row"
                    id="file-review-time-pair-id"
                  >
                    <label htmlFor="file-review-time-pair-id">Date</label>
                    <div className="comp-details-input">
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
                </>
              )}

            {componentState !== DISPLAY_STATE && (
              <div className="comp-details-form-buttons">
                <Button
                  variant="outline-primary"
                  id="file-review-cancel-button"
                  title="Cancel File Review"
                  onClick={handleFileReviewCancel}
                  disabled={isReadOnly}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  id="file-review-save-button"
                  title="Save File Review"
                  onClick={handleFileReviewSave}
                  disabled={isReadOnly}
                >
                  Save
                </Button>
              </div>
            )}

            {componentState === DISPLAY_STATE && (
              <>
                <div className="comp-details-form-row">
                  <div className="comp-details-input">
                    <div
                      className="comp-checkbox"
                      id="review-required-file-review-notes-pair-id"
                    >
                      <input
                        className="form-check-input ms-0"
                        id="review-required"
                        type="checkbox"
                        checked={reviewRequired}
                        disabled
                      />
                      <label htmlFor="review-required">Review required</label>
                    </div>

                    {reviewRequired && (
                      <div
                        className="comp-checkbox"
                        id="review-complete-file-review-notes-id"
                      >
                        <input
                          className="form-check-input ms-0"
                          id="review-complete"
                          type="checkbox"
                          checked={reviewCompleted}
                          disabled
                        />
                        <label htmlFor="review-complete">Review complete</label>
                      </div>
                    )}
                  </div>
                </div>

                {reviewCompleted && (
                  <dl className="mt-4">
                    <div id="file-review-officer-id">
                      <dt>Officer</dt>
                      <dd>
                        <span id="comp-review-required-officer">{officerName}</span>
                      </dd>
                    </div>

                    <div id="complaint-file-review-date-div">
                      <dt>Date</dt>
                      <dd id="file-review-date">{formatDate(new Date(reviewCompleteDate).toString())}</dd>
                    </div>
                  </dl>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};
