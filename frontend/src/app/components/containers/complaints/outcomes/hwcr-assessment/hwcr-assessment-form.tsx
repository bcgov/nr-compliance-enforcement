import { FC, useEffect, useState, useCallback } from "react";
import { Button, Card, Alert } from "react-bootstrap";
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
import { CompSelect } from "@components/common/comp-select";
import { ValidationCheckboxGroup } from "@common/validation-checkbox-group";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { ToggleError } from "@common/toast";
import { Assessment } from "@apptypes/outcomes/assessment";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { BsExclamationCircleFill } from "react-icons/bs";

import "@assets/sass/hwcr-assessment.scss";
import { upsertAssessment } from "@/app/store/reducers/complaint-outcome-thunks";
import { OptionLabels } from "@constants/option-labels";
import { HWCRAssessmentLinkComplaintSearch } from "./hwcr-assessment-link-complaint-search";
import { CompRadioGroup } from "@/app/components/common/comp-radiogroup";
import useValidateComplaint from "@hooks/validate-complaint";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import KeyValuePair from "@/app/types/app/key-value-pair";
import UserService from "@/app/service/user-service";

type Props = {
  id: string;
  assessment?: Assessment;
  handleSave?: () => void;
  handleCancel?: () => void;
  quickClose?: boolean;
  allowDuplicate?: boolean;
};

export const HWCRAssessmentForm: FC<Props> = ({
  id,
  assessment,
  handleSave = () => {},
  handleCancel = () => {},
  quickClose = false,
  allowDuplicate = false,
}) => {
  const dispatch = useAppDispatch();

  const [assessmentState, setAssessmentState] = useState<Assessment>(assessment ?? ({} as Assessment));

  const [selectedActionRequired, setSelectedActionRequired] = useState<Option | null>();
  const [selectedJustification, setSelectedJustification] = useState<Option | null>();
  const [selectedLinkedComplaint, setSelectedLinkedComplaint] = useState<Option | null>();

  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>();

  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState<Option[]>([]);
  const [validateOnChange, setValidateOnChange] = useState<boolean>(false);
  const [selectedContacted, setSelectedContacted] = useState<string | null>("No");
  const [selectedOfficerData, setSelectedOfficerData] = useState<AppUser | null>();
  const [selectedAttended, setSelectedAttended] = useState<string | null>("No");
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [selectedConflictHistory, setSelectedConflictHistory] = useState<Option | null>(null);
  const [selectedCategoryLevel, setSelectedCategoryLevel] = useState<Option | null>(null);
  const [selectedAssessmentCat1Types, setSelectedAssessmentCat1Types] = useState<Option[]>([]);

  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [assessmentDateErrorMessage, setAssessmentDateErrorMessage] = useState<string>("");
  const [actionRequiredErrorMessage, setActionRequiredErrorMessage] = useState<string>("");
  const [justificationRequiredErrorMessage, setJustificationRequiredErrorMessage] = useState<string>("");
  const [linkedComplaintErrorMessage, setLinkedComplaintErrorMessage] = useState<string>("");
  const [assessmentRequiredErrorMessage, setAssessmentRequiredErrorMessage] = useState<string>("");
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>("");

  const complaintData = useAppSelector(selectComplaint);
  const linkedComplaintData = useAppSelector(selectLinkedComplaints);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const complaintOutcomes = useAppSelector((state) => state.complaintOutcomes);
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

  const hasAssessments = Boolean(assessment);
  const showSectionErrors =
    !hasAssessments && complaintOutcomes.isInEdit.showSectionErrors && !complaintOutcomes.isInEdit.hideAssessmentErrors;

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
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
    const mapOption = (item?: KeyValuePair | null) => (item?.key ? { label: item.key, value: item.value } : null);

    const mapOptions = (items?: KeyValuePair[] | null) =>
      items?.map((item) => ({ label: item.key, value: item.value })) || [];

    const mapYesNo = (value?: boolean | null) => {
      if (value === null) {
        return null;
      }
      if (value) {
        return "Yes";
      }
      return "No";
    };

    let selectedOfficer: Option | null = null;
    if (assessmentState.officer) {
      selectedOfficer = {
        label: assessmentState.officer.key,
        value: assessmentState.officer.value,
      };
    }

    let selectedActionRequired: Option | null = null;
    if (assessmentState.action_required) {
      selectedActionRequired = {
        label: assessmentState.action_required,
        value: assessmentState.action_required,
      };
    } else if (quickClose) {
      selectedActionRequired = { label: "No", value: "No" };
    }

    let selectedJustification: Option | null = null;
    if (assessmentState.justification) {
      selectedJustification = {
        label: assessmentState.justification.key,
        value: assessmentState.justification.value,
      };
    } else if (quickClose) {
      selectedJustification = { label: "Duplicate", value: "DUPLICATE" };
    }

    const selectedLinkedComplaint =
      linkedComplaintData?.length && linkedComplaintData[0].id
        ? { label: linkedComplaintData[0].id, value: linkedComplaintData[0].id }
        : null;

    const selectedAssessmentTypes = mapOptions(assessmentState.assessment_type);
    const selectedAssessmentCat1Types = mapOptions(assessmentState.assessment_cat1_type);

    const selectedLocation = mapOption(assessmentState.location_type);
    const selectedConflictHistory = mapOption(assessmentState.conflict_history);
    const selectedCategoryLevel = mapOption(assessmentState.category_level);

    const selectedDateValue = assessmentState?.date ? new Date(assessmentState.date) : new Date();
    const selectedContacted = mapYesNo(assessmentState.contacted_complainant);
    const selectedAttended = mapYesNo(assessmentState.attended);

    setSelectedDate(selectedDateValue);
    setSelectedOfficer(selectedOfficer as Option);
    setSelectedActionRequired(selectedActionRequired as Option);
    setSelectedJustification(selectedJustification as Option);
    setSelectedLinkedComplaint(selectedLinkedComplaint as Option);
    setSelectedAssessmentTypes(selectedAssessmentTypes);
    setSelectedContacted(selectedContacted);
    setSelectedAttended(selectedAttended);
    setSelectedLocation(selectedLocation);
    setSelectedConflictHistory(selectedConflictHistory);
    setSelectedCategoryLevel(selectedCategoryLevel);
    setSelectedAssessmentCat1Types(selectedAssessmentCat1Types);

    resetValidationErrors();

    if (!selectedOfficer && assigned && officersInAgencyList) {
      const officerAssigned = officersInAgencyList
        .filter((appUser: any) => {
          const appUserGuid = appUser.app_user_guid ?? appUser.appUserGuid;
          return appUserGuid === assigned;
        })
        .map((item: any) => {
          const firstName = item.first_name ?? item.firstName;
          const lastName = item.last_name ?? item.lastName;
          const authUserGuid = item.auth_user_guid ?? item.authUserGuid;
          return { label: `${lastName}, ${firstName}`, value: authUserGuid } as Option;
        });
      if (officerAssigned.length && officerAssigned[0].label) {
        setSelectedOfficer(officerAssigned[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentState, linkedComplaintData, assigned, quickClose]);

  useEffect(() => {
    populateAssessmentUI();
  }, [assessmentState, populateAssessmentUI]);

  const justificationEditClass = selectedActionRequired?.value === "No" ? "inherit" : "hidden";
  const showDuplicateOptions = selectedActionRequired?.value === "No" && selectedJustification?.value === "DUPLICATE";

  const cancelConfirmed = () => {
    handleCancel();
    setAssessmentState(assessment ?? ({} as Assessment));
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

  const mapOption = (option?: Option | null) => (option ? { key: option.label, value: option.value } : undefined);

  const mapOptions = (options?: Option[] | null) =>
    options?.map((item) => ({ key: item.label, value: item.value })) ?? [];

  const shouldCloseComplaint = () =>
    selectedActionRequired?.value === "No" && (quickClose || selectedJustification?.value === "DUPLICATE");

  const getUpdatedAssessmentData = () => ({
    id: assessmentState?.id,
    date: selectedDate,
    officer: mapOption(selectedOfficer),
    action_required: selectedActionRequired?.label,
    close_complaint: shouldCloseComplaint(),
    justification: mapOption(selectedJustification) ?? { key: "", value: "" },
    linked_complaint: mapOption(selectedLinkedComplaint) ?? { key: "", value: "" },
    assessment_type:
      selectedActionRequired?.label === OptionLabels.OPTION_NO ? [] : mapOptions(selectedAssessmentTypes),
    contacted_complainant: selectedContacted === "Yes",
    attended: selectedAttended === "Yes",
    location_type: isLargeCarnivore ? mapOption(selectedLocation) : undefined,
    conflict_history: isLargeCarnivore && selectedConflictHistory ? mapOption(selectedConflictHistory) : undefined,
    category_level: isLargeCarnivore && selectedCategoryLevel ? mapOption(selectedCategoryLevel) : undefined,
    assessment_cat1_type:
      selectedActionRequired?.label === OptionLabels.OPTION_NO || !isLargeCarnivore
        ? []
        : mapOptions(selectedAssessmentCat1Types),
    agency: UserService.getUserAgency(),
  });

  // save to redux if no errors.  Otherwise, display error message(s).
  const saveButtonClick = async () => {
    if (!validateErrors()) {
      dispatch(upsertAssessment(id, getUpdatedAssessmentData()));
      if (
        selectedOfficer?.value &&
        !assigned &&
        selectedOfficerData?.app_user_guid &&
        (complaintData?.delegates.length === 0 || complaintData?.delegates?.every((delegate) => !delegate.isActive))
      ) {
        dispatch(assignComplaintToOfficer(id, selectedOfficerData?.app_user_guid));
      }
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
    }

    if (selectedActionRequired?.value === "No" && selectedJustification?.value === "DUPLICATE") {
      if (!allowDuplicate) {
        setJustificationRequiredErrorMessage(
          "This complaint has other assessments. This complaint cannot be closed as a duplicate.",
        );
        return true;
      }

      const duplicateComplaints =
        linkedComplaintData?.filter((complaint: any) => complaint.link_type === "DUPLICATE") || [];

      if (
        selectedActionRequired?.value === "No" &&
        selectedJustification?.value === "DUPLICATE" &&
        duplicateComplaints.length > 0 &&
        !duplicateComplaints[0].parent
      ) {
        setJustificationRequiredErrorMessage(
          "Other complaints are linked to this complaint. This complaint cannot be closed as a duplicate.",
        );
        return true;
      }
    }

    return false;
  }, [selectedActionRequired, selectedJustification, linkedComplaintData, allowDuplicate]);

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
        if (!complaintOutcomes.isInEdit.showSectionErrors) {
          dispatch(setIsInEdit({ showSectionErrors: true, hideAssessmentErrors: true }));
        }
        validationResults.scrollToErrors();
        return true;
      }
    }
    return false;
  }, [
    selectedJustification?.value,
    selectedLinkedComplaint,
    id,
    validationResults,
    complaintOutcomes.isInEdit.showSectionErrors,
    dispatch,
  ]);

  // Validates the assessment
  const validateErrors = useCallback((): boolean => {
    resetValidationErrors();
    return [
      validateOfficer(),
      validateDate(),
      validateActionRequired(),
      validateAssessmentTypes(),
      validateJustification(),
      validateLinkedComplaint(),
      validateLocationType(),
    ].some(Boolean);
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
    validateOnChange && validateErrors();
  }, [
    validateOnChange,
    validateErrors,
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
      <Card
        id="outcome-assessment"
        border={determineBorder()}
      >
        <Card.Body className={quickClose ? "p-0" : ""}>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {hasAssessments ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>Complete section before closing the complaint.</span>
              )}
            </div>
          )}

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
                    <i className="bi bi-info-circle-fill" /> Note that assessing a complaint as duplicate will close the
                    complaint.
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
                  Mark as a duplicate of:<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input full-width">
                  <HWCRAssessmentLinkComplaintSearch
                    id="linkedComplaint"
                    onChange={(e: Option | null, s: string | null) => handleLinkedComplaintChange(e, s)}
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
                onClick={quickClose ? handleCancel : cancelButtonClick}
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
        </Card.Body>
      </Card>
    </section>
  );
};
