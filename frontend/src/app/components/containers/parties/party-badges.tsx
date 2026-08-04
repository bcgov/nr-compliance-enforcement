import { FC } from "react";

type PartyBadgesProps = {
  isSafetyConcern?: boolean;
  isPublished?: boolean;
  isYoungPerson?: boolean;
};

export const PartyBadges: FC<PartyBadgesProps> = ({ isSafetyConcern, isPublished, isYoungPerson }) => (
  <>
    {isSafetyConcern && (
      <div className="badge comp-status-badge-pending-review">
        <i className="bi bi-exclamation-circle"></i> Safety concern
      </div>
    )}
    {isPublished && (
      <div className="badge comp-status-badge-open">
        <i className="bi bi-check-circle-fill"></i> Published
      </div>
    )}
    {isYoungPerson && <div className="badge comp-status-badge-closed">Young person</div>}
  </>
);
