import { FC, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const PublishedBadge: FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <OverlayTrigger
      key="overlay-party-badge-published"
      placement="top"
      show={isHovered || isFocused}
      overlay={
        <Tooltip
          id="tt-party-badge-published"
          className="comp-tooltip-dark"
        >
          This profile is visible to all NatSuite users and can be added to multiple investigations.
        </Tooltip>
      }
    >
      <button
        type="button"
        className="badge comp-status-badge-open comp-badge-tooltip-trigger"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <i className="bi bi-check-circle-fill"></i> Published
      </button>
    </OverlayTrigger>
  );
};
