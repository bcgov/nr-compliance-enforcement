import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import {
  selectDischargeDropdown,
  selectNonComplianceDropdown,
  selectRationaleDropdown,
  selectSectorDropdown,
  selectScheduleDropdown,
  selectDecisionTypeDropdown,
} from "../../../../../../store/reducers/code-table-selectors";
import { selectAgencyDropdown } from "../../../../../../store/reducers/code-table";
import { Decision } from "../../../../../../types/app/case-files/ceeb/decision/decision";
import { Button } from "react-bootstrap";
import { ValidationDatePicker } from "../../../../../../common/validation-date-picker";
import { CompSelect } from "../../../../../common/comp-select";
import Option from "../../../../../../types/app/option";
import { CASE_ACTION_CODE } from "../../../../../../constants/case_actions";
import { CompInput } from "../../../../../common/comp-input";
import { openModal } from "../../../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../../../types/modal/modal-types";
import { getCaseFile, upsertDecisionOutcome } from "../../../../../../store/reducers/case-thunks";
import { assignComplaintToOfficer, selectOfficersByAgencyDropdown } from "../../../../../../store/reducers/officer";
import { selectCaseId } from "../../../../../../store/reducers/case-selectors";
import { UUID } from "crypto";
import { getComplaintById, selectComplaintCallerInformation } from "../../../../../../store/reducers/complaints";
import { ToggleError } from "../../../../../../common/toast";

import COMPLAINT_TYPES from "../../../../../../types/app/complaint-types";

type props = {
  officerAssigned: string | null;
  leadIdentifier: string;
  toggleEdit: Function;
  //-- properties
  id?: string;
  schedule: string;
  sector: string;
  discharge: string;
  nonCompliance: string;
  rationale: string;
  inspectionNumber?: string;
  leadAgency?: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
};

export const DecisionForm: FC<props> = ({
  officerAssigned,
  leadIdentifier,
  toggleEdit,
  //--
  id,
  schedule,
  sector,
  discharge,
  nonCompliance,
  rationale,
  inspectionNumber,
  leadAgency,
  assignedTo,
  actionTaken,
  actionTakenDate,
}) => {
  const dispatch = useAppDispatch();

  //-- select data from redux
  const caseId = useAppSelector(selectCaseId) as UUID;

  //-- drop-downs
  const dischargesOptions = useAppSelector(selectDischargeDropdown);
  const nonComplianceOptions = useAppSelector(selectNonComplianceDropdown);
  const rationaleOptions = useAppSelector(selectRationaleDropdown);
  const sectorsOptions = useAppSelector(selectSectorDropdown);
  const schedulesOptions = useAppSelector(selectScheduleDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);
  const officerOptions = useAppSelector(selectOfficersByAgencyDropdown(ownedByAgencyCode?.agency));

  //-- error messgaes
  const [scheduleErrorMessage, setScheduleErrorMessage] = useState("");
  const [sectorErrorMessage, setSectorErrorMessage] = useState("");
  const [dischargeErrorMessage, setDischargeErrorMessage] = useState("");
  const [rationaleErrorMessage] = useState("");
  const [nonComplianceErrorMessage] = useState("");
  const [dateActionTakenErrorMessage, setDateActionTakenErrorMessage] = useState("");
  const [leadAgencyErrorMessage, setLeadAgencyErrorMessage] = useState("");
  const [inspectionNumberErrorMessage, setInspectionNumberErrorMessage] = useState("");
  const [assignedToErrorMessage, setAssignedToErrorMessage] = useState("");
  const [actionTakenErrorMessage, setActionTakenErrorMessage] = useState("");

  //-- component data
  // eslint-disable-line no-console, max-len
  const [data, applyData] = useState<Decision>({
    schedule,
    sector,
    discharge,
    nonCompliance,
    rationale,
    inspectionNumber,
    leadAgency,
    assignedTo: officerAssigned ?? "",
    actionTaken,
    actionTakenDate,
  });

  useEffect(() => {
    if (officerAssigned) {
      applyData({ ...data, assignedTo: officerAssigned });
    }
  }, [officerAssigned]);

  //-- update the decision state by property
  const updateModel = (property: string, value: string | Date | undefined) => {
    const model = { ...data, [property]: value };
    applyData(model);
  };

  const getValue = (property: string): Option | undefined | null => {
    let result: Option | undefined;

    switch (property) {
      case "schedule": {
        const { schedule } = data;
        result = schedulesOptions.find((item) => item.value === schedule);
        break;
      }

      case "sector": {
        const { sector } = data;
        result = sectorsOptions.find((item) => item.value === sector);
        break;
      }

      case "discharge": {
        const { discharge } = data;
        result = dischargesOptions.find((item) => item.value === discharge);
        break;
      }

      case "nonCompliance": {
        const { nonCompliance } = data;
        result = nonComplianceOptions.find((item) => item.value === nonCompliance);
        break;
      }

      case "rationale": {
        const { rationale } = data;
        result = rationaleOptions.find((item) => item.value === rationale);
        break;
      }

      case "leadAgency": {
        const { leadAgency } = data;
        result = agencyOptions.find((item) => item.value === leadAgency);
        break;
      }

      case "actionTaken": {
        const { actionTaken } = data;
        result = decisionTypeOptions.find((item) => item.value === actionTaken);
        break;
      }

      case "assignedTo": {
        const { assignedTo } = data;
        result = officerOptions.find((item) => item.value === assignedTo);
        break;
      }
    }

    return !result ? null : result;
  };

  //-- when setting the assignment this should also update the assignment
  //-- of the complaint to the officer being selected in the decision
  const updateAssignment = (value?: string) => {
    //-- need to get the officer_guid instead of the person
    updateModel("assignedTo", value);
  };

  const handleDateChange = (date?: Date) => {
    updateModel("actionTakenDate", date);
  };

  const handleActionTakenChange = (value: string) => {
    //-- if the action taken changes make sure to clear the
    //-- lead agency and inspection number
    const update = { ...data, actionTaken: value, leadAgency: undefined, inspectionNumber: undefined };
    applyData(update);
  };

  const handleCancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            //-- reset the form to its original state
            applyData({
              schedule,
              sector,
              discharge,
              nonCompliance,
              rationale,
              inspectionNumber,
              leadAgency,
              assignedTo,
              actionTaken,
              actionTakenDate,
            });

            resetErrorMessages();

            if (id !== undefined) {
              toggleEdit(false);
            }
          },
        },
      }),
    );
  };

  const resetErrorMessages = () => {
    setScheduleErrorMessage("");
    setSectorErrorMessage("");
    setDischargeErrorMessage("");
    setActionTakenErrorMessage("");
    setAssignedToErrorMessage("");
    setDateActionTakenErrorMessage("");
    setLeadAgencyErrorMessage("");
    setInspectionNumberErrorMessage("");
  };

  const handleSaveButtonClick = () => {
    const identifier = id !== undefined ? caseId : leadIdentifier;
    resetErrorMessages();

    if (isValid()) {
      dispatch(upsertDecisionOutcome(identifier, data)).then(async (response) => {
        if (response === "success") {
          //-- update the assignment of the complaint to the selected officer
          const { assignedTo } = data;
          if (assignedTo) {
            const result = await dispatch(assignComplaintToOfficer(leadIdentifier, assignedTo));

            if (result) {
              //-- update the complaint
              dispatch(getComplaintById(leadIdentifier, COMPLAINT_TYPES.ERS));
            } else {
              ToggleError("Error, unable to to assign officer to complaint");
            }
          }

          dispatch(getCaseFile(leadIdentifier));

          if (id !== undefined) {
            toggleEdit(false);
          }
        }
      });
    }
  };

  const isValid = (): boolean => {
    let _isValid = true;

    if (!data.schedule) {
      setScheduleErrorMessage("Required");
    }

    if (!data.sector) {
      setSectorErrorMessage("Required");
    }

    if (!data.discharge) {
      setDischargeErrorMessage("Required");
    }

    if (!data.schedule || !data.sector || !data.discharge) {
      _isValid = false;
    }

    if (data.actionTaken === CASE_ACTION_CODE.FWDLEADAGN && !data.leadAgency) {
      setLeadAgencyErrorMessage("Required");
      _isValid = false;
    }

    if (data.actionTaken === CASE_ACTION_CODE.RESPREC && !data.inspectionNumber) {
      setInspectionNumberErrorMessage("Required");
      _isValid = false;
    }

    if (data.actionTaken && (!data.actionTakenDate || !data.assignedTo)) {
      if (!data.actionTakenDate) {
        setDateActionTakenErrorMessage("Date required when action taken selected");
        _isValid = false;
      }
      if (!data.assignedTo) {
        setAssignedToErrorMessage("Assigned to required when action taken selected");
        _isValid = false;
      }
    }

    if (data.assignedTo && (!data.actionTaken || !data.actionTakenDate)) {
      if (!data.actionTakenDate) {
        setDateActionTakenErrorMessage("Date required when action taken selected");
        _isValid = false;
      }

      if (!data.actionTaken) {
        setActionTakenErrorMessage("Action taken required when assigned to is selected");
        _isValid = false;
      }
    }

    return _isValid;
  };

  return (
    <>
      <div className="comp-details-form">
        <div
          className="comp-details-form-row"
          id="decision-schedule-sector-type"
        >
          <label htmlFor="outcome-decision-schedule-secto">WDR schedule/IPM sector type</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-schedule-sector"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={schedulesOptions}
              enableValidation={true}
              errorMessage={scheduleErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                updateModel("schedule", evt?.value);
              }}
              value={getValue("schedule")}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="decision-sector-category"
        >
          <label htmlFor="outcome-decision-sector-category">Sector/Category</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-sector-category"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={sectorsOptions}
              enableValidation={true}
              errorMessage={sectorErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                updateModel("sector", evt?.value);
              }}
              value={getValue("sector")}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="decision-discharge-type"
        >
          <label htmlFor="outcome-decision-discharge">Discharge type</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-discharge"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={dischargesOptions}
              enableValidation={true}
              errorMessage={dischargeErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                updateModel("discharge", evt?.value);
              }}
              value={getValue("discharge")}
            />
          </div>
        </div>
        <hr></hr>
        <div
          className="comp-details-form-row"
          id="decision-action-taken"
        >
          <label htmlFor="outcome-decision-action-taken">Action taken</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-action-taken"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={decisionTypeOptions}
              enableValidation={true}
              errorMessage={actionTakenErrorMessage}
              placeholder="Select"
              onChange={(evt) => {
                const action = evt?.value ? evt?.value : "";
                handleActionTakenChange(action);
              }}
              value={getValue("actionTaken")}
            />
          </div>
        </div>
        {data.actionTaken === CASE_ACTION_CODE.FWDLEADAGN && (
          <div
            className="comp-details-form-row"
            id="decision-lead-agency"
          >
            <label htmlFor="outcome-decision-lead-agency">Lead agency</label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="outcome-decision-lead-agency"
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={agencyOptions}
                enableValidation={true}
                errorMessage={leadAgencyErrorMessage}
                placeholder="Select"
                onChange={(evt) => {
                  updateModel("leadAgency", evt?.value);
                }}
                value={getValue("leadAgency")}
              />
            </div>
          </div>
        )}
        {data.actionTaken === CASE_ACTION_CODE.RESPREC && (
          <div
            className="comp-details-form-row"
            id="decision-inspection-number"
          >
            <label htmlFor="outcome-decision-inspection-number">NRIS Inspection number</label>
            <div className="comp-details-input full-width">
              <CompInput
                id="outcome-decision-inspection-number"
                divid="outcome-decision-inspection-number-value"
                type="input"
                inputClass="comp-form-control"
                value={data?.inspectionNumber}
                error={inspectionNumberErrorMessage}
                maxLength={5}
                onChange={(evt: any) => {
                  const {
                    target: { value },
                  } = evt;

                  updateModel("inspectionNumber", value);
                }}
              />
            </div>
          </div>
        )}
        <div
          className="comp-details-form-row"
          id="decision-non-compliance-decision-matrix"
        >
          <label htmlFor="outcome-decision-non-compliance">Non-compliance decision matrix</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-non-compliance"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={nonComplianceOptions}
              enableValidation={true}
              errorMessage={nonComplianceErrorMessage}
              placeholder="Select"
              onChange={(evt) => {
                updateModel("nonCompliance", evt?.value);
              }}
              value={getValue("nonCompliance")}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="decision-rationale"
        >
          <label htmlFor="outcome-decision-rationale">Rationale</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-rationale"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={rationaleOptions}
              enableValidation={true}
              errorMessage={rationaleErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                updateModel("rationale", evt?.value);
              }}
              value={getValue("rationale")}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="decision-assigned-to"
        >
          <label htmlFor="outcome-decision-assigned-to">Assigned to</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-assigned-to"
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={officerOptions}
              enableValidation={true}
              errorMessage={assignedToErrorMessage}
              placeholder="Select"
              onChange={(evt) => {
                updateAssignment(evt?.value);
              }}
              value={getValue("assignedTo")}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="complaint-outcome-date-div"
        >
          <label htmlFor="outcome-decision-outcome-date">Date</label>
          <div className="comp-details-input">
            <ValidationDatePicker
              id="outcome-decision-outcome-date"
              selectedDate={data?.actionTakenDate}
              onChange={handleDateChange}
              placeholder="Select date"
              className="comp-details-edit-calendar-input" // Adjust class as needed
              classNamePrefix="comp-select" // Adjust class as needed
              errMsg={dateActionTakenErrorMessage} // Pass error message if any
              maxDate={new Date()}
            />
          </div>
        </div>
      </div>
      <div className="comp-details-form-buttons">
        <Button
          variant="outline-primary"
          id="outcome-decision-cancel-button"
          title="Cancel Decision"
          onClick={handleCancelButtonClick}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="outcome-decision-save-button"
          title="Save Decision"
          onClick={() => handleSaveButtonClick()}
        >
          Save
        </Button>
      </div>
    </>
  );
};
