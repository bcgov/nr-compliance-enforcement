import { FC } from "react";
import { Link } from "react-router-dom";
import { Badge, Dropdown } from "react-bootstrap";
import { applyStatusClass, formatDate, formatTime, getAvatarInitials } from "@common/methods";
import { CaseFile } from "@/generated/graphql";

interface CaseHeaderProps {
  caseData?: CaseFile;
}

export const CaseHeader: FC<CaseHeaderProps> = ({ caseData }) => {
  const caseId = caseData?.caseIdentifier || "Unknown";
  const caseStatus = caseData?.caseStatus?.shortDescription || "Active";
  const caseType = "Investispection";
  const leadAgency = caseData?.leadAgency?.longDescription || "Unknown Agency";
  const dateLogged = caseData?.caseOpenedTimestamp ? new Date(caseData.caseOpenedTimestamp).toString() : undefined;
  const lastUpdated = caseData?.caseOpenedTimestamp ? new Date(caseData.caseOpenedTimestamp).toString() : undefined;
  const officerAssigned = "Not Assigned";
  const createdBy = "Unknown";

  return (
    <>
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
                className={`badge ${applyStatusClass(caseStatus)}`}
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

      {/* <!-- case status details start --> */}
      <section className="comp-details-body comp-container">
        <div className="comp-header-status-container">
          <div className="comp-details-status">
            <dl>
              <dt>Lead agency</dt>
              <dd>
                <div className="comp-lead-agency">
                  <i className="bi bi-building"></i>
                  <span
                    id="comp-details-lead-agency-text-id"
                    className="comp-lead-agency-name"
                  >
                    {leadAgency}
                  </span>
                </div>
              </dd>
            </dl>
            <dl className="comp-details-date-logged">
              <dt>Date logged</dt>
              <dd className="comp-date-time-value">
                {dateLogged && (
                  <>
                    <div id="case-date-logged">
                      <i className="bi bi-calendar"></i>
                      {formatDate(dateLogged)}
                    </div>
                    <div>
                      <i className="bi bi-clock"></i>
                      {formatTime(dateLogged)}
                    </div>
                  </>
                )}
                {!dateLogged && <>N/A</>}
              </dd>
            </dl>

            <dl className="comp-details-date-assigned">
              <dt>Last updated</dt>
              <dd className="comp-date-time-value">
                {lastUpdated && (
                  <>
                    <div>
                      <i className="bi bi-calendar"></i>
                      {formatDate(lastUpdated)}
                    </div>
                    <div>
                      <i className="bi bi-clock"></i>
                      {formatTime(lastUpdated)}
                    </div>
                  </>
                )}
                {!lastUpdated && <>N/A</>}
              </dd>
            </dl>

            <dl>
              <dt>Officer assigned</dt>
              <dd>
                <div
                  data-initials-sm={getAvatarInitials(officerAssigned)}
                  className="comp-avatar comp-avatar-sm comp-avatar-orange"
                >
                  <div>
                    <span id="comp-details-assigned-officer-name-text-id">{officerAssigned}</span>
                  </div>
                </div>
              </dd>
            </dl>

            <dl>
              <dt>Created by</dt>
              <dd>
                <div
                  data-initials-sm={getAvatarInitials(createdBy)}
                  className="comp-avatar comp-avatar-sm comp-avatar-blue"
                >
                  <span>{createdBy}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </section>
      {/* <!-- case status details end --> */}
    </>
  );
};
