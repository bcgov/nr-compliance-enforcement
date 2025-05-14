import { FC, useEffect } from "react";
import { HWCRAssessments } from "./hwcr-assessment/hwcr-assessments";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRFileReview } from "./hwcr-file-review";
import { Notes } from "./notes";
import { OutcomeAttachments } from "./outcome-attachments";
import { HWCRComplaintPrevention } from "./hwcr-prevention-education";
import { useAppDispatch } from "@hooks/hooks";
import { HWCROutcomeByAnimalv2 } from "./hwcr-outcome-by-animal-v2";
import { resetCases } from "@/app/store/reducers/cases";

export const HWCROutcomeReport: FC = () => {
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
      <HWCRAssessments />
      <HWCRComplaintPrevention />
      <HWCREquipment />
      <HWCROutcomeByAnimalv2 />
      <Notes />
      <OutcomeAttachments />
      <HWCRFileReview />
    </section>
  );
};
