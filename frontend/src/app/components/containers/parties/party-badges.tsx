import { FC, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type PartyBadgeProps = {
  id: string;
  label: string;
  variantClassName: string;
  iconClassName?: string;
  tooltipText?: string;
};

const PartyBadge: FC<PartyBadgeProps> = ({ id, label, variantClassName, iconClassName, tooltipText }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const content = (
    <>
      {iconClassName && <i className={iconClassName}></i>} {label}
    </>
  );

  if (!tooltipText) {
    return <div className={`badge ${variantClassName}`}>{content}</div>;
  }

  return (
    <OverlayTrigger
      key={`overlay-party-badge-${id}`}
      placement="right"
      show={isHovered || isFocused}
      overlay={
        <Tooltip
          id={`tt-party-badge-${id}`}
          className="comp-tooltip-dark"
        >
          {tooltipText}
        </Tooltip>
      }
    >
      <button
        type="button"
        className={`badge ${variantClassName} comp-badge-tooltip-trigger`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {content}
      </button>
    </OverlayTrigger>
  );
};

type PartyBadgesProps = {
  isSafetyConcern?: boolean;
  isPublished?: boolean;
  isYoungPerson?: boolean;
  isIncomplete?: boolean;
};

export const PartyBadges: FC<PartyBadgesProps> = ({ isSafetyConcern, isPublished, isYoungPerson, isIncomplete }) => (
  <>
    {isSafetyConcern && (
      <PartyBadge
        id="safety-concern"
        label="Safety concern"
        variantClassName="comp-status-badge-pending-review"
        iconClassName="bi bi-exclamation-circle"
      />
    )}
    {isIncomplete && (
      <PartyBadge
        id="incomplete"
        label="Incomplete"
        variantClassName="comp-party-badge-incomplete"
        iconClassName="bi bi-slash-circle-fill"
        tooltipText="Enforcement actions can only be taken against parties with sufficient information."
      />
    )}
    {isPublished && (
      <PartyBadge
        id="published"
        label="Published"
        variantClassName="comp-status-badge-open"
        iconClassName="bi bi-check-circle-fill"
        tooltipText="This profile is visible to all NatSuite users and can be added to multiple investigations."
      />
    )}
    {isYoungPerson && (
      <PartyBadge
        id="young-person"
        label="Young person"
        variantClassName="comp-status-badge-closed"
      />
    )}
  </>
);
