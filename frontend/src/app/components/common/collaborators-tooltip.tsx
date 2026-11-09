import { FC } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";

type CollaboratorsTooltipProps = {
  id: string;
  collaborators: { appUserGuid: string; firstName?: string; lastName?: string; collaboratorAgency?: string }[];
};

export const CollaboratorsTooltip: FC<CollaboratorsTooltipProps> = ({ id, collaborators }) => {
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
            return (
              <div
                className="d-flex justify-content-start"
                key={`${c.appUserGuid}`}
              >
                {c.lastName}, {c.firstName}
                <span className="mx-1">|</span>
                <span className="fw-bold">
                  {agencyCodes?.find(({ agency }) => agency === c.collaboratorAgency)?.shortDescription}
                </span>
              </div>
            );
          })}
        </Tooltip>
      }
    >
      <span
        id="comp-header-collaborator-count"
        className="fw-bold"
      >
        +{collaborators.length}
      </span>
    </OverlayTrigger>
  );
};
