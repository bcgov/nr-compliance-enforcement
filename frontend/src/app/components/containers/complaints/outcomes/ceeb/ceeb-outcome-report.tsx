import { FC } from "react";
import { OutcomeAttachments } from "../outcome-attachments";

export const CeebOutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <OutcomeAttachments showAddButton={true} />
    </section>
  );
};
