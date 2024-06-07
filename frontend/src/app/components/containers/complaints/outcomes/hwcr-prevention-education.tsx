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
  selectComplaintAssignedBy,
} from "../../../../store/reducers/complaints";
import { selectPreventionTypeCodeDropdown } from "../../../../store/reducers/code-table";
import { useParams } from "react-router-dom";
import { formatDate, getAvatarInitials, getSelectedOfficer } from "../../../../common/methods";
import { CompSelect } from "../../../common/comp-select";
import { ValidationCheckboxGroup } from "../../../../common/validation-checkbox-group";
import { resetPrevention } from "../../../../store/reducers/cases";
import { openModal } from "../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { ToggleError } from "../../../../common/toast";
import "react-toastify/dist/ReactToastify.css";
import { ValidationDatePicker } from "../../../../common/validation-date-picker";
import { BsPencil, BsPlusCircle } from "react-icons/bs";
import { CompTextIconButton } from "../../../common/comp-text-icon-button";

import "../../../../../assets/sass/hwcr-assessment.scss";
import { Prevention } from "../../../../types/outcomes/prevention";
import { selectPrevention } from "../../../../store/reducers/case-selectors";
import { getPrevention, upsertPrevention } from "../../../../store/reducers/case-thunks";

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

  const currentDate = new Date();

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
  const assigned = useAppSelector(selectComplaintAssignedBy);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintData]);

  useEffect(() => {
    populatePreventionUI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preventionState]);

  // clear the redux state
  useEffect(() => {
    return () => {
      dispatch(resetPrevention());
    };
  }, [dispatch]);

  const populatePreventionUI = () => {
    const selectedOfficer = (
      preventionState.officer
        ? {
            label: preventionState.officer?.key,
            value: preventionState.officer?.value,
          }
        : null
    ) as Option;

    const selectedPreventionTypes = preventionState.prevention_type?.map((item) => {
      return {
        label: item.key,
        value: item.value,
      };
    }) as Option[];

    const preventionDate = preventionState?.date ? new Date(preventionState.date) : new Date();

    setSelectedDate(preventionDate);
    setSelectedOfficer(selectedOfficer);
    setSelectedPreventionTypes(selectedPreventionTypes);
    setShowContent(preventionState.prevention_type?.length > 0);
    resetValidationErrors();
    setEditable(!preventionState.date);

    if (!selectedOfficer && officersInAgencyList && assigned) {
      const officerAssigned: Option[] = officersInAgencyList
        .filter((officer: Officer) => officer.person_guid.person_guid === assigned)
        .map((element: Officer) => {
          return {
            label: `${element.person_guid?.first_name} ${element.person_guid?.last_name}`,
            value: assigned,
          } as Option;
        });
      if (
        officerAssigned &&
        Array.isArray(officerAssigned) &&
        officerAssigned.length > 0 &&
        typeof officerAssigned[0].label !== "undefined"
      ) {
        setSelectedOfficer(officerAssigned[0]);
      }
    }
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
    if (!hasErrors()) {
      const updatedPreventionData: Prevention = {
        date: selectedDate,
        officer: {
          key: selectedOfficer?.label,
          value: selectedOfficer?.value,
        },
        prevention_type: selectedPreventionTypes?.map((item) => {
          return {
            key: item.label,
            value: item.value,
          };
        }),
      };

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
    <section className="comp-details-section comp-outcome-report-complaint-prev-and-educ">
      <div className="comp-details-section-header">
        <h3>Prevention and education</h3>
        {!editable && (
          <div className="comp-details-section-header-actions">
            <Button
              id="assessment-edit-button"
              variant="outline-primary"
              size="sm"
              onClick={toggleEdit}
            >
              <i className="bi bi-pencil"></i>
              Edit
            </Button>
          </div>
        )}
      </div>
      {!showContent ? (
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-prevention-outcome"
            title="Add Prevention and education"
            variant="primary"
            size="sm"
            onClick={() => setShowContent(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add actions</span>
          </Button>
        </div>
      ) : (
        <>
          {editable ? (
            <div className="comp-details-form">
              <div className="comp-details-form-group">
                <div
                  id="prev-educ-checkbox-div"
                  className="comp-details-form-row"
                >
                  <label htmlFor="checkbox-div">Actions</label>
                  <ValidationCheckboxGroup
                    errMsg={preventionRequiredErrorMessage}
                    options={preventionTypeList}
                    onCheckboxChange={handlePreventionTypesChange}
                    checkedValues={selectedPreventionTypes}
                  ></ValidationCheckboxGroup>
                </div>
              </div>
              <div
                id="prev-educ-outcome-officer-div"
                className="comp-details-form-row"
              >
                <label htmlFor="prev-educ-outcome-officer">Officer</label>
                <div className="comp-details-input full-width">
                  <CompSelect
                    id="prev-educ-outcome-officer"
                    className="comp-details-input"
                    classNamePrefix="comp-select"
                    options={assignableOfficers}
                    enableValidation={true}
                    errorMessage={officerErrorMessage}
                    value={selectedOfficer}
                    placeholder="Select "
                    onChange={(officer: any) => setSelectedOfficer(officer)}
                  />
                </div>
              </div>
              <div
                id="prev-educ-outcome-date-div"
                className="comp-details-form-row"
              >
                <label htmlFor="prev-educ-outcome-date">Date</label>
                <div className="comp-details-input full-width">
                  <ValidationDatePicker
                    id="prev-educ-outcome-date"
                    selectedDate={selectedDate}
                    onChange={handleDateChange}
                    placeholder="Select date"
                    className="comp-details-edit-calendar-input" // Adjust class as needed
                    classNamePrefix="comp-select" // Adjust class as needed
                    errMsg={preventionDateErrorMessage} // Pass error message if any
                    maxDate={currentDate}
                  />
                </div>
              </div>
              <div className="comp-details-form-buttons">
                <Button
                  id="prev-educ-outcome-cancel-button"
                  title="Cancel Outcome"
                  variant="outline-primary"
                  onClick={cancelButtonClick}
                >
                  Cancel
                </Button>
                <Button
                  id="outcome-save-prev-and-educ-button"
                  title="Save Outcome"
                  variant="primary"
                  onClick={saveButtonClick}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <dl>
              <div>
                <dt>Actions</dt>
                <dd>
                  <ul>
                    {selectedPreventionTypes.map((preventionValue) => (
                      <li
                        className="checkbox-label-padding"
                        key={preventionValue.label}
                      >
                        {preventionValue.label}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Officer</dt>
                <dd>
                  <div
                    data-initials-sm={getAvatarInitials(selectedOfficer?.label ?? "")}
                    className="comp-avatar comp-avatar-sm comp-avatar-orange"
                  >
                    <span id="comp-review-required-officer">{selectedOfficer?.label ?? ""}</span>
                  </div>
                </dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>
                  <dd className="comp-date-time-value">
                    <div>
                      <i className="bi bi-calendar"></i>
                      {formatDate(`${selectedDate}`)}
                    </div>
                  </dd>
                </dd>
              </div>
            </dl>
          )}
        </>
      )}
    </section>
  );
};
