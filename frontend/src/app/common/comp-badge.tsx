import { FC, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type CompBadgeProps = {
  id: string;
  label: string;
  variantClassName: string;
  iconClassName?: string;
  tooltipText?: string;
};

export const CompBadge: FC<CompBadgeProps> = ({ id, label, variantClassName, iconClassName, tooltipText }) => {
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
