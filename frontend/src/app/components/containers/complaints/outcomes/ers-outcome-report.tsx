import { FC } from "react";
import { Notes } from "./notes";
import { ComplaintAssessments } from "./complaint-assessments/complaint-assessments";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface ERSOutcomeReportProps {
  showAssessments?: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

// Outcome report for COS/PARKS enforcement complaints (CEEB/NROS/MINES have their own)
export const ERSOutcomeReport: FC<ERSOutcomeReportProps> = ({ showAssessments, onDirtyChange }) => {
  const { handleChildDirtyChange } = useFormDirtyState(onDirtyChange);

  return (
    <section className="comp-details-body comp-container comp-ers-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      {showAssessments && <ComplaintAssessments onDirtyChange={(_, isDirty) => handleChildDirtyChange(0, isDirty)} />}
      <Notes onDirtyChange={(_, isDirty) => handleChildDirtyChange(1, isDirty)} />
    </section>
  );
};
