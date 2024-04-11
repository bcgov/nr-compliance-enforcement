import { FC, useEffect } from "react";
import { HWCRComplaintAssessment } from "./hwcr-complaint-assessment";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCROutcomeByAnimal } from "./hwcr-outcome-by-animal";
import { HWCRFileReview } from "./hwcr-file-review";
import { HWCRSupplementalNotes } from "./hwcr-supplemental-notes";
import { HWCRFileAttachments } from "./hwcr-file-attachments";
import { HWCRComplaintPrevention } from "./hwcr-prevention-education";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "../details/complaint-details-edit";
import { useAppDispatch } from "../../../../hooks/hooks";
import { getCaseFile } from "../../../../store/reducers/case-thunks";

export const HWCROutcomeReport: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCaseFile(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="comp-hwcr-outcome-report">
      <hr className="blue-seperator" />
      <div className="comp-sub-header">Outcome report</div>
      <HWCRComplaintAssessment />
      <HWCRComplaintPrevention />
      <HWCREquipment />
      <HWCROutcomeByAnimal />
      <HWCRSupplementalNotes />
      <HWCRFileAttachments />
      <HWCRFileReview />
    </div>
  );
};
