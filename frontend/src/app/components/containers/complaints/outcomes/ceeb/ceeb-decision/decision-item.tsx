import { FC } from "react";
import { formatDate } from "../../../../../../common/methods";
import { useAppSelector } from "../../../../../../hooks/hooks";
import { selectAgencyDropdown } from "../../../../../../store/reducers/code-table";
import {
  selectDischargeDropdown,
  selectNonComplianceDropdown,
  selectRationaleDropdown,
  selectSectorDropdown,
  selectScheduleDropdown,
  selectDecisionTypeDropdown,
  selectScheduleSectorDropdown,
} from "../../../../../../store/reducers/code-table-selectors";
import { selectOfficersDropdown } from "../../../../../../store/reducers/officer";
import Option from "../../../../../../types/app/option";
import { CASE_ACTION_CODE } from "../../../../../../constants/case_actions";

type props = {
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

export const DecisionItem: FC<props> = ({
  id,
  schedule,
  sector,
  discharge,
  nonCompliance,
  rationale,
  leadAgency,
  inspectionNumber,
  assignedTo,
  actionTaken,
  actionTakenDate,
}) => {
  //-- drop-downs
  const dischargesOptions = useAppSelector(selectDischargeDropdown);
  const nonComplianceOptions = useAppSelector(selectNonComplianceDropdown);
  const rationaleOptions = useAppSelector(selectRationaleDropdown);
  const sectorsOptions = useAppSelector(selectSectorDropdown);
  const scheduleSectorsOptions = useAppSelector(selectScheduleSectorDropdown);
  const schedulesOptions = useAppSelector(selectScheduleDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const officerOptions = useAppSelector(selectOfficersDropdown(true));

  const getValue = (property: string): Option | undefined | null => {
    let result: Option | undefined;

    switch (property) {
      case "schedule": {
        result = schedulesOptions.find((item) => item.value === schedule);
        break;
      }

      case "sector": {
        result = sectorsOptions.find((item) => item.value === sector);
        break;
      }
      case "schedule-sector": {
        result = scheduleSectorsOptions.find((item) => item.value === sector);
        break;
      }
      case "schedule-sector-type": {
        result = scheduleSectorsOptions.find((item) => item.value === sector);
        break;
      }
      case "discharge": {
        result = dischargesOptions.find((item) => item.value === discharge);
        break;
      }

      case "nonCompliance": {
        result = nonComplianceOptions.find((item) => item.value === nonCompliance);
        break;
      }

      case "rationale": {
        result = rationaleOptions.find((item) => item.value === rationale);
        break;
      }

      case "leadAgency": {
        result = agencyOptions.find((item) => item.value === leadAgency);
        break;
      }

      case "actionTaken": {
        result = decisionTypeOptions.find((item) => item.value === actionTaken);
        break;
      }

      case "assignedTo": {
        result = officerOptions.find((item) => item.value === assignedTo);
        break;
      }
    }

    return !result ? null : result;
  };

  return (
    <dl>
      <div>
        <dt>WDR schedule/IPM sector type</dt>
        <dd>{getValue("schedule-sector")?.label}</dd>
      </div>
      <div>
        <dt>Sector/Category</dt>
        <dd>{getValue("sector")?.label}</dd>
      </div>
      <div>
        <dt>Discharge type</dt>
        <dd>{getValue("discharge")?.label}</dd>
      </div>
      <hr className="my-0"></hr>
      <div>
        <dt>Action taken</dt>
        <dd>{getValue("actionTaken")?.label}</dd>
      </div>
      {actionTaken === CASE_ACTION_CODE.FWDLEADAGN && (
        <div>
          <dt>Lead agency</dt>
          <dd>{getValue("leadAgency")?.label}</dd>
        </div>
      )}
      {actionTaken === CASE_ACTION_CODE.RESPREC && (
        <div>
          <dt>NRIS Inspection number</dt>
          <dd>{inspectionNumber}</dd>
        </div>
      )}
      <div>
        <dt>Non-compliance decsion matrix</dt>
        <dd>{getValue("nonCompliance")?.label}</dd>
      </div>
      <div>
        <dt>Rationale</dt>
        <dd>{getValue("rationale")?.label}</dd>
      </div>
      <div>
        <dt>Assigned to</dt>
        <dd>{getValue("assignedTo")?.label}</dd>
      </div>

      <div>
        <dt>Date action taken</dt>
        <dd>{actionTakenDate !== null && formatDate(new Date(actionTakenDate).toString())}</dd>
      </div>
    </dl>
  );
};
