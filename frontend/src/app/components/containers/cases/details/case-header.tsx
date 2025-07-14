import { FC } from "react";
import { Link } from "react-router-dom";
import { Badge, Dropdown } from "react-bootstrap";
import { applyStatusClass } from "@common/methods";

interface CaseHeaderProps {
  caseId?: string;
  caseStatus?: string;
  caseType?: string;
}

export const CaseHeader: FC<CaseHeaderProps> = ({
  caseId = "Unknown",
  caseStatus = "Active",
  caseType = "Investigation",
}) => {
  // Map case statuses to complaint status values that applyStatusClass expects
  const mapStatusForBadge = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "open";
      case "closed":
        return "closed";
      case "pending":
        return "pending review";
      default:
        return status.toLowerCase();
    }
  };

  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/cases">Cases</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {caseId}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        {/* <!-- case info start --> */}
        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>Case </span>#{caseId}
            </h1>
          </div>

          {/* Badges */}
          <div className="comp-details-badge-container">
            <Badge
              id="comp-details-status-text-id"
              className={`badge ${applyStatusClass(mapStatusForBadge(caseStatus))}`}
            >
              {caseStatus}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="comp-header-actions">
            <div className="comp-header-actions-mobile">
              <Dropdown>
                <Dropdown.Toggle
                  aria-label="Actions Menu"
                  variant="outline-primary"
                  className="icon-btn"
                  id="dropdown-basic"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    as="button"
                    disabled={true}
                  >
                    <i className="bi bi-gear"></i>
                    <span>Placeholder Action</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="comp-header-actions-desktop">
              <Dropdown className="comp-header-kebab-menu">
                <Dropdown.Toggle
                  aria-label="Actions Menu"
                  variant="outline-light"
                  className="kebab-btn"
                  id="dropdown-basic"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                  <span>More actions</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    as="button"
                    disabled={true}
                  >
                    <i className="bi bi-gear"></i>
                    <span>Placeholder Action</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Case Type Details */}
        <div
          className="mt-1 max-width-48ch"
          id="comp-nature-of-complaint"
        >
          <span>{caseType}</span>
        </div>
      </div>
    </div>
  );
};
