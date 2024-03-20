import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsPencil, BsPlusCircle } from "react-icons/bs";
import { CompSelect } from "../../../common/comp-select";
import DatePicker from "react-datepicker";
import { formatDate, getAvatarInitials, getSelectedOfficer } from "../../../../common/methods";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { getComplaintById, selectComplaint, selectComplaintCallerInformation, selectComplaintHeader } from "../../../../store/reducers/complaints";

import Option from "../../../../types/app/option";
import { Officer } from "../../../../types/person/person";
import { selectPreventEducationDropdown } from "../../../../store/reducers/code-table";
import { ValidationCheckboxGroup } from "../../../../common/validation-checkbox-group";
import { ValidationDatePicker } from "../../../../common/validation-date-picker";
import { ToggleError, ToggleSuccess } from "../../../../common/toast";
import { getAssessment, resetAssessment, selectAssessment, selectPreventionEducation } from "../../../../store/reducers/cases";
import { openModal } from "../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { Assessment } from "../../../../types/outcomes/assessment";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";

export const HWCRPreventionEducation: FC = () => {  
  const dispatch = useAppDispatch();
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };
  const [selectedPreventionEducationRequired, setSelectedPreventionEducationRequired] = useState<Option>();
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option>();
  const [selectedPreventionEducationTypes, setSelectedPreventionEducationTypes] = useState<Option[]>([]);
  const [editable, setEditable] = useState<boolean>(true);

  const handlePreventionEducationTypesChange = (selectedItems: Option[]) => {
    setSelectedPreventionEducationTypes(selectedItems);
  };
  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [preventionEducationDateErrorMessage, setPreventionEducationDateErrorMessage] = useState<string>("");
  const [preventionEducationRequiredErrorMessage, setPreventionEducationRequiredErrorMessage] = useState<string>("");

  const complaintData = useAppSelector(selectComplaint);
  const preventionEducationState = useAppSelector(selectPreventionEducation);
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

  const preventionEducationTypeListTypeList = useAppSelector(selectPreventEducationDropdown);
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
      //dispatch(getAssessment(complaintData.id));
      if (preventionEducationState.date) {
        //populatePreventionEducation();
      }

    }
  }, [complaintData]);

  // clear the redux state
  useEffect(() => {
    return () => {
      dispatch(resetAssessment());
    };
  }, [dispatch]);


  const populatePreventionEducation = () => {
    setSelectedDate((preventionEducationState.date) ? new Date(preventionEducationState.date) : null);
    setSelectedOfficer(preventionEducationState.officer);
    setSelectedPreventionEducationTypes(preventionEducationState.prevention_education_type);
    resetValidationErrors();
    if (preventionEducationState.prevention_education_type.length > 0) { // This handles the case where the user clicks cancel before saving anything
      setEditable(false);
    }
  };



  const cancelConfirmed = () => {
    populatePreventionEducation();
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
      action_required: selectedPreventionEducationRequired,
      assessment_type: selectedPreventionEducationTypes,
    } as Assessment;

    if (!hasErrors()) {
      //dispatch(upsertAssessment(id, updatedAssessmentData));
      ToggleSuccess(`Assessment has been saved`);
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
    setPreventionEducationRequiredErrorMessage("");
    setPreventionEducationDateErrorMessage("");
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
      setPreventionEducationDateErrorMessage("Required");
    }

    if (selectedPreventionEducationTypes?.length <= 0) {
      setPreventionEducationRequiredErrorMessage("One or more assessment is required");
      hasErrors = true;
    }


    return hasErrors;
  };
  
  return (
    <div className="comp-outcome-report-block">
      <h6>Complaint assessment</h6>
      <div className="comp-outcome-report-complaint-assessment">
        <div className="comp-details-edit-container">
          <div className="comp-details-edit-column">
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div id="assessment-checkbox-div" className="comp-details-label-checkbox-div-pair">
                  <label
                    htmlFor="checkbox-div"
                    className="comp-details-inner-content-label checkbox-label-padding"
                  >
                    Prevention and education
                  </label>
                  {editable ? (
                    <ValidationCheckboxGroup
                      errMsg={preventionEducationRequiredErrorMessage}
                      options={preventionEducationTypeListTypeList}
                      onCheckboxChange={handlePreventionEducationTypesChange}
                      checkedValues={selectedPreventionEducationTypes}
                    ></ValidationCheckboxGroup>
                  ) : (
                    <div>
                      {selectedPreventionEducationTypes.map((preventionEducationTypeValue) => (
                        <div className="checkbox-label-padding" key={preventionEducationTypeValue.label}>{preventionEducationTypeValue.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div id="outcome-officer-div" className="comp-details-label-input-pair">
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
                <div id="complaint-outcome-date-div" className="comp-details-label-input-pair">
                  <label htmlFor="complaint-outcome-date">Date</label>
                  {editable ? (
                    <ValidationDatePicker
                      id="complaint-outcome-date"
                      selectedDate={selectedDate}
                      onChange={handleDateChange}
                      placeholder="Select Date"
                      className="comp-details-edit-calendar-input" // Adjust class as needed
                      classNamePrefix="comp-select" // Adjust class as needed
                      errMsg={preventionEducationDateErrorMessage} // Pass error message if any
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
                id="prevention-education-edit-button"
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
  