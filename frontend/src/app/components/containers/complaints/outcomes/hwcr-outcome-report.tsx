import { FC } from "react";
import { HWCRComplaintAssessment } from "./hwcr-complaint-assessment";
import { HWCRPreventionEducation } from "./hwcr-prevention-education";
import { HWCREquipment } from "./hwcr-equipment";
import { HWCRWildlifeInformation } from "./hwcr-wildlife-information";
import { HWCRFileReview } from "./hwcr-file-review";

export const HWCROutcomeReport: FC = () => {  
    return (
      <div className="comp-hwcr-outcome-report">
        <hr className="blue-seperator"/>
        <div className="comp-sub-header">
            Outcome report
        </div>
        <HWCRComplaintAssessment/>
        <HWCRPreventionEducation/>
        <HWCREquipment/>
        <HWCRWildlifeInformation/>
        <HWCRFileReview/>
      </div>
    );
  };
  