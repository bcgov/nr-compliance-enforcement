import { FC, useEffect } from "react";
import { ComplaintAssessments } from "./complaint-assessments/complaint-assessments";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRFileReview } from "./hwcr-file-review";
import { Notes } from "./notes";
import { OutcomeAttachments } from "./outcome-attachments";
import { useAppDispatch } from "@hooks/hooks";
import { HWCROutcomeByAnimalv2 } from "./hwcr-outcome-by-animal-v2";
import { resetCases } from "@/app/store/reducers/complaint-outcomes";
import { HWCRPreventions } from "./hwcr-prevention/hwcr-preventions";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface HWCROutcomeReportProps {
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const HWCROutcomeReport: FC<HWCROutcomeReportProps> = ({ onDirtyChange }) => {
  const dispatch = useAppDispatch();

  const { handleChildDirtyChange } = useFormDirtyState(onDirtyChange);

  // Clear case state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetCases());
    };
  }, [dispatch]);

  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <ComplaintAssessments onDirtyChange={(_, isDirty) => handleChildDirtyChange(0, isDirty)} />
      <HWCRPreventions onDirtyChange={(_, isDirty) => handleChildDirtyChange(1, isDirty)} />
      <HWCREquipment onDirtyChange={(_, isDirty) => handleChildDirtyChange(2, isDirty)} />
      <HWCROutcomeByAnimalv2 onDirtyChange={(_, isDirty) => handleChildDirtyChange(3, isDirty)} />
      <Notes onDirtyChange={(_, isDirty) => handleChildDirtyChange(4, isDirty)} />
      <OutcomeAttachments onDirtyChange={(_, isDirty) => handleChildDirtyChange(5, isDirty)} />
      <HWCRFileReview onDirtyChange={(_, isDirty) => handleChildDirtyChange(6, isDirty)} />
    </section>
  );
};
