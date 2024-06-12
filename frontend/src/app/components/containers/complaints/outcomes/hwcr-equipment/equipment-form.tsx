import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../../store/reducers/officer";
import { selectEquipmentDropdown, selectTrapEquipment } from "../../../../../store/reducers/code-table";
import {
  getComplaintById,
  selectComplaint,
  selectComplaintCallerInformation,
} from "../../../../../store/reducers/complaints";
import { CompSelect } from "../../../../common/comp-select";
import { ToggleError } from "../../../../../common/toast";
import { bcBoundaries, getSelectedItem } from "../../../../../common/methods";

import Option from "../../../../../types/app/option";
import { Officer } from "../../../../../types/person/person";

import "react-toastify/dist/ReactToastify.css";
import { Coordinates } from "../../../../../types/app/coordinate-type";
import { ValidationDatePicker } from "../../../../../common/validation-date-picker";
import { openModal } from "../../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../../types/modal/modal-types";
import { EquipmentDetailsDto } from "../../../../../types/app/case-files/equipment-details";
import { CaseActionDto } from "../../../../../types/app/case-files/case-action";
import { CASE_ACTION_CODE } from "../../../../../constants/case_actions";
import { upsertEquipment } from "../../../../../store/reducers/case-thunks";
import { CompRadioGroup } from "../../../../common/comp-radiogroup";
import { BsExclamationCircleFill } from "react-icons/bs";

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
  const [officerSet, setOfficerSet] = useState<Option>();
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
  const equipmentDropdownOptions = useAppSelector(selectEquipmentDropdown);
  const trapEquipment = useAppSelector(selectTrapEquipment);

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  const assignableOfficers: Option[] =
    officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
      : [];

  useEffect(() => {
    if (assignedOfficer) {
      const setOfficer = getSelectedItem(assignedOfficer, assignableOfficers);
      setOfficerSet(setOfficer);
    }
  }, [complaintData]);

  useEffect(() => {
    if (id && (!complaintData || complaintData.id !== id)) {
      dispatch(getComplaintById(id, complaintType));
    }
  }, [id, complaintType, complaintData, dispatch]);

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
  }, [equipment]);

  const handleCoordinateChange = (input: string, type: Coordinates) => {
    if (type === Coordinates.Latitude) {
      setYCoordinate(input);
      if (xCoordinate) {
        handleGeoPointChange(input, xCoordinate);
      }
    } else {
      setXCoordinate(input);
      if (yCoordinate) {
        handleGeoPointChange(yCoordinate, input);
      }
    }
  };

  const handleGeoPointChange = async (latitude: string, longitude: string) => {
    setYCoordinateErrorMsg("");
    setXCoordinateErrorMsg("");
    const regex = /^[a-zA-Z]+$/;
    let hasErrors = false;
    if (regex.exec(latitude)) {
      setYCoordinateErrorMsg("Value must be a number");
      hasErrors = true;
    }
    if (regex.exec(longitude)) {
      setXCoordinateErrorMsg("Value must be a number");
      hasErrors = true;
    }
    if (latitude && !Number.isNaN(latitude)) {
      const item = parseFloat(latitude);
      if (item > bcBoundaries.maxLatitude || item < bcBoundaries.minLatitude) {
        setYCoordinateErrorMsg(
          `Value must be between ${bcBoundaries.maxLatitude} and ${bcBoundaries.minLatitude} degrees`,
        );
        hasErrors = true;
      }
    }

    if (longitude && !Number.isNaN(longitude)) {
      const item = parseFloat(longitude);
      if (item > bcBoundaries.maxLongitude || item < bcBoundaries.minLongitude) {
        setXCoordinateErrorMsg(
          `Value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`,
        );
        hasErrors = true;
      }
    }
    setCoordinateErrorsInd(hasErrors);
  };

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
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate,
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
          title: "Cancel Changes?",
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

  // needed to turn equipment type codes into descriptions
  const equipmentTypeCodes = useAppSelector(selectEquipmentDropdown);

  // for turning codes into values
  const getValue = (property: string): Option | undefined => {
    return equipmentTypeCodes.find((item) => item.value === equipment?.typeCode);
  };

  const hasCoordinates = complaintData?.location?.coordinates[0] !== 0 || complaintData?.location?.coordinates[1] !== 0;

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

  return (
    <>
      {showSectionErrors && (
        <div className="section-error-message">
          <BsExclamationCircleFill />
          <span>Save section before closing the complaint.</span>
        </div>
      )}
      <div
        className={`comp-outcome-report-complaint-assessment ${showSectionErrors && "section-error"}`}
        id="equipment-form"
      >
        <ToastContainer />
        <div
          className="equipment-form-edit-container"
          style={{ marginTop: "10px" }}
        >
          <div className="comp-details-edit-column">
            <div
              className="equipment-form-label-input-pair"
              id="equipment-type-div"
            >
              <label htmlFor="equipment-type-select">Equipment type</label>
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
          <div className="comp-details-edit-column comp-details-right-column"></div>
        </div>
        <div className="equipment-form-edit-container">
          <div
            className="comp-details-edit-column"
            id="equipment-address-container"
          >
            <div className="equipment-form-label-input-pair">
              <label htmlFor="equipment-address">Address</label>
              <div className="edit-input">
                <input
                  type="text"
                  id="equipment-address"
                  className={equipmentAddressErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={120}
                  value={address}
                />
              </div>
            </div>
            <div className="equipment-form-error-msg">{equipmentAddressErrorMsg}</div>
            {complaintData?.locationSummary && (
              <button
                className="button-text copy-text"
                id="equipment-copy-address-button"
                onClick={() => (complaintData ? setAddress(complaintData.locationSummary) : "")}
              >
                Copy location from complaint details
              </button>
            )}
          </div>
          <div className="comp-details-edit-column comp-details-right-column"></div>
        </div>
        <div className="equipment-form-edit-container">
          <div
            className="comp-details-edit-column"
            id="equipment-y-coordinate-container"
          >
            <div className="equipment-form-label-input-pair">
              <label htmlFor="equipment-y-coordinate">Latitude</label>
              <div className="edit-input">
                <input
                  type="text"
                  id="equipment-y-coordinate"
                  className={yCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                  onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Latitude)}
                  value={yCoordinate ?? ""}
                  maxLength={120}
                />
              </div>
            </div>
            <div className="equipment-form-error-msg">{yCoordinateErrorMsg}</div>
            {hasCoordinates && (
              <button
                className="button-text copy-text"
                id="equipment-copy-coordinates-button"
                onClick={() => {
                  const xCoordinate = complaintData?.location?.coordinates[0].toString() ?? "";
                  const yCoordinate = complaintData?.location?.coordinates[1].toString() ?? "";
                  setXCoordinate(xCoordinate);
                  setYCoordinate(yCoordinate);
                  handleGeoPointChange(yCoordinate, xCoordinate);
                }}
              >
                Copy location from complaint details
              </button>
            )}
          </div>
          <div
            className="comp-details-edit-column comp-details-right-column"
            id="equipment-x-coordinate-container"
          >
            <div className="equipment-form-label-input-pair">
              <label htmlFor="equipment-x-coordinate">Longitude</label>
              <div className="edit-input">
                <input
                  type="text"
                  id="equipment-x-coordinate"
                  className={xCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                  onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Longitude)}
                  value={xCoordinate ?? ""}
                  maxLength={120}
                />
              </div>
            </div>
            <div className="equipment-form-error-msg">{xCoordinateErrorMsg}</div>
          </div>
        </div>
        <div className="equipment-form-edit-container">
          <div className="comp-details-edit-column">
            <div
              className="equipment-form-label-input-pair"
              id="equipment-officer-set-div"
            >
              <label htmlFor="equipment-officer-set-select">Set by</label>
              <CompSelect
                id="equipment-officer-set-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                placeholder="Select"
                options={assignableOfficers}
                value={officerSet}
                enableValidation={true}
                errorMessage={officerSetErrorMsg}
                onChange={(officer: any) => setOfficerSet(officer)}
              />
            </div>
          </div>
          <div className="comp-details-edit-column comp-details-right-column">
            <div
              className="equipment-form-label-input-pair"
              id="equipment-date-set-div"
            >
              <label htmlFor="equipment-day-set">Set date</label>
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
        </div>
        {officerSet && dateSet && (
          <div className="equipment-form-edit-container">
            <div className="comp-details-edit-column">
              <div
                className="equipment-form-label-input-pair"
                id="equipment-officer-removed-div"
              >
                <label htmlFor="equipment-officer-removed-select">Removed by</label>
                <CompSelect
                  id="equipment-officer-removed-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  placeholder="Select"
                  options={assignableOfficers}
                  value={officerRemoved}
                  enableValidation={true}
                  errorMessage={officerRemovedErrorMsg}
                  onChange={(officer: any) => setOfficerRemoved(officer)}
                />
              </div>
            </div>
            <div className="comp-details-edit-column comp-details-right-column">
              <div
                className="equipment-form-label-input-pair"
                id="equipment-date-removed-div"
              >
                <label htmlFor="equipment-date-removed">Removed date</label>
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
          </div>
        )}
        {dateRemoved && trapEquipment.includes(type?.value ?? "") && (
          <div className="equipment-form-edit-container">
            <div className="comp-details-edit-column">
              <div
                className="equipment-form-label-input-pair"
                id="reported-pair-id"
              >
                <label htmlFor="equipment-animal-captured-radiogroup-1">Was an animal captured?</label>
                {
                  <CompRadioGroup
                    id="equipment-animal-captured-radiogroup"
                    options={wasAnimalCapturedOptions}
                    enableValidation={true}
                    errorMessage={wasAnimalCapturedErrorMsg}
                    itemClassName="equipment-form-radiobutton"
                    groupClassName="equipment-form-radiogroup"
                    value={wasAnimalCaptured}
                    onChange={(option: any) => setWasAnimalCaptured(option.target.value)}
                    isDisabled={false}
                    radioGroupName="equipment-animal-captured-radiogroup"
                  />
                }
              </div>
            </div>
          </div>
        )}
        <div className="comp-outcome-report-actions">
          <Button
            id="equipment-cancel-button"
            title="Cancel Outcome"
            className="comp-outcome-cancel"
            onClick={cancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            id="equipment-save-button"
            title="Save Outcome"
            className="comp-outcome-save"
            onClick={handleSaveEquipment}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
