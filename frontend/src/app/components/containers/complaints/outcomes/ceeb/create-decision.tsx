import { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Button, Card } from "react-bootstrap";
import {
  selectDecisionTypeDropdown,
  selectDischargeDropdown,
  selectNonComplianceDropdown,
  selectRationaleDropdown,
  selectScheduleDropdown,
  selectSectorDropdown,
} from "../../../../../store/reducers/code-table-selectors";
import { CompSelect } from "../../../../common/comp-select";
import { ValidationDatePicker } from "../../../../../common/validation-date-picker";
import { Decision } from "../../../../../types/app/case-files/ceeb/decision/decision";
import { ComplaintParams } from "../../details/complaint-details-edit";
import { useParams } from "react-router-dom";
import { openModal } from "../../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../../types/modal/modal-types";
import Option from "../../../../../types/app/option";

const defaultDecision: Decision = {
  schedule: "",
  sector: "",
  discharge: "",
  nonCompliance: "",
  rationale: "",
  assignedTo: "",
  actionTaken: "",
  actionTakenDate: new Date(),
};

export const CeebDecision: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select data from redux
  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  //-- drop-downs
  const dischargesOptions = useAppSelector(selectDischargeDropdown);
  const nonComplianceOptions = useAppSelector(selectNonComplianceDropdown);
  const rationaleOptions = useAppSelector(selectRationaleDropdown);
  const sectorsOptions = useAppSelector(selectSectorDropdown);
  const schedulesOptions = useAppSelector(selectScheduleDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);

  const [editable, setEditable] = useState<boolean>(true);

  //-- component data
  // eslint-disable-line no-console, max-len
  const [data, applyData] = useState<Decision>(defaultDecision);

  //-- error messages
  const [scheduleErrorMessage, setScheduleErrorMessage] = useState("");
  const [sectorErrorMessage, setSectorErrorMessage] = useState("");
  const [dischargeErrorMessage, setDischargeErrorMessage] = useState("");
  const [rationaleErrorMessage, setRationaleErrorMessage] = useState("");
  const [nonComplianceErrorMessage, setNonComplianceErrorMessage] = useState("");
  const [dateActionTakenErrorMessage, setDateActionTakenErrorMessage] = useState("");
  const [decisionTypeErrorMessage, setDecisionTypeErrorMessage] = useState("");

  //-- handlers

  //-- update the decision state by property
  const updateModel = (property: string, value: string | Date | undefined) => {
    console.log("property: ", property);
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

      case "actionTaken": {
        const { actionTaken } = data;
        result = decisionTypeOptions.find((item) => item.value === actionTaken);
        break;
      }

      case "assignedTo": {
        const { assignedTo } = data;
        // return officers.find((item) => item.value === assignedTo);
        result = undefined;
        break;
      }
    }

    return !result ? null : result;
  };

  //-- when setting the assignment this should also update the assignment
  //-- of the complaint to the officer being selected in the decision
  const updateAssignment = (value?: string) => {
    updateModel("assignedTo", value);
  };

  const handleDateChange = (date?: Date) => {
    updateModel("actionTakenDate", date);
  };

  //-- action handlers save / cancel

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            applyData(defaultDecision);
          },
        },
      }),
    );
  };

  return (
    <section
      className="comp-details-section"
      id="ceeb-decision"
    >
      <div className="comp-details-section-header">
        <h3>Decision</h3>
        {!editable && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              // onClick={toggleEdit}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>

      <Card
        id="ceeb-decision"
        border={showSectionErrors ? "danger" : "default"}
      >
        <Card.Body>
          <div className="comp-details-form">
            <div
              className="comp-details-form-row"
              id="decision-schedule-sector-type"
            >
              <label htmlFor="action-required">WDR schedule/IPM sector type</label>
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
              <label htmlFor="action-required">Sector/Category</label>
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
              <label htmlFor="action-required">Discharge type</label>
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
              <label htmlFor="action-required">Action taken</label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="outcome-decision-action-taken"
                  className="comp-details-input"
                  classNamePrefix="comp-select"
                  options={decisionTypeOptions}
                  enableValidation={true}
                  errorMessage={decisionTypeErrorMessage}
                  placeholder="Select"
                  onChange={(evt) => {
                    updateModel("actionTaken", evt?.value);
                  }}
                  value={getValue("actionTaken")}
                />
              </div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-non-compliance-decision-matrix"
            >
              <label htmlFor="action-required">Non-compliance decision matrix</label>
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
              <label htmlFor="action-required">Rationale</label>
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
              <label htmlFor="action-required">Assigned to</label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="outcome-decision-assigned-to"
                  className="comp-details-input"
                  classNamePrefix="comp-select"
                  options={[]}
                  enableValidation={true}
                  errorMessage={scheduleErrorMessage}
                  placeholder="Select"
                  onChange={(evt) => {
                    updateAssignment(evt?.value);
                  }}
                  // value={getValue("schedule")}
                />
              </div>
            </div>
            <div
              className="comp-details-form-row"
              id="complaint-outcome-date-div"
            >
              <label htmlFor="complaint-outcome-date">Date</label>
              <div className="comp-details-input">
                <ValidationDatePicker
                  id="complaint-outcome-date"
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
              id="decision-cancel-button"
              title="Cancel Decision"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              id="decision-save-button"
              title="Save Decision"
              // onClick={saveButtonClick}
            >
              Save
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

/*
//-- 
  const getValue = (property: string): Option | undefined => {
    switch (property) {
      case "schedule": {
        const { schedule } = data;
        return schedulesOptions.find((item) => item.value === schedule);
      }

      case "sector": {
        const { sector } = data;
        return sectorsOptions.find((item) => item.value === sector);
      }

      case "discharge": {
        const { discharge } = data;
        return dischargesOptions.find((item) => item.value === discharge);
      }

      case "nonCompliance": {
        const { nonCompliance } = data;
        return nonComplianceOptions.find((item) => item.value === nonCompliance);
      }

      case "rationale": {
        const { rationale } = data;
        return rationaleOptions.find((item) => item.value === rationale);
      }

      case "assignedTo": {
        const { assignedTo } = data;
        // return officers.find((item) => item.value === assignedTo);
        return undefined;
      }
    }
  };
*/
