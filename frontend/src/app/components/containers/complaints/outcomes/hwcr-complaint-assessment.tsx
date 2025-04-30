import { FC, useEffect, useState, useCallback } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Option from "@apptypes/app/option";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  assignComplaintToOfficer,
  selectOfficersAndCollaboratorsByAgency,
  selectOfficerAndCollaboratorListByAgency,
} from "@store/reducers/officer";
import {
  selectComplaintCallerInformation,
  selectComplaintAssignedBy,
  selectComplaintLargeCarnivoreInd,
  selectLinkedComplaints,
  selectComplaintViewMode,
  selectComplaint,
} from "@store/reducers/complaints";
import {
  selectAssessmentCat1Dropdown,
  selectAssessmentTypeCodeDropdown,
  selectConflictHistoryDropdown,
  selectJustificationCodeDropdown,
  selectLocationDropdown,
  selectThreatLevelDropdown,
  selectYesNoCodeDropdown,
} from "@store/reducers/code-table";
import { formatDate } from "@common/methods";
import { CompSelect } from "@components/common/comp-select";
import { ValidationCheckboxGroup } from "@common/validation-checkbox-group";
import { setIsInEdit } from "@store/reducers/cases";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { ToggleError } from "@common/toast";
import "react-toastify/dist/ReactToastify.css";
import { Assessment } from "@apptypes/outcomes/assessment";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { BsExclamationCircleFill } from "react-icons/bs";

import "@assets/sass/hwcr-assessment.scss";
import { selectAssessment } from "@store/reducers/case-selectors";
import { upsertAssessment } from "@store/reducers/case-thunks";
import { OptionLabels } from "@constants/option-labels";
import { HWCRComplaintAssessmentLinkComplaintSearch } from "./hwcr-complaint-assessment-link-complaint-search";
import { CompRadioGroup } from "@/app/components/common/comp-radiogroup";
import useValidateComplaint from "@hooks/validate-complaint";
import { Officer } from "@/app/types/person/person";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";

type Props = {
  id: string;
  handleSave?: () => void;
  handleClose?: () => void;
  showHeader?: boolean;
  quickClose?: boolean;
};

export const HWCRComplaintAssessment: FC<Props> = ({
  id,
  handleSave = () => {},
  handleClose = () => {},
  showHeader = true,
  quickClose = false,
}) => {
  const dispatch = useAppDispatch();
  const [selectedActionRequired, setSelectedActionRequired] = useState<Option | null>();
  const [selectedJustification, setSelectedJustification] = useState<Option | null>();
  const [selectedLinkedComplaint, setSelectedLinkedComplaint] = useState<Option | null>();
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>();
  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState<Option[]>([]);
  const [editable, setEditable] = useState<boolean>(true);
  const [validateOnChange, setValidateOnChange] = useState<boolean>(false);
  const [selectedContacted, setSelectedContacted] = useState<string | null>("No");
  const [selectedOfficerData, setSelectedOfficerData] = useState<Officer | null>();
  const [selectedAttended, setSelectedAttended] = useState<string | null>("No");
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [selectedConflictHistory, setSelectedConflictHistory] = useState<Option | null>(null);
  const [selectedCategoryLevel, setSelectedCategoryLevel] = useState<Option | null>(null);
  const [selectedAssessmentCat1Types, setSelectedAssessmentCat1Types] = useState<Option[]>([]);
  const [legacyAssessmentTypes, setLegacyAssessmentTypes] = useState<Option[] | undefined>([]);

  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [assessmentDateErrorMessage, setAssessmentDateErrorMessage] = useState<string>("");
  const [actionRequiredErrorMessage, setActionRequiredErrorMessage] = useState<string>("");
  const [justificationRequiredErrorMessage, setJustificationRequiredErrorMessage] = useState<string>("");
  const [linkedComplaintErrorMessage, setLinkedComplaintErrorMessage] = useState<string>("");
  const [assessmentRequiredErrorMessage, setAssessmentRequiredErrorMessage] = useState<string>("");
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>("");

  const complaintData = useAppSelector(selectComplaint);
  const linkedComplaintData = useAppSelector(selectLinkedComplaints);
  const assessmentState = useAppSelector(selectAssessment);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const cases = useAppSelector((state) => state.cases);
  const officersInAgencyList = useSelector((state: RootState) =>
    selectOfficersAndCollaboratorsByAgency(state, ownedByAgencyCode?.agency),
  );
  const assignableOfficers = useAppSelector(selectOfficerAndCollaboratorListByAgency);
  const conflictHistoryOptions = useAppSelector(selectConflictHistoryDropdown);
  const threatLevelOptions = useAppSelector(selectThreatLevelDropdown);
  const locationOptions = useAppSelector(selectLocationDropdown);
  const assessmentCat1Options = useAppSelector(selectAssessmentCat1Dropdown);
  const isLargeCarnivore = useAppSelector(selectComplaintLargeCarnivoreInd);
  const validationResults = useValidateComplaint();
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const hasAssessment = Object.keys(cases.assessment).length > 0;
  const showSectionErrors =
    (!hasAssessment || editable) && cases.isInEdit.showSectionErrors && !cases.isInEdit.hideAssessmentErrors;

  useEffect(() => {
    if (!hasAssessment && editable) {
      dispatch(setIsInEdit({ assessment: false }));
    } else dispatch(setIsInEdit({ assessment: editable }));
    return () => {
      dispatch(setIsInEdit({ assessment: false }));
    };
  }, [dispatch, editable, hasAssessment]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const toggleEdit = () => {
    setEditable(true);
    //Set Contacted complainant and Attended default to No, only in edit state
    if (selectedContacted === null) setSelectedContacted("No");
    if (selectedAttended === null) setSelectedAttended("No");
  };

  const handleActionRequiredChange = (selected: Option | null) => {
    //Reset other fields to default when action required changed
    setSelectedContacted("No");
    setSelectedAttended("No");
    setSelectedLocation(null);
    setSelectedCategoryLevel(null);
    setSelectedConflictHistory(null);
    if (selected) {
      setSelectedActionRequired(selected);
      setSelectedJustification(null as unknown as Option);
      setSelectedLinkedComplaint(null);
    } else {
      setSelectedActionRequired(null);
    }
  };

  const handleJustificationChange = (selected: Option | null) => {
    if (selected) {
      setSelectedJustification(selected);
      if (selected.value !== "DUPLICATE") {
        setSelectedLinkedComplaint(null);
      }
    } else {
      setSelectedJustification(null);
    }
  };

  const handleLinkedComplaintChange = (selected: Option | null, status: string | null) => {
    if (selected) {
      setSelectedLinkedComplaint(selected);
    } else {
      setSelectedLinkedComplaint(null);
    }
  };

  const handleSelectedOfficerChange = (selected: Option | null) => {
    if (selected && officersInAgencyList) {
      let filteredOfficer = officersInAgencyList?.find((officer) => officer.auth_user_guid === selected.value);
      setSelectedOfficerData(filteredOfficer);
    }
    setSelectedOfficer(selected);
  };

  const actionRequiredList = useAppSelector(selectYesNoCodeDropdown);
  const justificationList = useAppSelector(selectJustificationCodeDropdown);
  const assessmentTypeList = useAppSelector(selectAssessmentTypeCodeDropdown);
  const assigned = useAppSelector(selectComplaintAssignedBy);
  const noYesOptions = [...actionRequiredList].reverse();

  const populateAssessmentUI = useCallback(() => {
    const selectedOfficer = (
      assessmentState.officer
        ? {
            label: assessmentState.officer?.key,
            value: assessmentState.officer?.value,
          }
        : null
    ) as Option;

    let selectedActionRequired = quickClose ? ({ label: "No", value: "No" } as Option) : null;

    if (assessmentState.action_required) {
      selectedActionRequired = {
        label: assessmentState.action_required,
        value: assessmentState.action_required,
      } as Option;
    }

    let selectedJustification = quickClose ? ({ label: "Duplicate", value: "DUPLICATE" } as Option) : null;

    if (assessmentState.justification) {
      selectedJustification = {
        label: assessmentState.justification?.key,
        value: assessmentState.justification?.value,
      } as Option;
    }

    const selectedLinkedComplaint =
      linkedComplaintData && linkedComplaintData.length > 0 && linkedComplaintData[0].id
        ? ({ label: linkedComplaintData[0].id, value: linkedComplaintData[0].id } as Option)
        : null;

    const selectedAssessmentTypes = assessmentState.assessment_type?.map((item) => {
      return {
        label: item.key,
        value: item.value,
      };
    }) as Option[];

    const selectedLocation =
      assessmentState.location_type && assessmentState.location_type.key !== ""
        ? ({ label: assessmentState.location_type.key, value: assessmentState.location_type.value } as Option)
        : null;

    const selectedConflictHistory =
      assessmentState.conflict_history && assessmentState.conflict_history.key !== ""
        ? ({ label: assessmentState.conflict_history.key, value: assessmentState.conflict_history.value } as Option)
        : null;

    const selectedCategoryLevel =
      assessmentState.category_level && assessmentState.category_level.key !== ""
        ? ({ label: assessmentState.category_level.key, value: assessmentState.category_level.value } as Option)
        : null;

    const assesmentDate = assessmentState?.date ? new Date(assessmentState.date) : new Date();

    let selectedContacted;
    if (assessmentState.contacted_complainant === null) {
      selectedContacted = null;
    } else {
      selectedContacted = assessmentState.contacted_complainant ? "Yes" : "No";
    }

    let selectedAttended;
    if (assessmentState.attended === null) {
      selectedAttended = null;
    } else {
      selectedAttended = assessmentState.attended ? "Yes" : "No";
    }

    const selectedAssessmentCat1Types = assessmentState.assessment_cat1_type?.map((item) => {
      return {
        label: item.key,
        value: item.value,
      };
    }) as Option[];

    const legacyAssessmentTypes =
      assessmentState.assessment_type_legacy &&
      (assessmentState.assessment_type_legacy?.map((item) => {
        return {
          label: item.key,
          value: item.value,
        };
      }) as Option[]);

    setSelectedDate(assesmentDate);
    setSelectedOfficer(selectedOfficer);
    setSelectedActionRequired(selectedActionRequired);
    setSelectedJustification(selectedJustification);
    setSelectedLinkedComplaint(selectedLinkedComplaint);
    setSelectedAssessmentTypes(selectedAssessmentTypes);
    setSelectedContacted(selectedContacted);
    setSelectedAttended(selectedAttended);
    setSelectedLocation(selectedLocation);
    setSelectedConflictHistory(selectedConflictHistory);
    setSelectedCategoryLevel(selectedCategoryLevel);
    setSelectedAssessmentCat1Types(selectedAssessmentCat1Types);
    setLegacyAssessmentTypes(legacyAssessmentTypes);

    resetValidationErrors();
    setEditable(!assessmentState.date);

    if (!selectedOfficer && assigned && officersInAgencyList) {
      // Match by checking `person_guid.person_guid` for Officers
      // or `personGuid` for Collaborators
      const officerAssigned = officersInAgencyList
        .filter((person: any) => {
          const personGuid = person.person_guid?.person_guid || person.personGuid;
          return personGuid === assigned;
        })
        .map((item: any) => {
          const firstName = item.person_guid?.first_name || item.firstName;
          const lastName = item.person_guid?.last_name || item.lastName;
          const authUserGuid = item.auth_user_guid || item.authUserGuid;

          return {
            label: `${lastName}, ${firstName}`,
            value: authUserGuid,
          } as Option;
        });

      if (officerAssigned.length > 0 && typeof officerAssigned[0].label !== "undefined") {
        setSelectedOfficer(officerAssigned[0]);
      }
    }
    // officersInAgencyList should be in this list, but it is not a correctly implimented selector
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentState, linkedComplaintData, assigned, quickClose]);

  useEffect(() => {
    populateAssessmentUI();
  }, [assessmentState, populateAssessmentUI]);

  const justificationLabelClass = selectedActionRequired?.value === "No" ? "inherit" : "hidden";
  const justificationEditClass = selectedActionRequired?.value === "No" ? "inherit" : "hidden";
  const showDuplicateOptions = selectedActionRequired?.value === "No" && selectedJustification?.value === "DUPLICATE";

  const cancelConfirmed = () => {
    populateAssessmentUI();
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  // save to redux if no errors.  Otherwise, display error message(s).
  const saveButtonClick = async () => {
    if (!hasErrors()) {
      const updatedAssessmentData: Assessment = {
        date: selectedDate,
        officer: {
          key: selectedOfficer?.label,
          value: selectedOfficer?.value,
        },
        action_required: selectedActionRequired?.label,
        close_complaint:
          selectedActionRequired?.value === "No" && (quickClose || selectedJustification?.value === "DUPLICATE"),
        justification: {
          key: selectedJustification?.label,
          value: selectedJustification?.value,
        },
        linked_complaint: {
          key: selectedLinkedComplaint?.label,
          value: selectedLinkedComplaint?.value,
        },
        assessment_type:
          selectedActionRequired?.label === OptionLabels.OPTION_NO
            ? []
            : selectedAssessmentTypes?.map((item) => {
                return {
                  key: item.label,
                  value: item.value,
                };
              }),
        contacted_complainant: selectedContacted === "Yes",
        attended: selectedAttended === "Yes",
        location_type:
          selectedLocation && isLargeCarnivore
            ? {
                key: selectedLocation?.label,
                value: selectedLocation?.value,
              }
            : undefined,
        conflict_history:
          selectedConflictHistory && isLargeCarnivore
            ? {
                key: selectedConflictHistory?.label,
                value: selectedConflictHistory?.value,
              }
            : null,
        category_level:
          selectedCategoryLevel && isLargeCarnivore
            ? {
                key: selectedCategoryLevel?.label,
                value: selectedCategoryLevel?.value,
              }
            : null,
        assessment_cat1_type:
          selectedActionRequired?.label === OptionLabels.OPTION_NO || !isLargeCarnivore
            ? []
            : selectedAssessmentCat1Types?.map((item) => {
                return {
                  key: item.label,
                  value: item.value,
                };
              }),
      };

      dispatch(upsertAssessment(id, updatedAssessmentData));
      if (
        selectedOfficer?.value &&
        !assigned &&
        selectedOfficerData?.person_guid?.person_guid &&
        (complaintData?.delegates.length === 0 || complaintData?.delegates?.every((delegate) => !delegate.isActive))
      ) {
        dispatch(assignComplaintToOfficer(id, selectedOfficerData?.person_guid?.person_guid));
      }
      setEditable(false);
      handleSave();
    } else {
      handleFormErrors();
    }
  };

  const handleFormErrors = () => {
    ToggleError("Errors in form");
    setValidateOnChange(true);
  };

  // Clear out existing validation errors
  const resetValidationErrors = () => {
    setOfficerErrorMessage("");
    setActionRequiredErrorMessage("");
    setAssessmentDateErrorMessage("");
    setJustificationRequiredErrorMessage("");
    setLinkedComplaintErrorMessage("");
    setAssessmentRequiredErrorMessage("");
    setLocationErrorMessage("");
  };

  const validateOfficer = useCallback((): boolean => {
    if (!selectedOfficer) {
      setOfficerErrorMessage("Required");
      return true;
    }
    return false;
  }, [selectedOfficer]);

  const validateDate = useCallback((): boolean => {
    if (!selectedDate) {
      setAssessmentDateErrorMessage("Required");
      return true;
    }
    return false;
  }, [selectedDate]);

  const validateActionRequired = useCallback((): boolean => {
    if (!selectedActionRequired) {
      setActionRequiredErrorMessage("Required");
      return true;
    }
    return false;
  }, [selectedActionRequired]);

  const validateAssessmentTypes = useCallback((): boolean => {
    if (
      selectedActionRequired?.value === OptionLabels.OPTION_YES &&
      (!selectedAssessmentTypes || selectedAssessmentTypes?.length <= 0) &&
      (!selectedAssessmentCat1Types || selectedAssessmentCat1Types?.length <= 0)
    ) {
      setAssessmentRequiredErrorMessage("At least one animal action is required to save this section");
      return true;
    }
    return false;
  }, [selectedActionRequired, selectedAssessmentTypes, selectedAssessmentCat1Types]);

  const validateLocationType = useCallback((): boolean => {
    if (!selectedLocation && selectedActionRequired?.value === OptionLabels.OPTION_YES && isLargeCarnivore) {
      setLocationErrorMessage("Required");
    }
    if (selectedActionRequired?.value === "No" && !selectedJustification) {
      setJustificationRequiredErrorMessage("Required when Action Required is No");
      return true;
    }
    return false;
  }, [isLargeCarnivore, selectedActionRequired?.value, selectedJustification, selectedLocation]);

  const validateJustification = useCallback((): boolean => {
    if (selectedActionRequired?.value === "No" && !selectedJustification) {
      setJustificationRequiredErrorMessage("Required when Action Required is No");
      return true;
    } else if (
      selectedActionRequired?.value === "No" &&
      selectedJustification?.value === "DUPLICATE" &&
      linkedComplaintData?.length > 0 &&
      !linkedComplaintData[0].parent
    ) {
      setJustificationRequiredErrorMessage(
        "Other complaints are linked to this complaint. This complaint cannot be closed as a duplicate.",
      );
      return true;
    }
    return false;
  }, [selectedActionRequired, selectedJustification, linkedComplaintData]);

  const validateLinkedComplaint = useCallback((): boolean => {
    if (selectedJustification?.value === "DUPLICATE") {
      if (!selectedLinkedComplaint) {
        setLinkedComplaintErrorMessage("Required when Justification is Duplicate");
        return true;
      } else if (selectedLinkedComplaint.value === id) {
        setLinkedComplaintErrorMessage("Linked complaint cannot be the same as the current complaint.");
        return true;
      }

      if (!validationResults.canQuickCloseComplaint) {
        setJustificationRequiredErrorMessage(
          "Please address the errors in the other sections before closing the complaint as duplicate.",
        );
        if (!cases.isInEdit.showSectionErrors) {
          dispatch(setIsInEdit({ showSectionErrors: true, hideAssessmentErrors: true }));
        }
        validationResults.scrollToErrors();
        return true;
      }
    }
    return false;
  }, [
    dispatch,
    id,
    selectedJustification,
    selectedLinkedComplaint,
    validationResults,
    cases.isInEdit.showSectionErrors,
  ]);

  // Validates the assessment
  const hasErrors = useCallback((): boolean => {
    resetValidationErrors();

    let hasErrors = false;
    hasErrors = validateOfficer() || hasErrors;
    hasErrors = validateDate() || hasErrors;
    hasErrors = validateActionRequired() || hasErrors;
    hasErrors = validateAssessmentTypes() || hasErrors;
    hasErrors = validateJustification() || hasErrors;
    hasErrors = validateLinkedComplaint() || hasErrors;
    hasErrors = validateLocationType() || hasErrors;

    return hasErrors;
  }, [
    validateOfficer,
    validateDate,
    validateActionRequired,
    validateAssessmentTypes,
    validateJustification,
    validateLinkedComplaint,
    validateLocationType,
  ]);

  // Validate on selected value change
  useEffect(() => {
    validateOnChange && hasErrors();
  }, [
    validateOnChange,
    hasErrors,
    selectedOfficer,
    selectedActionRequired,
    selectedJustification,
    selectedLinkedComplaint,
    selectedAssessmentTypes,
  ]);

  const determineBorder = (): string => {
    let cardBorder = showSectionErrors ? "danger" : "default";
    if (quickClose) {
      cardBorder = "0";
    }
    return cardBorder;
  };

  const assessmentDivClass = `comp-details-form-row ${selectedActionRequired?.value === "Yes" ? "inherit" : "hidden"}`;

  return (
    <section className="comp-details-section comp-outcome-report-complaint-assessment">
      {showHeader && (
        <div className="comp-details-section-header">
          <h3>Complaint assessment</h3>
          {!editable && (
            <div className="comp-details-section-header-actions">
              <Button
                id="assessment-edit-button"
                variant="outline-primary"
                size="sm"
                onClick={toggleEdit}
                disabled={isReadOnly}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit</span>
              </Button>
            </div>
          )}
        </div>
      )}
      <Card
        id="outcome-assessment"
        border={determineBorder()}
      >
        <Card.Body className={quickClose ? "p-0" : ""}>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {hasAssessment ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>Complete section before closing the complaint.</span>
              )}
            </div>
          )}

          {editable ? (
            <div className="comp-details-form">
              <div
                className="comp-details-form-row"
                id="action-required-div"
              >
                <label htmlFor="action-required">
                  Action required? {!quickClose && <span className="required-ind">*</span>}
                </label>
                <div className="comp-details-input full-width">
                  {quickClose ? (
                    <span>{selectedActionRequired?.value}</span>
                  ) : (
                    <CompSelect
                      id="action-required"
                      showInactive={false}
                      className="comp-details-input"
                      classNamePrefix="comp-select"
                      options={actionRequiredList}
                      enableValidation={true}
                      errorMessage={actionRequiredErrorMessage}
                      value={selectedActionRequired}
                      placeholder="Select"
                      onChange={(e) => handleActionRequiredChange(e)}
                      isDisabled={isReadOnly}
                      isClearable={true}
                    />
                  )}
                </div>
              </div>
              <div
                className={`comp-details-form-row ${justificationEditClass}`}
                id="justification-div"
              >
                <label htmlFor="justification">
                  Justification<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input full-width">
                  <CompSelect
                    id="justification"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    options={justificationList}
                    enableValidation={true}
                    errorMessage={justificationRequiredErrorMessage}
                    value={selectedJustification}
                    placeholder="Select"
                    onChange={(e) => handleJustificationChange(e)}
                    isClearable={true}
                  />
                </div>
              </div>
              {showDuplicateOptions && !quickClose && (
                <div className="comp-details-form-row">
                  <label
                    htmlFor="duplicate-warning"
                    aria-label="warning"
                  />
                  <div className="comp-details-input full-width">
                    <Alert
                      id="duplicate-warning"
                      variant="warning"
                      className="comp-complaint-details-alert"
                    >
                      <i className="bi bi-info-circle-fill" /> Note that assessing a complaint as duplicate will close
                      the complaint and link it to the selected complaint.
                    </Alert>
                  </div>
                </div>
              )}
              {showDuplicateOptions && (
                <div
                  className="comp-details-form-row"
                  id="linked-complaint-div"
                >
                  <label htmlFor="linkedComplaint">
                    Link current complaint to:<span className="required-ind">*</span>
                  </label>
                  <div className="comp-details-input full-width">
                    <HWCRComplaintAssessmentLinkComplaintSearch
                      id="linkedComplaint"
                      onChange={(e, s) => handleLinkedComplaintChange(e, s)}
                      errorMessage={linkedComplaintErrorMessage}
                      value={selectedLinkedComplaint}
                    />
                  </div>
                </div>
              )}

              {/* Contacted complainant - edit state */}
              <div
                className={assessmentDivClass}
                id="assessment-contacted-complainant-div"
              >
                <label htmlFor="assessment-contacted-complainant-div">
                  Contacted complainant<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input full-width">
                  <CompRadioGroup
                    id="assessment-contacted-complainant-radiogroup"
                    options={noYesOptions}
                    enableValidation={true}
                    itemClassName="comp-radio-btn"
                    groupClassName="comp-equipment-form-radio-group"
                    value={selectedContacted}
                    onChange={(option: any) => setSelectedContacted(option.target.value)}
                    isDisabled={false}
                    radioGroupName="assessment-contacted-complainant-radiogroup"
                  />
                </div>
              </div>

              {/* Attended radio buttons - edit state */}
              <div
                className={assessmentDivClass}
                id="assessment-attended-div"
              >
                <label htmlFor="assessment-attended-div">
                  Attended<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input full-width">
                  <CompRadioGroup
                    id="assessment-attended-radiogroup"
                    options={noYesOptions}
                    enableValidation={true}
                    itemClassName="comp-radio-btn"
                    groupClassName="comp-equipment-form-radio-group"
                    value={selectedAttended}
                    onChange={(option: any) => setSelectedAttended(option.target.value)}
                    isDisabled={false}
                    radioGroupName="assessment-attended-radiogroup"
                  />
                </div>
              </div>

              {/* Animal actions */}
              <div
                className={assessmentDivClass}
                id="assessment-checkbox-div"
              >
                <div className="muliline-label">
                  <div>
                    <div>
                      Animal actions<span className="required-ind">*</span>
                    </div>
                    <div>(Select all applicable boxes)</div>
                  </div>
                </div>
                <div className="comp-details-input full-width">
                  <ValidationCheckboxGroup
                    errMsg={isLargeCarnivore ? "" : assessmentRequiredErrorMessage}
                    options={assessmentTypeList}
                    onCheckboxChange={(option: Option[]) => setSelectedAssessmentTypes(option)}
                    checkedValues={selectedAssessmentTypes}
                  ></ValidationCheckboxGroup>
                  {isLargeCarnivore && (
                    <ValidationCheckboxGroup
                      errMsg={assessmentRequiredErrorMessage}
                      options={assessmentCat1Options}
                      onCheckboxChange={(option: Option[]) => setSelectedAssessmentCat1Types(option)}
                      checkedValues={selectedAssessmentCat1Types}
                    ></ValidationCheckboxGroup>
                  )}
                </div>
              </div>

              {isLargeCarnivore && (
                <>
                  {/* Location type - edit state */}
                  <div
                    className={assessmentDivClass}
                    id="assessment-location-type-div"
                  >
                    <label
                      className="mb-2"
                      htmlFor="select-location-type"
                    >
                      Location type<span className="required-ind">*</span>
                    </label>
                    <CompSelect
                      id="select-location-type"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={locationOptions}
                      value={selectedLocation}
                      enableValidation={true}
                      errorMessage={locationErrorMessage}
                      placeholder={"Select"}
                      onChange={(e: any) => {
                        setSelectedLocation(e);
                      }}
                      isClearable={true}
                    />
                  </div>

                  {/* Conflict history - edit state */}
                  <div
                    className={assessmentDivClass}
                    id="assessment-conflict-history-div"
                  >
                    <label
                      className="mb-2"
                      htmlFor="select-conflict-history"
                    >
                      Conflict history
                    </label>
                    <CompSelect
                      id="select-conflict-history"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={conflictHistoryOptions}
                      value={selectedConflictHistory}
                      enableValidation={false}
                      placeholder={"Select"}
                      onChange={(e: any) => {
                        setSelectedConflictHistory(e);
                      }}
                      isClearable={true}
                    />
                  </div>

                  {/* Category level - edit state */}
                  <div
                    className={assessmentDivClass}
                    id="assessment-category-level-div"
                  >
                    <label
                      className="mb-2"
                      htmlFor="select-category-level"
                    >
                      Category level
                    </label>
                    <CompSelect
                      id="select-category-level"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={threatLevelOptions}
                      value={selectedCategoryLevel}
                      enableValidation={false}
                      placeholder={"Select"}
                      onChange={(e: any) => {
                        setSelectedCategoryLevel(e);
                      }}
                      isClearable={true}
                    />
                  </div>
                </>
              )}

              {/* Officer */}
              <div
                className="comp-details-form-row"
                id="outcome-officer-div"
              >
                <label htmlFor="outcome-officer">
                  Officer<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input full-width">
                  <CompSelect
                    id="outcome-officer"
                    showInactive={false}
                    className="comp-details-input"
                    classNamePrefix="comp-select"
                    options={assignableOfficers}
                    enableValidation={true}
                    errorMessage={officerErrorMessage}
                    value={selectedOfficer}
                    placeholder="Select "
                    onChange={handleSelectedOfficerChange}
                    isDisabled={isReadOnly}
                    isClearable={true}
                  />
                </div>
              </div>
              <div
                className="comp-details-form-row"
                id="complaint-outcome-date-div"
              >
                <label htmlFor="complaint-outcome-date">
                  Date<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input">
                  <ValidationDatePicker
                    id="complaint-outcome-date"
                    selectedDate={selectedDate}
                    onChange={handleDateChange}
                    placeholder="Select date"
                    className="comp-details-edit-calendar-input" // Adjust class as needed
                    classNamePrefix="comp-select" // Adjust class as needed
                    errMsg={assessmentDateErrorMessage} // Pass error message if any
                    maxDate={new Date()}
                    isDisabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="comp-details-form-buttons">
                <Button
                  variant="outline-primary"
                  id="outcome-cancel-button"
                  title="Cancel Outcome"
                  onClick={quickClose ? handleClose : cancelButtonClick}
                  disabled={isReadOnly}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  id="outcome-save-button"
                  title="Save Outcome"
                  onClick={saveButtonClick}
                  disabled={isReadOnly}
                >
                  <span>{quickClose ? "Save and Close" : "Save"}</span>
                </Button>
              </div>
            </div>
          ) : (
            <dl>
              <div id="action-required-div">
                <dt>Action required</dt>
                <dd>{selectedActionRequired?.value}</dd>
              </div>
              <div
                id="justification-div"
                className={justificationLabelClass}
              >
                <dt>Justification</dt>
                <dd>
                  <span>{selectedJustification?.label || ""}</span>
                </dd>
              </div>
              {showDuplicateOptions && (
                <div
                  id="linked-complaint-div"
                  className={justificationLabelClass}
                >
                  <dt>Linked complaint</dt>
                  <dd>
                    <Link
                      to={`/complaint/HWCR/${selectedLinkedComplaint?.value}`}
                      id={selectedLinkedComplaint?.value}
                    >
                      {selectedLinkedComplaint?.label || ""}
                    </Link>
                  </dd>
                </div>
              )}

              {/* Contacted complainant - view state */}
              {selectedContacted !== null && (
                <div
                  id="contacted-complainant-div"
                  className={assessmentDivClass}
                >
                  <dt>Contacted complainant</dt>
                  <dd>
                    <span>{selectedContacted}</span>
                  </dd>
                </div>
              )}

              {/* Attended - view state */}
              {selectedAttended !== null && (
                <div
                  id="attended-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Attended</dt>
                  <dd>
                    <span>{selectedAttended}</span>
                  </dd>
                </div>
              )}

              {/* Legacy actions - view state */}
              {legacyAssessmentTypes && legacyAssessmentTypes.length > 0 && (
                <div
                  id="assessment-legacy-checkbox-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Actions (legacy)</dt>
                  <dd>
                    <ul>
                      {legacyAssessmentTypes?.map((assesmentValue) => (
                        <li
                          className="checkbox-label-padding"
                          key={assesmentValue.label}
                        >
                          {assesmentValue.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              {/* Animal actions - view state */}
              {((selectedAssessmentTypes && selectedAssessmentTypes.length > 0) ||
                (selectedAssessmentCat1Types && selectedAssessmentCat1Types.length > 0)) && (
                <div
                  id="assessment-checkbox-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Animal actions</dt>
                  <dd>
                    <ul>
                      {selectedAssessmentTypes?.map((assesmentValue) => (
                        <li
                          className="checkbox-label-padding"
                          key={assesmentValue.label}
                        >
                          {assesmentValue.label}
                        </li>
                      ))}
                      {selectedAssessmentCat1Types?.map((assesmentValue) => (
                        <li
                          className="checkbox-label-padding"
                          key={assesmentValue.label}
                        >
                          {assesmentValue.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              {/* Location type - view state */}
              {isLargeCarnivore && selectedActionRequired?.value === OptionLabels.OPTION_YES && selectedLocation && (
                <div
                  id="location-type-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Location type</dt>
                  <dd>
                    <span>{selectedLocation?.label}</span>
                  </dd>
                </div>
              )}

              {/* Conflict history - view state */}
              {(isLargeCarnivore || (legacyAssessmentTypes && legacyAssessmentTypes?.length > 0)) &&
                selectedActionRequired?.value === OptionLabels.OPTION_YES &&
                selectedConflictHistory && (
                  <div
                    id="conflict history-div"
                    className={assessmentDivClass}
                    style={{ marginTop: "0px" }}
                  >
                    <dt>Conflict history</dt>
                    <dd>
                      <span>{selectedConflictHistory.label}</span>
                    </dd>
                  </div>
                )}

              {/* Category level - view state */}
              {isLargeCarnivore &&
                selectedActionRequired?.value === OptionLabels.OPTION_YES &&
                selectedCategoryLevel && (
                  <div
                    id="conflict history-div"
                    className={assessmentDivClass}
                    style={{ marginTop: "0px" }}
                  >
                    <dt>Category level</dt>
                    <dd>
                      <span>{selectedCategoryLevel.label}</span>
                    </dd>
                  </div>
                )}

              <div>
                <dt>Officer</dt>
                <dd>
                  <span id="assessment-officer-div">{selectedOfficer?.label ?? ""}</span>
                </dd>
              </div>
              <div id="assessment-date-div">
                <dt>Date</dt>
                <dd>{formatDate(`${selectedDate}`)}</dd>
              </div>
            </dl>
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
