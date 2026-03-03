import { FC } from "react";
import { Notes } from "./notes";

interface GIROutcomeReportProps {
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const GIROutcomeReport: FC<GIROutcomeReportProps> = ({ onDirtyChange }) => {
  return (
    <section className="comp-details-body comp-container comp-gir-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <Notes onDirtyChange={onDirtyChange} />
    </section>
  );
};
