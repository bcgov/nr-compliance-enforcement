import { FC } from "react";
import { HWCRFileAttachments } from "../hwcr-file-attachments";

export const CeebOutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>

      <HWCRFileAttachments clickToEnable={true} />
    </section>
  );
};
