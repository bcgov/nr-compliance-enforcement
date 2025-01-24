import { FC, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectOfficerListByAgency, selectOfficersByAgency } from "@store/reducers/officer";
import { selectActiveEquipmentDropdown, selectTrapEquipment } from "@store/reducers/code-table";
import { selectComplaint, selectComplaintCallerInformation } from "@store/reducers/complaints";
import { CompSelect } from "@components/common/comp-select";
import { ToggleError } from "@common/toast";
import { bcUtmZoneNumbers, getSelectedItem, formatLatLongCoordinate } from "@common/methods";

import Option from "@apptypes/app/option";

import "react-toastify/dist/ReactToastify.css";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { EquipmentDetailsDto } from "@apptypes/app/case-files/equipment-details";
import { CaseActionDto } from "@apptypes/app/case-files/case-action";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { upsertEquipment } from "@store/reducers/case-thunks";
import { CompRadioGroup } from "@components/common/comp-radiogroup";
import { BsExclamationCircleFill } from "react-icons/bs";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";

export interface EquipmentFormProps {
  equipment?: EquipmentDetailsDto;
  assignedOfficer?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export const EquipmentForm: FC<EquipmentFormProps> = ({ equipment, assignedOfficer, onSave, onCancel }) => {
  const [type, setType] = useState<Option>();
  const [dateSet, setDateSet] = useState<Date>(new Date());
  const [dateRemoved, setDateRemoved] = useState<Date>();
  const [officerSet, setOfficerSet] = useState<Option | undefined>();
  const [officerRemoved, setOfficerRemoved] = useState<Option>();
  const [address, setAddress] = useState<string | undefined>("");
  const [xCoordinate, setXCoordinate] = useState<string | undefined>("");
  const [yCoordinate, setYCoordinate] = useState<string | undefined>("");
  const [equipmentAddressErrorMsg, setEquipmentAddressErrorMsg] = useState<string>("");
  const [equipmentTypeErrorMsg, setEquipmentTypeErrorMsg] = useState<string>("");
  const [officerSetErrorMsg, setOfficerSetErrorMsg] = useState<string>("");
  const [dateSetErrorMsg, setDateSetErrorMsg] = useState<string>("");
  const [officerRemovedErrorMsg, setOfficerRemovedErrorMsg] = useState<string>("");
  const [dateRemovedErrorMsg, setDateRemovedErrorMsg] = useState<string>("");
  const [xCoordinateErrorMsg, setXCoordinateErrorMsg] = useState<string>("");
  const [yCoordinateErrorMsg, setYCoordinateErrorMsg] = useState<string>("");
  const [coordinateErrorsInd, setCoordinateErrorsInd] = useState<boolean>(false);
  const [actionSetGuid, setActionSetGuid] = useState<string>();
  const [actionRemovedGuid, setActionRemovedGuid] = useState<string>();
  const [wasAnimalCaptured, setWasAnimalCaptured] = useState<string>("U");
  const [wasAnimalCapturedErrorMsg, setWasAnimalCapturedErrorMsg] = useState<string>("");

  const dispatch = useAppDispatch();
  const { id = "", complaintType = "" } = useParams<{ id: string; complaintType: string }>();
  const complaintData = useAppSelector(selectComplaint);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency));
  const equipmentDropdownOptions = useAppSelector(selectActiveEquipmentDropdown);
  const trapEquipment = useAppSelector(selectTrapEquipment);
  const assignableOfficers = useAppSelector(selectOfficerListByAgency);

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  // for turning codes into values
  const getValue = useCallback(
    (property: string): Option | undefined => {
      return equipmentDropdownOptions.find((item) => item.value === equipment?.typeCode);
    },
    [equipmentDropdownOptions, equipment?.typeCode],
  );

  useEffect(() => {
    if (assignedOfficer && officersInAgencyList) {
      const officerAssigned: any = officersInAgencyList
        .filter((officer) => officer.person_guid.person_guid === assignedOfficer)
        .map((item) => {
          return {
            label: `${item.person_guid?.last_name}, ${item.person_guid?.first_name}`,
            value: item.auth_user_guid,
          } as Option;
        });
      if (officerAssigned.length === 1) {
        setOfficerSet(officerAssigned[0]);
      }
    }
    // officersInAgencyList should be a dependency but its selector needs to be refactored using a selector creator to avoid an infinte loop here by adding it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedOfficer]);

  useEffect(() => {
    // set the equipment type code in the form
    setType(getValue("equipment"));

    setAddress(equipment?.address);
    setXCoordinate(equipment?.xCoordinate);
    setYCoordinate(equipment?.yCoordinate);
    equipment?.actions?.forEach((action) => {
      if (action.actionCode === CASE_ACTION_CODE.SETEQUIPMT && equipment.actions && complaintData) {
        const setOfficer = getSelectedItem(action.actor, assignableOfficers);
        setOfficerSet(setOfficer);
        setDateSet(new Date(action.date));
        setActionSetGuid(action.actionGuid);
      } else if (action.actionCode === CASE_ACTION_CODE.REMEQUIPMT && complaintData) {
        const removedOfficer = getSelectedItem(action.actor, assignableOfficers);
        setOfficerRemoved(removedOfficer);
        setDateRemoved(new Date(action.date));
        setActionRemovedGuid(action.actionGuid);
      }
    });
    setWasAnimalCaptured(equipment?.wasAnimalCaptured ?? "U");
  }, [assignableOfficers, complaintData, equipment, getValue]);

  // Reset error messages
  const resetValidationErrors = () => {
    setOfficerSetErrorMsg("");
    setDateSetErrorMsg("");
    setXCoordinateErrorMsg("");
    setYCoordinateErrorMsg("");
    setEquipmentTypeErrorMsg("");
    setEquipmentAddressErrorMsg("");
    setOfficerRemovedErrorMsg("");
    setDateRemovedErrorMsg("");
    setWasAnimalCapturedErrorMsg("");
  };

  // Helper function to check if coordinates or address are provided
  const validateLocation = (): boolean => {
    const isAddressEmpty = !address;
    const isXCoordinateEmpty = !xCoordinate;
    const isYCoordinateEmpty = !yCoordinate;

    if (isAddressEmpty && (isXCoordinateEmpty || isYCoordinateEmpty)) {
      setEquipmentAddressErrorMsg("Address is required if coordinates are not provided.");
      if (isXCoordinateEmpty) setXCoordinateErrorMsg("Longitude is required if address is not provided.");
      if (isYCoordinateEmpty) setYCoordinateErrorMsg("Latitude is required if address is not provided.");
      return true; // Errors found
    }
    return false; // No errors
  };

  // Validates the equipment
  const hasErrors = (): boolean => {
    resetValidationErrors();

    let hasErrors = false;

    if (validateLocation()) {
      hasErrors = true;
    }

    if (!officerSet) {
      setOfficerSetErrorMsg("Required");
      hasErrors = true;
    }

    if (!type) {
      setEquipmentTypeErrorMsg("Equipment type is required.");
      hasErrors = true;
    }

    if (!dateSet) {
      setDateSetErrorMsg("Required");
      hasErrors = true;
    }

    if (coordinateErrorsInd) {
      hasErrors = true;
    }

    if (officerRemoved && !dateRemoved) {
      setDateRemovedErrorMsg("Required if Removed By is set");
      hasErrors = true;
    }

    if (!officerRemoved && dateRemoved) {
      setOfficerRemovedErrorMsg("Required if Removed Date is set");
      hasErrors = true;
    }

    if (dateRemoved && trapEquipment.includes(type?.value ?? "") && !["Y", "N"].includes(wasAnimalCaptured ?? "U")) {
      setWasAnimalCapturedErrorMsg("Required");
      hasErrors = true;
    }

    return hasErrors;
  };

  const handleSaveEquipment = () => {
    if (hasErrors()) {
      handleFormErrors();
      return;
    }

    let actions = [
      {
        actionGuid: actionSetGuid,
        actor: officerSet?.value,
        date: dateSet,
        activeIndicator: true,
        actionCode: CASE_ACTION_CODE.SETEQUIPMT,
      },
    ] as CaseActionDto[];

    // if this equipment has also been removed by an officer, set that action as well
    if (dateRemoved && officerRemoved?.value) {
      actions.push({
        actionGuid: actionRemovedGuid,
        actor: officerRemoved.value,
        date: dateRemoved,
        activeIndicator: true,
        actionCode: CASE_ACTION_CODE.REMEQUIPMT,
      } as CaseActionDto);
    }

    // Create an equipment object to persist
    if (type) {
      const equipmentDetails = {
        id: equipment?.id,
        typeCode: type.value,
        activeIndicator: true,
        address: address,
        xCoordinate: formatLatLongCoordinate(xCoordinate),
        yCoordinate: formatLatLongCoordinate(yCoordinate),
        actions: actions,
        wasAnimalCaptured: wasAnimalCaptured,
      } as EquipmentDetailsDto;
      dispatch(upsertEquipment(id, equipmentDetails));
      onSave();
    }
  };

  const handleFormErrors = () => {
    const errorMsg = equipment?.id ? "Errors editing equipment" : "Errors creating equipment";
    ToggleError(errorMsg);
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

  const cancelConfirmed = () => {
    resetData();
    onCancel();
  };

  const resetData = () => {
    setAddress("");
    setXCoordinate("");
    setYCoordinate("");
    setXCoordinateErrorMsg("");
    setYCoordinateErrorMsg("");
  };

  const wasAnimalCapturedOptions: Option[] = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
  ];

  const handleSetType = (type: any) => {
    setType(type);
    if (!trapEquipment.includes(type?.value ?? "")) {
      setWasAnimalCaptured("U");
    }
  };

  const syncCoordinates = (yCoordinate: string | undefined, xCoordinate: string | undefined) => {
    setXCoordinate(xCoordinate);
    setYCoordinate(yCoordinate);
  };

  const throwError = (hasError: boolean) => {
    setCoordinateErrorsInd(hasError);
  };

  return (
    <div>
      <ToastContainer />
      <Card border={showSectionErrors ? "danger" : "default"}>
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              <span>Save section before closing the complaint.</span>
            </div>
          )}
          <div
            className="comp-details-form"
            id="equipment-form"
          >
            {/* EQUIPMENT TYPE */}
            <div
              className="comp-details-form-row"
              id="equipment-type-div"
            >
              <label htmlFor="equipment-type-select">Equipment type</label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="equipment-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  placeholder="Select"
                  options={equipmentDropdownOptions}
                  enableValidation={true}
                  errorMessage={equipmentTypeErrorMsg}
                  onChange={(type: any) => handleSetType(type)}
                  defaultOption={type}
                  value={type}
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div
              id="equipment-address-div"
              className="comp-details-form-row"
            >
              <label htmlFor="equipment-address">Address</label>
              <div className="comp-details-input full-width">
                <input
                  type="text"
                  id="equipment-address"
                  className={equipmentAddressErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={120}
                  value={address}
                />
                <div className="error-message">{equipmentAddressErrorMsg}</div>
                {complaintData?.locationSummary && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-txt svg-icon mt-2"
                    id="equipment-copy-address-button"
                    onClick={() => (complaintData ? setAddress(complaintData.locationSummary) : "")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-copy"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                      />
                    </svg>
                    <span>Copy location from complaint details</span>
                  </Button>
                )}
                <div className="error-message">{xCoordinateErrorMsg || yCoordinateErrorMsg}</div>
              </div>
            </div>
            <CompCoordinateInput
              id="equipment-coordinates"
              utmZones={bcUtmZoneNumbers.map((zone: string) => {
                return { value: zone, label: zone } as Option;
              })}
              initXCoordinate={equipment?.xCoordinate}
              initYCoordinate={equipment?.yCoordinate}
              syncCoordinates={syncCoordinates}
              throwError={throwError}
              sourceXCoordinate={complaintData?.location?.coordinates[0].toString() ?? ""}
              sourceYCoordinate={complaintData?.location?.coordinates[1].toString() ?? ""}
              enableCopyCoordinates={true}
            />
            {/* SET BY */}
            <div
              className="comp-details-form-row"
              id="equipment-officer-set-div"
            >
              <label htmlFor="equipment-officer-set-select">Set/used by</label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="equipment-officer-set-select"
                  classNamePrefix="comp-select"
                  placeholder="Select"
                  options={assignableOfficers}
                  value={officerSet}
                  enableValidation={true}
                  errorMessage={officerSetErrorMsg}
                  onChange={(officer: any) => setOfficerSet(officer)}
                />
              </div>
            </div>

            {/* SET DATE */}
            <div
              className="comp-details-form-row"
              id="equipment-date-set-div"
            >
              <label htmlFor="equipment-day-set">Set/used date</label>
              <div className="comp-details-input">
                <ValidationDatePicker
                  id="equipment-day-set"
                  maxDate={dateRemoved ?? new Date()}
                  onChange={(date: Date | null) => date && setDateSet(date)}
                  errMsg={dateSetErrorMsg}
                  selectedDate={dateSet}
                  placeholder="Select Date"
                  className="comp-details-edit-calendar-input"
                  classNamePrefix="comp-select"
                />
              </div>
            </div>

            {/* REMOVED BY */}
            {officerSet && dateSet && type?.value !== "K9UNT" && type?.value !== "LLTHL" && (
              <>
                <div
                  className="comp-details-form-row"
                  id="equipment-officer-removed-div"
                >
                  <label htmlFor="equipment-officer-removed-select">Removed by</label>
                  <div className="comp-details-input full-width">
                    <CompSelect
                      id="equipment-officer-removed-select"
                      classNamePrefix="comp-select"
                      placeholder="Select"
                      options={assignableOfficers}
                      value={officerRemoved}
                      enableValidation={true}
                      errorMessage={officerRemovedErrorMsg}
                      onChange={(officer: any) => setOfficerRemoved(officer)}
                    />
                  </div>
                </div>
                <div
                  className="comp-details-form-row"
                  id="equipment-date-removed-div"
                >
                  <label htmlFor="equipment-date-removed">Removed date</label>
                  <div className="comp-details-input">
                    <ValidationDatePicker
                      id="equipment-date-removed"
                      maxDate={new Date()}
                      minDate={dateSet ?? null}
                      onChange={(date: Date) => setDateRemoved(date)}
                      errMsg={dateRemovedErrorMsg}
                      selectedDate={dateRemoved}
                      placeholder="Select Date"
                      className="comp-details-edit-calendar-input"
                      classNamePrefix="comp-select"
                    />
                  </div>
                </div>
              </>
            )}

            {/* CAPTURE INFORMATION */}
            {dateRemoved && trapEquipment.includes(type?.value ?? "") && (
              <div
                className="comp-details-form-row"
                id="reported-pair-id"
              >
                <label htmlFor="equipment-animal-captured-radiogroup-1">Was an animal captured?</label>
                <div className="comp-details-input full-width">
                  {
                    <CompRadioGroup
                      id="equipment-animal-captured-radiogroup"
                      options={wasAnimalCapturedOptions}
                      enableValidation={true}
                      errorMessage={wasAnimalCapturedErrorMsg}
                      itemClassName="comp-radio-btn"
                      groupClassName="comp-equipment-form-radio-group"
                      value={wasAnimalCaptured}
                      onChange={(option: any) => setWasAnimalCaptured(option.target.value)}
                      isDisabled={false}
                      radioGroupName="equipment-animal-captured-radiogroup"
                    />
                  }
                </div>
              </div>
            )}

            {/* FORM BUTTONS */}
            <div className="comp-details-form-buttons">
              <Button
                variant="outline-primary"
                id="equipment-cancel-button"
                title="Cancel Outcome"
                onClick={cancelButtonClick}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                id="equipment-save-button"
                title="Save Outcome"
                onClick={handleSaveEquipment}
              >
                Save
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
