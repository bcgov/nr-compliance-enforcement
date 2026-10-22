import { FC, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useInvestigationSearch } from "../../hooks/use-investigation-search";

// TEMP: layout A/B
const readPartyMatchLayout = (): "buttons" | "scroll" | "both" => {
  const layout = localStorage.getItem("partyMatchLayout");
  return layout === "scroll" || layout === "both" ? layout : "buttons";
};

// TEMP: layout A/B
export const usePartyMatchLayout = () => {
  const [layout, setLayout] = useState(readPartyMatchLayout);
  useEffect(() => {
    const sync = () => setLayout(readPartyMatchLayout());
    window.addEventListener("partyMatchLayout", sync);
    return () => window.removeEventListener("partyMatchLayout", sync);
  }, []);
  return layout;
};

interface InvestigationPartyHeaderProps {
  title: string;
  investigationGuid: string;
  investigationLabel?: string;
  badges?: ReactNode;
  actions?: ReactNode;
  isEditMode?: boolean;
  identifier?: string;
}

export const InvestigationPartyHeader: FC<InvestigationPartyHeaderProps> = ({
  title,
  investigationGuid,
  investigationLabel,
  badges,
  actions,
  isEditMode = false,
  identifier,
}) => {
  const { searchURL: investigationSearchURL } = useInvestigationSearch();

  return (
    <div className="comp-details-header">
      <div className="comp-container">
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={investigationSearchURL}>Investigations</Link>
              </li>
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/investigation/${investigationGuid}`}>{investigationLabel ?? "Investigation"}</Link>
              </li>
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/investigation/${investigationGuid}/parties`}>Parties</Link>
              </li>
              {identifier && isEditMode ? (
                <>
                  <li className="breadcrumb-item comp-nav-item-name-inverted">
                    <Link to={`/investigation/${investigationGuid}/party/${identifier}`}>{title}</Link>
                  </li>
                  <li className="breadcrumb-item">Edit party</li>
                </>
              ) : (
                <li className="breadcrumb-item">{title}</li>
              )}
            </ol>
          </nav>
        </div>

        <div className="comp-details-title-container">
          <div className="comp-details-title-info d-flex align-items-center gap-2">
            <h1 className="comp-box-complaint-id mb-0 pb-1">
              <span>{title}</span>
            </h1>
            {badges}
          </div>
          <div className="comp-header-actions">
            {/* TEMP: layout A/B */}
            {isEditMode && (
              <ToggleButtonGroup
                type="radio"
                size="sm"
                name="partyMatchLayout"
                className="me-3"
                value={readPartyMatchLayout()}
                onChange={(layout) => {
                  localStorage.setItem("partyMatchLayout", layout);
                  window.dispatchEvent(new Event("partyMatchLayout"));
                }}
              >
                <ToggleButton
                  id="party-match-layout-buttons"
                  value="buttons"
                  variant="outline-light"
                  className="d-inline-flex align-items-center"
                >
                  Buttons
                </ToggleButton>
                <ToggleButton
                  id="party-match-layout-scroll"
                  value="scroll"
                  variant="outline-light"
                  className="d-inline-flex align-items-center"
                >
                  Scroll
                </ToggleButton>
                <ToggleButton
                  id="party-match-layout-both"
                  value="both"
                  variant="outline-light"
                  className="d-inline-flex align-items-center"
                >
                  Both
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPartyHeader;
