import { FC } from "react";
import { OutcomeAttachments } from "../outcome-attachments";
import { CeebAuthoization } from "./ceeb-authorization/authroization";

export const CeebOutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <CeebAuthoization />
      <OutcomeAttachments showAddButton={true} />
    </section>
  );
};
