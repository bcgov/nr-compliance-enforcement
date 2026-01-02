import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";

import { Button, Card } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { ValidationCheckboxGroup } from "@/app/common/validation-checkbox-group";
import { CompSelect } from "@/app/components/common/comp-select";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";

import Option from "@/app/types/app/option";
import { Prevention } from "@/app/types/outcomes/prevention";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";

import { selectIsInEdit } from "@/app/store/reducers/complaint-outcome-selectors";
import { selectPreventionTypeCodeDropdown } from "@store/reducers/code-table";
import { openModal } from "@store/reducers/app";
import {
  selectOfficerAndCollaboratorListByAgency,
  selectOfficersAndCollaboratorsByAgency,
} from "@store/reducers/officer";

import { RootState } from "@/app/store/store";
import { selectComplaintAssignedBy, selectComplaintCallerInformation } from "@store/reducers/complaints";
import { upsertPrevention } from "@/app/store/reducers/complaint-outcome-thunks";
import { ToggleError } from "@common/toast";
import UserService from "@/app/service/user-service";

type Props = {
  id: string;
  prevention?: Prevention;
  handleSave?: () => void;
  handleCancel?: () => void;
};

export const HWCRPreventionForm: FC<Props> = ({ id, prevention, handleSave = () => {}, handleCancel = () => {} }) => {
  const dispatch = useAppDispatch();

  const isInEdit = useAppSelector(selectIsInEdit);
  const assigned = useAppSelector(selectComplaintAssignedBy);
  const assignableOfficers = useAppSelector(selectOfficerAndCollaboratorListByAgency);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officersInAgencyList = useSelector(
    (state: RootState) => selectOfficersAndCollaboratorsByAgency(state, ownedByAgencyCode?.agency), // Pass agency here
  );
  const preventionTypeList = useAppSelector((state) =>
    selectPreventionTypeCodeDropdown(state, UserService.getUserAgency()),
  );

  const currentDate = new Date();
  const [preventionState] = useState<Prevention>(prevention ?? ({} as Prevention));

  // Errors

  const showSectionErrors = isInEdit.showSectionErrors;
  const [officerErrorMessage, setOfficerErrorMessage] = useState<string>("");
  const [preventionDateErrorMessage, setPreventionDateErrorMessage] = useState<string>("");
  const [preventionRequiredErrorMessage, setPreventionRequiredErrorMessage] = useState<string>("");

  // Form state

  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option>();
  const [selectedPreventionTypes, setSelectedPreventionTypes] = useState<Option[]>([]);

  // Effects

  useEffect(() => {
    const populatePreventionUI = () => {
      resetValidationErrors();

      const officer = preventionState.officer
        ? { label: preventionState.officer.key, value: preventionState.officer.value }
        : undefined;

      setSelectedOfficer(officer);

      setSelectedPreventionTypes(
        (preventionState.prevention_type ?? []).map((item) => ({
          label: item.key,
          value: item.value,
        })),
      );

      setSelectedDate(preventionState.date ? new Date(preventionState.date) : new Date());

      if (!officer && officersInAgencyList && assigned) {
        const officerAssigned = officersInAgencyList
          .filter((appUser: any) => {
            const guid = appUser.app_user_guid ?? appUser.appUserGuid;
            return guid === assigned;
          })
          .map((item: any) => {
            const firstName = item.first_name ?? item.firstName;
            const lastName = item.last_name ?? item.lastName;
            const authUserGuid = item.auth_user_guid ?? item.authUserGuid;
            return { label: `${lastName}, ${firstName}`, value: authUserGuid };
          });

        if (officerAssigned.length && officerAssigned[0].label) {
          setSelectedOfficer(officerAssigned[0]);
        }
      }
    };

    populatePreventionUI();
  }, [assigned, officersInAgencyList, preventionState]);

  // Change handlers

  const handlePreventionTypesChange = (selectedItems: Option[]) => {
    setSelectedPreventionTypes(selectedItems);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Validation

  const handleFormErrors = () => {
    ToggleError("Errors in form");
  };

  const resetValidationErrors = () => {
    setOfficerErrorMessage("");
    setPreventionDateErrorMessage("");
    setPreventionRequiredErrorMessage("");
  };

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

  // Button handlers

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => handleCancel(),
        },
      }),
    );
  };

  const saveButtonClick = async () => {
    if (!hasErrors()) {
      const updatedPreventionData: Prevention = {
        id: preventionState.id,
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

      dispatch(upsertPrevention(id, ownedByAgencyCode.agency, updatedPreventionData));
      handleSave();
    } else {
      handleFormErrors();
    }
  };

  return (
    <Card border={showSectionErrors ? "danger" : "default"}>
      <Card.Body>
        {showSectionErrors && (
          <div className="section-error-message">
            <BsExclamationCircleFill />
            <span>Save section before closing the complaint.</span>
          </div>
        )}
        <div className="comp-details-form">
          <div
            className="comp-details-form-row"
            id="prev-educ-checkbox-div"
          >
            <label htmlFor="checkbox-div">
              Actions<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <ValidationCheckboxGroup
                errMsg={preventionRequiredErrorMessage}
                options={preventionTypeList}
                onCheckboxChange={handlePreventionTypesChange}
                checkedValues={selectedPreventionTypes}
              ></ValidationCheckboxGroup>
            </div>
          </div>
          <div
            className="comp-details-form-row"
            id="prev-educ-outcome-officer-div"
          >
            <label htmlFor="prev-educ-outcome-officer">
              Officer<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="prev-educ-outcome-officer"
                showInactive={false}
                classNamePrefix="comp-select"
                options={assignableOfficers}
                enableValidation={true}
                errorMessage={officerErrorMessage}
                value={selectedOfficer}
                placeholder="Select "
                onChange={(officer: any) => setSelectedOfficer(officer)}
                isClearable={true}
              />
            </div>
          </div>
          <div
            className="comp-details-form-row"
            id="prev-educ-outcome-date-div"
          >
            <label htmlFor="prev-educ-outcome-date">
              Date<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input">
              <ValidationDatePicker
                id="prev-educ-outcome-date"
                selectedDate={selectedDate}
                onChange={handleDateChange}
                className="comp-details-edit-calendar-input" // Adjust class as needed
                classNamePrefix="comp-select" // Adjust class as needed
                errMsg={preventionDateErrorMessage} // Pass error message if any
                maxDate={currentDate}
              />
            </div>
          </div>
          <div className="comp-details-form-buttons">
            <Button
              variant="outline-primary"
              id="prev-educ-outcome-cancel-button"
              title="Cancel Outcome"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              id="outcome-save-prev-and-educ-button"
              title="Save Outcome"
              onClick={saveButtonClick}
            >
              Save
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
