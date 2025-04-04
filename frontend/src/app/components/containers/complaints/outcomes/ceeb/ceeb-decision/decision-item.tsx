import { FC } from "react";
import { formatDate, getDropdownOption } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { selectLeadAgencyDropdown } from "@store/reducers/code-table";
import {
  selectDischargeDropdown,
  selectNonComplianceDropdown,
  selectSectorDropdown,
  selectScheduleDropdown,
  selectDecisionTypeDropdown,
  selectIPMAuthCategoryDropdown,
} from "@store/reducers/code-table-selectors";
import { CASE_ACTION_CODE } from "@constants/case_actions";

type props = {
  id?: string;
  schedule?: string;
  sector?: string;
  discharge: string;
  nonCompliance?: string;
  ipmAuthCategory?: string;
  rationale: string;
  inspectionNumber?: string;
  leadAgency?: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
};

export const DecisionItem: FC<props> = ({
  schedule,
  sector,
  discharge,
  nonCompliance,
  ipmAuthCategory,
  rationale,
  leadAgency,
  inspectionNumber,
  actionTaken,
  actionTakenDate,
}) => {
  //-- drop-downs
  const dischargesOptions = useAppSelector(selectDischargeDropdown);
  const nonComplianceOptions = useAppSelector(selectNonComplianceDropdown);
  const sectorsOptions = useAppSelector(selectSectorDropdown);
  const schedulesOptions = useAppSelector(selectScheduleDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);
  const agencyOptions = useAppSelector(selectLeadAgencyDropdown);
  const ipmAuthCategoryOptions = useAppSelector(selectIPMAuthCategoryDropdown);

  return (
    <dl>
      <div>
        <dt>WDR schedule/IPM sector type</dt>
        <dd id="decision-schedule">{getDropdownOption(schedule, schedulesOptions)?.label}</dd>
      </div>
      {schedule === "IPM" && (
        <div>
          <dt>Authorization category</dt>
          <dd id="decision-authorization">{getDropdownOption(ipmAuthCategory, ipmAuthCategoryOptions)?.label}</dd>
        </div>
      )}
      <div>
        <dt>Sector</dt>
        <dd id="decision-sector">{getDropdownOption(sector, sectorsOptions)?.label}</dd>
      </div>
      <div>
        <dt>Discharge type</dt>
        <dd id="decision-discharge">{getDropdownOption(discharge, dischargesOptions)?.label}</dd>
      </div>
      <hr className="my-0"></hr>
      <div>
        <dt>Action taken</dt>
        <dd id="decision-action">{getDropdownOption(actionTaken, decisionTypeOptions)?.label}</dd>
      </div>
      {actionTaken === CASE_ACTION_CODE.FWDLEADAGN && (
        <div>
          <dt>Lead agency</dt>
          <dd>{getDropdownOption(leadAgency, agencyOptions)?.label}</dd>
        </div>
      )}
      {actionTaken === CASE_ACTION_CODE.RESPREC && (
        <div>
          <dt>NRIS inspection number</dt>
          <dd>{inspectionNumber}</dd>
        </div>
      )}
      <div>
        <dt>Non-compliance decsion matrix</dt>
        <dd>{getDropdownOption(nonCompliance, nonComplianceOptions)?.label}</dd>
      </div>
      <div>
        <dt>Rationale</dt>
        <dd>{rationale}</dd>
      </div>
      <div>
        <dt>Date action taken</dt>
        <dd id="decision-date">{actionTakenDate !== null && formatDate(new Date(actionTakenDate).toString())}</dd>
      </div>
    </dl>
  );
};
