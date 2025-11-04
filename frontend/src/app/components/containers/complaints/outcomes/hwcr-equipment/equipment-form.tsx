import { FC, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  selectOfficerAndCollaboratorListByAgency,
  selectOfficersAndCollaboratorsByAgency,
} from "@store/reducers/officer";
import {
  selectActiveEquipmentDropdown,
  selectTrapEquipment,
  selectHasQuantityEquipment,
} from "@store/reducers/code-table";
import { selectComplaint, selectComplaintCallerInformation } from "@store/reducers/complaints";
import { CompSelect } from "@components/common/comp-select";
import { ToggleError } from "@common/toast";
import { bcUtmZoneNumbers, getSelectedItem, formatLatLongCoordinate } from "@common/methods";

import Option from "@apptypes/app/option";

import { ValidationDatePicker } from "@common/validation-date-picker";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { CaseActionDto } from "@/app/types/app/complaint-outcomes/case-action";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { upsertEquipment } from "@/app/store/reducers/complaint-outcome-thunks";
import { CompRadioGroup } from "@components/common/comp-radiogroup";
import { BsExclamationCircleFill } from "react-icons/bs";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";
import { CompInput } from "@/app/components/common/comp-input";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";

export interface EquipmentFormProps {
  equipment?: EquipmentDetailsDto;
  assignedOfficer?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export const EquipmentForm: FC<EquipmentFormProps> = ({ equipment, assignedOfficer, onSave, onCancel }) => {
  const [type, setType] = useState<Option>();
  const [quantity, setQuantity] = useState<number>();
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
  const [quantityErrorMsg, setQuantityErrorMsg] = useState<string>("");
  const [enableCopyCoordinates, setEnableCopyCoordinates] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { id = "" } = useParams<{ id: string }>();
  const complaintData = useAppSelector(selectComplaint);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officersInAgencyList = useSelector(
    (state: RootState) => selectOfficersAndCollaboratorsByAgency(state, ownedByAgencyCode?.agency), // Pass agency here
  );
  const equipmentDropdownOptions = useAppSelector(selectActiveEquipmentDropdown);
  const trapEquipment = useAppSelector(selectTrapEquipment);
  const hasQuantityEquipment = useAppSelector(selectHasQuantityEquipment);
  const assignableOfficers = useAppSelector(selectOfficerAndCollaboratorListByAgency);

  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  // Clear state on unmount
  useEffect(() => {
    return () => {
      setXCoordinate("");
      setYCoordinate("");
      setEnableCopyCoordinates(false);
    };
  }, []);

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
        .filter((appUser: any) => {
          const appUserGuid = appUser.app_user_guid ?? appUser.appUserGuid;
          return appUserGuid === assignedOfficer;
        })
        .map((item: any) => {
          const firstName = item.first_name ?? item.firstName;
          const lastName = item.last_name ?? item.lastName;
          const authUserGuid = item.auth_user_guid ?? item.authUserGuid;

          return {
            label: `${lastName}, ${firstName}`,
            value: authUserGuid,
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
    setQuantity(equipment?.quantity);
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
    setQuantityErrorMsg("");
  };

  // Helper function to check if coordinates or address are provided
  const validateLocation = (): boolean => {
    const isAddressEmpty = !address;
    const isXCoordinateEmpty = !xCoordinate;
    const isYCoordinateEmpty = !yCoordinate;

    if (isAddressEmpty && (isXCoordinateEmpty || isYCoordinateEmpty)) {
      setEquipmentAddressErrorMsg("Location/address is required if coordinates are not provided.");
      if (isXCoordinateEmpty) setXCoordinateErrorMsg("Longitude is required if location/address is not provided.");
      if (isYCoordinateEmpty) setYCoordinateErrorMsg("Latitude is required if location/address is not provided.");
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

    if (hasQuantityEquipment.includes(type?.value ?? "") && (!quantity || quantity < 1)) {
      setQuantityErrorMsg("Required");
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
    if (officerRemoved === null) {
      // user wants to clear equipment removal info
      actions.push({
        activeIndicator: false,
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
        quantity: quantity ? Number(quantity) : undefined,
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
    if (hasQuantityEquipment.includes(type?.value ?? "")) {
      setQuantity(1);
    } else {
      setQuantity(undefined);
    }
  };

  const handleSetQuantity = (input: any) => {
    setQuantity(input.replace(/\D/g, ""));
  };

  const syncCoordinates = (yCoordinate: string | undefined, xCoordinate: string | undefined) => {
    setXCoordinate(xCoordinate);
    setYCoordinate(yCoordinate);
  };

  const throwError = (hasError: boolean) => {
    setCoordinateErrorsInd(hasError);
  };

  const handleCopyLocation = () => {
    // Copy address if exists
    if (complaintData) {
      setAddress(complaintData.locationSummary);
    } else setAddress("");

    // Copy coordinates if exists
    if (complaintData?.location?.coordinates[0] !== 0 && complaintData?.location?.coordinates[1] !== 0) {
      setEnableCopyCoordinates(true);
    }
  };

  useEffect(() => {
    // Reset enableCopyCoordinates if xCoordinate, yCoordinate, and address are set
    if (enableCopyCoordinates && xCoordinate && yCoordinate && address) {
      setEnableCopyCoordinates(false);
    }
  }, [xCoordinate, yCoordinate, address, enableCopyCoordinates]);

  const showCopyAllLocationInfo =
    complaintData?.locationSummary ||
    (complaintData?.location?.coordinates[0] !== 0 && complaintData?.location?.coordinates[1] !== 0);

  return (
    <div>
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
              <label htmlFor="equipment-type-select">
                Equipment type<span className="required-ind">*</span>
              </label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="equipment-type-select"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  placeholder="Select"
                  options={equipmentDropdownOptions}
                  enableValidation={true}
                  errorMessage={equipmentTypeErrorMsg}
                  onChange={(type: any) => handleSetType(type)}
                  defaultOption={type}
                  value={type}
                  isClearable={true}
                />
              </div>
            </div>

            {/* QUANTITY */}
            {hasQuantityEquipment.includes(type?.value ?? "") && (
              <div
                className="comp-details-form-row"
                id="equipment-quantity-div"
              >
                <label htmlFor="equipment-quantity">
                  Quantity<span className="required-ind">*</span>
                </label>
                <div className="comp-details-input">
                  <CompInput
                    type="input"
                    inputClass="comp-form-control"
                    id="equipment-quantity"
                    divid="equipment-quantity-div"
                    maxLength={3}
                    value={quantity}
                    onChange={(e: { target: { value: any } }) => handleSetQuantity(e.target.value)}
                    error={quantityErrorMsg}
                  />
                </div>
              </div>
            )}

            {/* ADDRESS */}
            <div
              id="equipment-address-coordinates-div"
              className="comp-details-form-row"
            >
              <label htmlFor="equipment-address">
                Location info (choose one)<span className="required-ind">*</span>
              </label>
              <div className="comp-details-input full-width">
                {showCopyAllLocationInfo && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-txt svg-icon mt-2 validation-group-input"
                    id="equipment-copy-address-button"
                    onClick={handleCopyLocation}
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
                    <span>Copy all location information from complaint details</span>
                  </Button>
                )}
              </div>
            </div>
            <div
              id="equipment-address-div"
              className="comp-details-form-row"
            >
              <label
                className="validation-group-label"
                htmlFor="equipment-address"
              >
                Location/address
              </label>
              <div className="comp-details-input full-width">
                <input
                  type="text"
                  id="equipment-address"
                  className={
                    equipmentAddressErrorMsg
                      ? "comp-form-control error-border validation-group-input"
                      : "comp-form-control validation-group-input"
                  }
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={120}
                  value={address}
                />
                <div className="error-message">{equipmentAddressErrorMsg}</div>
                <div className="error-message">{xCoordinateErrorMsg || yCoordinateErrorMsg}</div>
              </div>
            </div>
            <CompCoordinateInput
              id="equipment-coordinates"
              mode="equipment"
              utmZones={bcUtmZoneNumbers.map((zone: string) => {
                return { value: zone, label: zone } as Option;
              })}
              initXCoordinate={equipment?.xCoordinate}
              initYCoordinate={equipment?.yCoordinate}
              syncCoordinates={syncCoordinates}
              throwError={throwError}
              sourceXCoordinate={complaintData?.location?.coordinates[0].toString() ?? ""}
              sourceYCoordinate={complaintData?.location?.coordinates[1].toString() ?? ""}
              enableCopyCoordinates={enableCopyCoordinates}
              validationRequired={true}
              equipmentType={type?.label}
            />
            {/* SET BY */}
            <div
              className="comp-details-form-row"
              id="equipment-officer-set-div"
            >
              <label htmlFor="equipment-officer-set-select">
                Set/used by<span className="required-ind">*</span>
              </label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="equipment-officer-set-select"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  placeholder="Select"
                  options={assignableOfficers}
                  value={officerSet}
                  enableValidation={true}
                  errorMessage={officerSetErrorMsg}
                  onChange={(officer: any) => setOfficerSet(officer)}
                  isClearable={true}
                />
              </div>
            </div>

            {/* SET DATE */}
            <div
              className="comp-details-form-row"
              id="equipment-date-set-div"
            >
              <label htmlFor="equipment-day-set">
                Set/used date<span className="required-ind">*</span>
              </label>
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
                      showInactive={false}
                      classNamePrefix="comp-select"
                      placeholder="Select"
                      options={assignableOfficers}
                      value={officerRemoved}
                      enableValidation={true}
                      errorMessage={officerRemovedErrorMsg}
                      onChange={(officer: any) => setOfficerRemoved(officer)}
                      isClearable={true}
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
                <label htmlFor="equipment-animal-captured-radiogroup-1">
                  Was an animal captured?<span className="required-ind">*</span>
                </label>
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
