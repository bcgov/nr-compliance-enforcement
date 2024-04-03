import { FC } from "react";
import { HWCRComplaintAssessment } from "./hwcr-complaint-assessment";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCROutcomeByAnimal } from "./hwcr-outcome-by-animal";
import { HWCRFileReview } from "./hwcr-file-review";
import { HWCRSupplementalNotes } from "./hwcr-supplemental-notes";
import { HWCRFileAttachments } from "./hwcr-file-attachments";
import { HWCRComplaintPrevention } from "./hwcr-prevention-education";

export const HWCROutcomeReport: FC = () => {  
    return (
      <div className="comp-hwcr-outcome-report">
        <hr className="blue-seperator"/>
        <div className="comp-sub-header">
            Outcome report
        </div>
        <HWCRComplaintAssessment/>
        <HWCRComplaintPrevention/>
        <HWCREquipment/>
        <HWCROutcomeByAnimal/>
        <HWCRSupplementalNotes/>
        <HWCRFileAttachments />
        <HWCRFileReview/>        
      </div>
    );
  };