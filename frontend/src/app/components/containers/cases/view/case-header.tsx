import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from "react-bootstrap";
import { applyStatusClass, formatDate, formatTime, getAvatarInitials } from "@common/methods";
import { CaseFile } from "@/generated/graphql";
import { ActionMenu } from "@/app/components/common/action-menu";
import { CaseTabs } from "./case-tabs";

interface CaseHeaderProps {
  caseData?: CaseFile;
}

export const CaseHeader: FC<CaseHeaderProps> = ({ caseData }) => {
  const caseId = caseData?.caseIdentifier || "Unknown";
  const status = caseData?.caseStatus?.shortDescription || "Active";
  const leadAgency = caseData?.leadAgency?.longDescription || "Unknown Agency";
  const dateLogged = caseData?.openedTimestamp ? new Date(caseData.openedTimestamp).toString() : undefined;
  const lastUpdated = caseData?.openedTimestamp ? new Date(caseData.openedTimestamp).toString() : undefined;
  const officerAssigned = "Not Assigned";
  const createdBy = "Unknown";
  const navigate = useNavigate();

  const editButtonClick = () => {
    navigate(`/case/${caseData?.caseIdentifier}/edit`);
  };

  return (
    <>
      <div className="comp-details-header">
        <div
          className="comp-container"
          style={{ maxWidth: "initial" }}
        >
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
                <i
                  className="bi bi-folder-fill"
                  style={{ fontSize: "xx-large" }}
                ></i>{" "}
                &nbsp;
                <span>Case </span>#{caseId}
              </h1>
            </div>

            {/* Badges */}
            <div className="comp-details-badge-container">
              <Badge
                id="comp-details-status-text-id"
                className={`badge ${applyStatusClass(status)}`}
              >
                {status}
              </Badge>
            </div>
            <ActionMenu />
          </div>
        </div>
      </div>

      <CaseTabs />
      <section className="comp-details-body pb-0">
        <div className="comp-details-section-header">
          <p>
            <b>Case description</b>
          </p>
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="details-screen-edit-button"
              onClick={editButtonClick}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit case</span>
            </Button>
          </div>
        </div>
        <div className="comp-details-content">
          <div className="row">
            <p>{caseData?.description}</p>
          </div>
        </div>
      </section>
      {/* <!-- case status details start --> */}
      <section className="comp-details-body pt-0">
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
      <hr className="mt-0 mb-2" />
    </>
  );
};
