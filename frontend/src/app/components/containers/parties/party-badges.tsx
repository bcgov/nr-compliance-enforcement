import { CompBadge } from "@/app/common/comp-badge";
import { FC } from "react";

type PartyBadgesProps = {
  isSafetyConcern?: boolean;
  isPublished?: boolean;
  isYoungPerson?: boolean;
  isIncomplete?: boolean;
};

export const PartyBadges: FC<PartyBadgesProps> = ({ isSafetyConcern, isPublished, isYoungPerson, isIncomplete }) => (
  <>
    {isSafetyConcern && (
      <CompBadge
        id="safety-concern"
        label="Safety concern"
        variantClassName="comp-badge-red"
        iconClassName="bi bi-exclamation-circle"
      />
    )}
    {isIncomplete && (
      <CompBadge
        id="incomplete"
        label="Incomplete"
        variantClassName="comp-badge-yellow"
        iconClassName="bi bi-slash-circle-fill"
        tooltipText="Enforcement actions can only be taken against parties with sufficient information."
      />
    )}
    {isPublished && (
      <CompBadge
        id="published"
        label="Published"
        variantClassName="comp-badge-green"
        iconClassName="bi bi-check-circle-fill"
        tooltipText="This profile is visible to all NatSuite users and can be added to multiple investigations."
      />
    )}
    {isYoungPerson && (
      <CompBadge
        id="young-person"
        label="Young person"
        variantClassName="comp-badge-gray"
      />
    )}
  </>
);
