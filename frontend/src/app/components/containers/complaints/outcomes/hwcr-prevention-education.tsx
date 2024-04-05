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
  selectPreventionTypeCodeDropdown,
} from "../../../../store/reducers/code-table";
import { useParams } from "react-router-dom";
import { formatDate, getAvatarInitials, getSelectedOfficer } from "../../../../common/methods";
import { CompSelect } from "../../../common/comp-select";
import { ValidationCheckboxGroup } from "../../../../common/validation-checkbox-group";
import { selectPrevention, getPrevention, resetPrevention, upsertPrevention } from "../../../../store/reducers/cases";
import { openModal } from "../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { ToggleError } from "../../../../common/toast";
import "react-toastify/dist/ReactToastify.css";
import { ValidationDatePicker } from "../../../../common/validation-date-picker";
import { BsPencil, BsPlusCircle } from "react-icons/bs";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";

import "../../../../../assets/sass/hwcr-assessment.scss"
import { Prevention } from "../../../../types/outcomes/prevention";

export const HWCRComplaintPrevention: FC = () => {
  const dispatch = useAppDispatch();
  type ComplaintParams = {
    id: string;
    complaintType: string;
  };
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option>();
  const [selectedPreventionTypes, setSelectedPreventionTypes] = useState<Option[]>([]);
  const [editable, setEditable] = useState<boolean>(true);

  const handlePreventionTypesChange = (selectedItems: Option[]) => {
    setSelectedPreventionTypes(selectedItems);
  };

  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [preventionDateErrorMessage, setPreventionDateErrorMessage] = useState<string>("");
  const [preventionRequiredErrorMessage, setPreventionRequiredErrorMessage] = useState<string>("");
  const [showContent, setShowContent] = useState<boolean>(true);

  const complaintData = useAppSelector(selectComplaint);
  const preventionState = useAppSelector(selectPrevention);
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

  const preventionTypeList = useAppSelector(selectPreventionTypeCodeDropdown);
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
      dispatch(getPrevention(complaintData.id));
    }
  }, [complaintData]);

  useEffect(() => {
    populatePreventionUI();
  }, [preventionState]);

  // clear the redux state
  useEffect(() => {
    return () => {
      dispatch(resetPrevention());
    };
  }, [dispatch]);


  const populatePreventionUI = () => {

    const selectedOfficer = (preventionState.officer ? {
      label: preventionState.officer?.key,
      value: preventionState.officer?.value
    } :
      null) as Option;

    const selectedPreventionTypes = preventionState.prevention_type?.map((item) => {
      return {
        label: item.key,
        value: item.value
      }
    }) as Option[];

    setSelectedDate((preventionState.date) ? new Date(preventionState.date) : null);
    setSelectedOfficer(selectedOfficer);
    setSelectedPreventionTypes(selectedPreventionTypes);
    setShowContent(preventionState.prevention_type?.length > 0);
    resetValidationErrors();
    setEditable(!preventionState.date);
  };

  const cancelConfirmed = () => {
    populatePreventionUI();
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
    const updatedPreventionData = {
      date: selectedDate,
      officer: {
        key: selectedOfficer?.label,
        value: selectedOfficer?.value
      },
      prevention_type: selectedPreventionTypes.map((item) => {
        return {
          key: item.label,
          value: item.value
        }
      }),
    } as Prevention;

    if (!hasErrors()) {
      dispatch(upsertPrevention(id, updatedPreventionData));
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
    setPreventionDateErrorMessage("");
    setPreventionRequiredErrorMessage("");
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
      setPreventionDateErrorMessage("Required");
    }

    if (!selectedPreventionTypes || selectedPreventionTypes?.length <= 0) {
      setPreventionRequiredErrorMessage("One or more prevention and education is required");
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>Prevention and education</h6>
      {!showContent ?
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-prevention-outcome"
            title="Add Prevention and education"
            variant="primary"
            onClick={() => setShowContent(true)}
          >
            <span>Add actions</span>
            <BsPlusCircle />
          </Button>
        </div>
        :
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
                      Prevention and Education
                    </label>
                    {editable ? (
                      <ValidationCheckboxGroup
                        errMsg={preventionRequiredErrorMessage}
                        options={preventionTypeList}
                        onCheckboxChange={handlePreventionTypesChange}
                        checkedValues={selectedPreventionTypes}
                      ></ValidationCheckboxGroup>
                    ) : (
                      <div>
                        {selectedPreventionTypes.map((preventionValue) => (
                          <div className="checkbox-label-padding" key={preventionValue.label}>{preventionValue.label}</div>
                        ))}
                      </div>
                    )}
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
                        errMsg={preventionDateErrorMessage} // Pass error message if any
                        maxDate={new Date()}
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
                  id="prevention-edit-button"
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
      }
    </div>
  );
};
