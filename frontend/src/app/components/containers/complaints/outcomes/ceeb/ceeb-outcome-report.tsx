import { FC } from "react";
import { HWCRFileAttachments } from "../hwcr-file-attachments";

export const CeebOutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <HWCRFileAttachments showAddButton={true} />
    </section>
  );
};
