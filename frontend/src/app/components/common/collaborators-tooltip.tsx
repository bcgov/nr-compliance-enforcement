import { FC } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";

type CollaboratorsTooltipProps = {
  id: string;
  collaborators: { appUserGuid: string; firstName?: string; lastName?: string; collaboratorAgency?: string }[];
  // Defaults to the collaborator count id; pass a different one when reusing for another role (e.g. admin support)
  countId?: string;
};

// Renders "+N" with a hover/click tooltip listing the users. Used for collaborators and other multi-user roles.
export const CollaboratorsTooltip: FC<CollaboratorsTooltipProps> = ({
  id,
  collaborators,
  countId = "comp-header-collaborator-count",
}) => {
  const agencyCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));

  return (
    <OverlayTrigger
      key={`${id}-collab-tooltip`}
      placement="bottom"
      trigger={["hover", "click"]}
      overlay={
        <Tooltip
          id={`tt-${id}`}
          className="comp-tooltip comp-tooltip-bottom collaborators-tooltip"
        >
          {collaborators.map((c) => {
            const agency = agencyCodes?.find(({ agency }) => agency === c.collaboratorAgency)?.shortDescription;
            return (
              <div
                className="d-flex justify-content-start"
                key={`${c.appUserGuid}`}
              >
                {c.lastName}, {c.firstName}
                {agency && (
                  <>
                    <span className="mx-1">|</span>
                    <span className="fw-bold">{agency}</span>
                  </>
                )}
              </div>
            );
          })}
        </Tooltip>
      }
    >
      <span
        id={countId}
        className="comp-header-assignee-count fw-bold"
      >
        +{collaborators.length}
      </span>
    </OverlayTrigger>
  );
};
