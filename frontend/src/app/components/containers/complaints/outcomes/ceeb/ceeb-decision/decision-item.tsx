import { FC } from "react";
import { formatDate } from "../../../../../../common/methods";

type props = {
  id: string;
  schedule: string;
  sector: string;
  discharge: string;
  nonCompliance: string;
  rationale: string;
  inspectionNumber: string;
  leadAgency: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
};

export const DecisionForm: FC<props> = ({
  id,
  schedule,
  sector,
  discharge,
  nonCompliance,
  rationale,
  assignedTo,
  actionTaken,
  actionTakenDate,
}) => {
  return (
    <dl>
      <div>
        <dt>WDR schedule/IPM sector type</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Sector/Category</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Discharge type</dt>
        <dd>{schedule}</dd>
      </div>
      <hr></hr>
      <div>
        <dt>Action taken</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Lead agency</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>NRIS Inspection number</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Non-compliance decsion matrix</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Rationale</dt>
        <dd>{schedule}</dd>
      </div>
      <div>
        <dt>Assigned to</dt>
        <dd>{schedule}</dd>
      </div>

      <div>
        <dt>Date action taken</dt>
        <dd>{formatDate(`${actionTakenDate}`)}</dd>
      </div>
    </dl>
  );
};
