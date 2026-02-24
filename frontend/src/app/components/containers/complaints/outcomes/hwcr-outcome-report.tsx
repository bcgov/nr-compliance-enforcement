import { FC, useEffect } from "react";
import { HWCRAssessments } from "./hwcr-assessment/hwcr-assessments";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRFileReview } from "./hwcr-file-review";
import { Notes } from "./notes";
import { OutcomeAttachments } from "./outcome-attachments";
import { useAppDispatch } from "@hooks/hooks";
import { HWCROutcomeByAnimalv2 } from "./hwcr-outcome-by-animal-v2";
import { resetCases } from "@/app/store/reducers/complaint-outcomes";
import { HWCRPreventions } from "./hwcr-prevention/hwcr-preventions";

interface HWCROutcomeReportProps {
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const HWCROutcomeReport: FC<HWCROutcomeReportProps> = ({ onDirtyChange }) => {
  const dispatch = useAppDispatch();

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
      <HWCRAssessments onDirtyChange={onDirtyChange} />
      <HWCRPreventions onDirtyChange={onDirtyChange} />
      <HWCREquipment onDirtyChange={onDirtyChange} />
      <HWCROutcomeByAnimalv2 onDirtyChange={onDirtyChange} />
      <Notes onDirtyChange={onDirtyChange} />
      <OutcomeAttachments onDirtyChange={onDirtyChange} />
      <HWCRFileReview onDirtyChange={onDirtyChange} />
    </section>
  );
};
