import { FC } from "react";
import { HWCRComplaintAssessment } from "./hwcr-complaint-assessment";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRFileReview } from "./hwcr-file-review";
import { SupplementalNote } from "./supplemental-note";
import { OutcomeAttachments } from "./outcome-attachments";
import { HWCRComplaintPrevention } from "./hwcr-prevention-education";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { HWCROutcomeByAnimalv2 } from "./hwcr-outcome-by-animal-v2";

export const HWCROutcomeReport: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();

  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <HWCRComplaintAssessment id={id} />
      <HWCRComplaintPrevention />
      <HWCREquipment />
      <HWCROutcomeByAnimalv2 />
      <SupplementalNote />
      <OutcomeAttachments />
      <HWCRFileReview />
    </section>
  );
};
