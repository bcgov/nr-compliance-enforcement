import { FC, useEffect, useState } from "react";
import Option from "../../../../types/app/option";
import { Button } from "react-bootstrap";
import { Officer } from "../../../../types/person/person";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import {
  getComplaintById,
  selectComplaint,
  selectComplaintCallerInformation,
  selectComplaintHeader,
} from "../../../../store/reducers/complaints";
import {
  selectAssessmentTypeCodeDropdown,
  selectJustificationCodeDropdown,
  selectYesNoCodeDropdown,
} from "../../../../store/reducers/code-table";
import { useParams } from "react-router-dom";
import { formatDate, getAvatarInitials, getSelectedOfficer } from "../../../../common/methods";
import { CompSelect } from "../../../common/comp-select";
import { ValidationCheckboxGroup } from "../../../../common/validation-checkbox-group";
import { resetAssessment, selectAssessment, upsertAssessment, getAssessment } from "../../../../store/reducers/cases";
import { openModal } from "../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { ToggleError } from "../../../../common/toast";
import "react-toastify/dist/ReactToastify.css";
import { Assessment } from "../../../../types/outcomes/assessment";
import { ValidationDatePicker } from "../../../../common/validation-date-picker";
import { BsPencil } from "react-icons/bs";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";

import "../../../../../assets/sass/hwcr-assessment.scss"

export const HWCRComplaintAssessment: FC = () => {
  const dispatch = useAppDispatch();
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };
  const [selectedActionRequired, setSelectedActionRequired] = useState<Option | null>();
  const [selectedJustification, setSelectedJustification] = useState<Option| null>();
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>();
  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState<Option[]>([]);
  const [editable, setEditable] = useState<boolean>(true);

  const handleAssessmentTypesChange = (selectedItems: Option[]) => {
    setSelectedAssessmentTypes(selectedItems);
  };

  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [assessmentDateErrorMessage, setAssessmentDateErrorMessage] = useState<string>("");
  const [actionRequiredErrorMessage, setActionRequiredErrorMessage] = useState<string>("");
  const [justificationRequiredErrorMessage, setJustificationRequiredErrorMessage] = useState<string>("");
  const [assessmentRequiredErrorMessage, setAssessmentRequiredErrorMessage] = useState<string>("");

  const complaintData = useAppSelector(selectComplaint);
  const assessmentState = useAppSelector(selectAssessment);
  const { id = "", complaintType = "" } = useParams<ComplaintParams>();
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency));
  const assignableOfficers: Option[] =
    officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
        value: officer.person_guid.person_guid,
        label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
      }))
      : [];
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const toggleEdit = () => {
    setEditable(true);
  };

  const handleActionRequiredChange = (selected: Option | null) => {
    if (selected) {
      setSelectedActionRequired(selected);
    } else {
      setSelectedActionRequired(undefined);
    }
  };

  const handleJustificationChange = (selected: Option | null) => {
    if (selected) {
      setSelectedJustification(selected);
    } else {
      setSelectedJustification(undefined);
    }
  };

  const actionRequiredList = useAppSelector(selectYesNoCodeDropdown);
  const justificationList = useAppSelector(selectJustificationCodeDropdown);
  const assessmentTypeList = useAppSelector(selectAssessmentTypeCodeDropdown);
  const { personGuid } = useAppSelector(selectComplaintHeader(complaintType));

  useEffect(() => {
    if (id && (!complaintData || complaintData.id !== id)) {
      dispatch(getComplaintById(id, complaintType));
    }
  }, [id, complaintType, complaintData, dispatch]);

  useEffect(() => {
    if (complaintData) {
      const officer = getSelectedOfficer(assignableOfficers, personGuid, complaintData);
      setSelectedOfficer(officer);
      dispatch(getAssessment(complaintData.id));
    }
  }, [complaintData]);

  useEffect(() => {
      populateAssessmentUI();
  }, [assessmentState]);

  // clear the redux state
  useEffect(() => {
    return () => {
      dispatch(resetAssessment());
    };
  }, [dispatch]);

  
  const populateAssessmentUI = () => {
    setSelectedDate((assessmentState.date) ? new Date(assessmentState.date) : null);
    setSelectedOfficer(assessmentState.officer ?? null);
    setSelectedActionRequired(assessmentState.action_required ?? null);
    setSelectedJustification(assessmentState.justification ?? null);
    setSelectedAssessmentTypes(assessmentState.assessment_type);
    resetValidationErrors();
    setEditable(!assessmentState.date);
  };


  const justificationLabelClass = selectedActionRequired?.value === "No" ? "" : "comp-outcome-hide";
  const justificationEditClass =
    selectedActionRequired?.value === "No" ? "comp-details-input" : "comp-details-input comp-outcome-hide";

  const cancelConfirmed = () => {
    populateAssessmentUI();
  };


  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  // save to redux if no errors.  Otherwise, display error message(s).
  const saveButtonClick = async () => {
    const updatedAssessmentData = {
      date: selectedDate,
      officer: selectedOfficer,
      action_required: selectedActionRequired,
      justification: selectedJustification,
      assessment_type: selectedAssessmentTypes,
    } as Assessment;

    if (!hasErrors()) {
      dispatch(upsertAssessment(id, updatedAssessmentData));
      setEditable(false);
    } else {
      handleFormErrors();
    }
  };

  const handleFormErrors = () => {
    ToggleError("Errors in form");
  };

  // Clear out existing validation errors
  const resetValidationErrors = () => {
    setOfficerErrorMessage("");
    setActionRequiredErrorMessage("");
    setAssessmentDateErrorMessage("");
    setJustificationRequiredErrorMessage("");
    setAssessmentRequiredErrorMessage("");
  };

  // Validates the assessment
  const hasErrors = (): boolean => {
    let hasErrors: boolean = false;
    resetValidationErrors();

    if (!selectedOfficer) {
      setOfficerErrorMessage("Required");
      hasErrors = true;
    }

    if (!selectedDate) {
      hasErrors = true;
      setAssessmentDateErrorMessage("Required");
    }

    if (!selectedActionRequired) {
      setActionRequiredErrorMessage("Required");
      hasErrors = true;
    }

    if (!selectedAssessmentTypes || selectedAssessmentTypes?.length <= 0) {
      setAssessmentRequiredErrorMessage("One or more assessment is required");
      hasErrors = true;
    }

    if (selectedActionRequired?.value === "No" && !selectedJustification) {
      setJustificationRequiredErrorMessage("Required when Action Required is No");
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>Complaint assessment</h6>
      <div className="comp-outcome-report-complaint-assessment">
        <div className="comp-details-edit-container">
          <div className="assessment-details-edit-column">
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div id="assessment-checkbox-div" className="comp-details-label-checkbox-div-pair">
                  <label
                    htmlFor="checkbox-div"
                    className="comp-details-inner-content-label checkbox-label-padding"
                  >
                    Assessment
                  </label>
                  {editable ? (
                    <ValidationCheckboxGroup
                      errMsg={assessmentRequiredErrorMessage}
                      options={assessmentTypeList}
                      onCheckboxChange={handleAssessmentTypesChange}
                      checkedValues={selectedAssessmentTypes}
                    ></ValidationCheckboxGroup>
                  ) : (
                    <div>
                      {selectedAssessmentTypes.map((assesmentValue) => (
                        <div className="checkbox-label-padding" key={assesmentValue.label}>{assesmentValue.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div id="action-required-div" className="assessment-details-label-input-pair">
                  <label htmlFor="action-required">Action required?</label>
                  {editable ? (
                    <CompSelect
                      id="action-required"
                      className="comp-details-input"
                      classNamePrefix="comp-select"
                      options={actionRequiredList}
                      enableValidation={true}
                      errorMessage={actionRequiredErrorMessage}
                      value={selectedActionRequired}
                      placeholder="Select"
                      onChange={(e) => handleActionRequiredChange(e)}
                    />
                  ) : (
                    selectedActionRequired?.value
                  )}
                </div>
              </div>
              <div className="comp-details-edit-column comp-details-right-column">
                <div id="justification-div" className="assessment-details-label-input-pair">
                  <label
                    className={justificationLabelClass}
                    htmlFor="justification"
                  >
                    Justification
                  </label>
                  {editable ?
                    <CompSelect
                      id="justification"
                      className={justificationEditClass}
                      classNamePrefix="comp-select"
                      options={justificationList}
                      enableValidation={true}
                      errorMessage={justificationRequiredErrorMessage}
                      value={selectedJustification}
                      placeholder="Select"
                      onChange={(e) => handleJustificationChange(e)}
                    /> : <span className={justificationEditClass}>
                      {selectedJustification?.label || ''}
                    </span>
                  }
                </div>
              </div>
            </div>
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div id="outcome-officer-div" className="assessment-details-label-input-pair">
                  <label htmlFor="outcome-officer">Officer</label>
                  {editable ? (
                    <CompSelect
                      id="outcome-officer"
                      className="comp-details-input"
                      classNamePrefix="comp-select"
                      options={assignableOfficers}
                      enableValidation={true}
                      errorMessage={officerErrorMessage}
                      value={selectedOfficer}
                      placeholder="Select "
                      onChange={(officer: any) => setSelectedOfficer(officer)}
                    />
                  ) : (
                    <div
                      data-initials-sm={getAvatarInitials(selectedOfficer?.label ?? "")}
                      className="comp-orange-avatar-sm comp-details-inner-content"
                    >
                      <span
                        id="comp-review-required-officer"
                        className="comp-padding-left-xs"
                      >
                        {selectedOfficer?.label ?? ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="comp-details-edit-column comp-details-right-column">
                <div id="complaint-outcome-date-div" className="assessment-details-label-input-pair">
                  <label htmlFor="complaint-outcome-date">Date</label>
                  {editable ? (
                    <ValidationDatePicker
                      id="complaint-outcome-date"
                      selectedDate={selectedDate}
                      onChange={handleDateChange}
                      placeholder="Select date"
                      className="comp-details-edit-calendar-input" // Adjust class as needed
                      classNamePrefix="comp-select" // Adjust class as needed
                      errMsg={assessmentDateErrorMessage} // Pass error message if any
                    />
                  ) : (
                    formatDate(`${selectedDate}`)
                  )}
                </div>
              </div>
            </div>
          </div>
          {!editable && (
            <div className="comp-details-right-column">
              <CompTextIconButton
                id="assessment-edit-button"
                buttonClasses="button-text"
                text="Edit"
                icon={BsPencil}
                click={toggleEdit}
              />
            </div>
          )}
        </div>
        {editable && (
          <div className="comp-outcome-report-container">
            <div className="comp-outcome-report-actions">
              <Button
                id="outcome-cancel-button"
                title="Cancel Outcome"
                className="comp-outcome-cancel"
                onClick={cancelButtonClick}
              >
                Cancel
              </Button>
              <Button
                id="outcome-save-button"
                title="Save Outcome"
                className="comp-outcome-save"
                onClick={saveButtonClick}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
