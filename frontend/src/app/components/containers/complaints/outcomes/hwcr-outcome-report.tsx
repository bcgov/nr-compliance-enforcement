import { FC, useEffect } from "react";
import { HWCRComplaintAssessment } from "./hwcr-complaint-assessment";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRFileReview } from "./hwcr-file-review";
import { HWCRSupplementalNotes } from "./hwcr-supplemental-notes";
import { HWCRFileAttachments } from "./hwcr-file-attachments";
import { HWCRComplaintPrevention } from "./hwcr-prevention-education";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "../details/complaint-details-edit";
import { useAppDispatch } from "../../../../hooks/hooks";
import { getCaseFile } from "../../../../store/reducers/case-thunks";
import { HWCROutcomeByAnimalv2 } from "./hwcr-outcome-by-animal-v2";

export const HWCROutcomeReport: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCaseFile(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <HWCRComplaintAssessment />
      <HWCRComplaintPrevention />
      <HWCREquipment />
      <HWCROutcomeByAnimalv2 />
      <HWCRSupplementalNotes />
      <HWCRFileAttachments />
      <HWCRFileReview />
    </section>
  );
};
