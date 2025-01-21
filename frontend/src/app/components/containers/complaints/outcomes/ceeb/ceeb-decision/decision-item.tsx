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
} from "@store/reducers/code-table-selectors";
import { CASE_ACTION_CODE } from "@constants/case_actions";

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
  schedule,
  sector,
  discharge,
  nonCompliance,
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

  return (
    <dl>
      <div>
        <dt>WDR schedule/IPM sector type</dt>
        <dd>{getDropdownOption(schedule, schedulesOptions)?.label}</dd>
      </div>
      <div>
        <dt>Sector/Category</dt>
        <dd>{getDropdownOption(sector, sectorsOptions)?.label}</dd>
      </div>
      <div>
        <dt>Discharge type</dt>
        <dd>{getDropdownOption(discharge, dischargesOptions)?.label}</dd>
      </div>
      <hr className="my-0"></hr>
      <div>
        <dt>Action taken</dt>
        <dd>{getDropdownOption(actionTaken, decisionTypeOptions)?.label}</dd>
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
        <dd>{actionTakenDate !== null && formatDate(new Date(actionTakenDate).toString())}</dd>
      </div>
    </dl>
  );
};
