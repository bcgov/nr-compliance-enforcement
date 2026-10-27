import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useInvestigationSearch } from "../../hooks/use-investigation-search";

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
          <div className="comp-header-actions">{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPartyHeader;
