import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../../store/reducers/officer";
import { selectEquipmentDropdown } from "../../../../../store/reducers/code-table";
import {
  getComplaintById,
  selectComplaint,
  selectComplaintCallerInformation,
} from "../../../../../store/reducers/complaints";
import { CompSelect } from "../../../../common/comp-select";
import { ToggleError } from "../../../../../common/toast";
import { bcBoundaries, getSelectedItem, getSelectedOfficer } from "../../../../../common/methods";

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

export interface EquipmentFormProps {
  equipment?: EquipmentDetailsDto;
  onSave: () => void;
  onCancel: () => void;
}

export const EquipmentForm: FC<EquipmentFormProps> = ({ equipment, onSave, onCancel }) => {
  const [type, setType] = useState<Option>();
  const [dateSet, setDateSet] = useState<Date>();
  const [dateRemoved, setDateRemoved] = useState<Date>();
  const [officerSet, setOfficerSet] = useState<Option>();
  const [officerRemoved, setOfficerRemoved] = useState<Option>();
  const [address, setAddress] = useState<string | undefined>("");
  const [xCoordinate, setXCoordinate] = useState<string | undefined>("");
  const [yCoordinate, setYCoordinate] = useState<string | undefined>("");
  const [equipmentTypeErrorMsg, setEquipmentTypeErrorMsg] = useState<string>("");
  const [officerSetErrorMsg, setOfficerSetErrorMsg] = useState<string>("");
  const [dateSetErrorMsg, setDateSetErrorMsg] = useState<string>("");
  const [xCoordinateErrorMsg, setXCoordinateErrorMsg] = useState<string>("");
  const [yCoordinateErrorMsg, setYCoordinateErrorMsg] = useState<string>("");
  const [coordinateErrorsInd, setCoordinateErrorsInd] = useState<boolean>(false);
  const [actionSetGuid, setActionSetGuid] = useState<string>();
  const [actionRemovedGuid, setActionRemovedGuid] = useState<string>();

  const dispatch = useAppDispatch();
  const { id = "", complaintType = "" } = useParams<{ id: string; complaintType: string }>();
  const complaintData = useAppSelector(selectComplaint);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency));
  const equipmentDropdownOptions = useAppSelector(selectEquipmentDropdown);

  const assignableOfficers: Option[] =
    officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
      : [];

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
  // Clear out existing validation errors
  const resetValidationErrors = () => {
    setEquipmentTypeErrorMsg("");
    setOfficerSetErrorMsg("");
    setDateSetErrorMsg("");
    setXCoordinateErrorMsg("");
    setYCoordinateErrorMsg("");
  };

  // Validates the assessment
  const hasErrors = (): boolean => {
    let hasErrors: boolean = false;
    resetValidationErrors();

    if (xCoordinate) {
      handleCoordinateChange(xCoordinate, Coordinates.Longitude);
    }

    if (yCoordinate) {
      handleCoordinateChange(yCoordinate, Coordinates.Latitude);
    }

    if (!officerSet) {
      setOfficerSetErrorMsg("Required");
      hasErrors = true;
    }

    if (!type) {
      setEquipmentTypeErrorMsg("Required");
      hasErrors = true;
    }

    if (!dateSet) {
      setDateSetErrorMsg("Required");
      hasErrors = true;
    }

    if (!xCoordinate) {
      setXCoordinateErrorMsg("Required");
      hasErrors = true;
    }

    if (!yCoordinate) {
      setYCoordinateErrorMsg("Required");
      hasErrors = true;
    }

    if (coordinateErrorsInd) {
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
        actionGuid: actionSetGuid ? actionSetGuid : null,
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
        equipmentGuid: equipment?.equipmentGuid,
        equipmentTypeCode: type.value,
        equipmentTypeActiveIndicator: true,
        address: address,
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate,
        actions: actions,
      } as EquipmentDetailsDto;

      dispatch(upsertEquipment(id, equipmentDetails));
      onSave();
    }
  };

  const handleFormErrors = () => {
    const errorMsg = equipment?.equipmentGuid ? "Errors editing equipment" : "Errors creating equipment";
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
    switch (property) {
      case "equipment": {
        return equipmentTypeCodes.find((item) => item.value === equipment?.equipmentTypeCode);
      }
    }
  };

  const hasCoordinates = complaintData?.location?.coordinates[0] !== 0 || complaintData?.location?.coordinates[1] !== 0;

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <ToastContainer />
      <div
        className="equipment-form-edit-container"
        style={{ marginTop: "10px" }}
      >
        <div className="comp-details-edit-column">
          <div className="equipment-form-label-input-pair">
            <label htmlFor="equipment-type-select">Equipment type</label>
            <CompSelect
              id="equipment-type-select"
              classNamePrefix="comp-select"
              className="comp-details-input"
              placeholder="Select"
              options={equipmentDropdownOptions}
              enableValidation={true}
              errorMessage={equipmentTypeErrorMsg}
              onChange={(type: any) => setType(type)}
              defaultOption={type}
              value={type}
            />
          </div>
        </div>
        <div className="comp-details-edit-column comp-details-right-column"></div>
      </div>
      <div className="equipment-form-edit-container">
        <div className="comp-details-edit-column">
          <div className="equipment-form-label-input-pair">
            <label htmlFor="equipment-address">Address</label>
            <div className="edit-input">
              <input
                type="text"
                id="equipment-address"
                className="comp-form-control"
                onChange={(e) => setAddress(e.target.value)}
                maxLength={120}
                value={address}
              />
            </div>
          </div>
          {complaintData?.locationSummary && (
            <button
              className="button-text copy-text"
              onClick={() => (complaintData ? setAddress(complaintData.locationSummary) : "")}
            >
              Copy location from complaint details
            </button>
          )}
        </div>
        <div className="comp-details-edit-column comp-details-right-column"></div>
      </div>
      <div className="equipment-form-edit-container">
        <div className="comp-details-edit-column">
          <div className="equipment-form-label-input-pair">
            <label htmlFor="equipment-x-coordinate">X Coordinate</label>
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
          {hasCoordinates && (
            <button
              className="button-text copy-text"
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
        <div className="comp-details-edit-column comp-details-right-column">
          <div className="equipment-form-label-input-pair">
            <label htmlFor="equipment-y-coordinate">Y Coordinate</label>
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
        </div>
      </div>
      <div className="equipment-form-edit-container">
        <div className="comp-details-edit-column">
          <div
            className="equipment-form-label-input-pair"
            id="reported-pair-id"
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
            id="reported-pair-id"
          >
            <label htmlFor="equipment-day-set">Set date</label>
            <ValidationDatePicker
              id="equipment-day-set"
              maxDate={dateRemoved ?? new Date()}
              onChange={(date: Date | null) => date && setDateSet(date)}
              errMsg={dateSetErrorMsg}
              selectedDate={dateSet}
              placeholder="Select Date"
              className="comp-details-edit-calendar-input" // Adjust class as needed
              classNamePrefix="comp-select" // Adjust class as needed
            />
          </div>
        </div>
      </div>
      {officerSet && dateSet && (
        <div className="equipment-form-edit-container">
          <div className="comp-details-edit-column">
            <div
              className="equipment-form-label-input-pair"
              id="reported-pair-id"
            >
              <label htmlFor="equipment-officer-removed-select">Removed by</label>
              <CompSelect
                id="equipment-officer-removed-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                placeholder="Select"
                options={assignableOfficers}
                value={officerRemoved}
                enableValidation={false}
                onChange={(officer: any) => setOfficerRemoved(officer)}
              />
            </div>
          </div>
          <div className="comp-details-edit-column comp-details-right-column">
            <div
              className="equipment-form-label-input-pair"
              id="reported-pair-id"
            >
              <label htmlFor="equipment-date-removed">Removed date</label>
              <DatePicker
                id="equipment-date-removed"
                showIcon
                maxDate={new Date()}
                minDate={dateSet ?? null}
                onChange={(date: Date) => setDateRemoved(date)}
                selected={dateRemoved}
                dateFormat="yyyy-MM-dd"
                wrapperClassName="comp-details-edit-calendar-input"
              />
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
  );
};
