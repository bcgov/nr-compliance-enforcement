import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { Investigation } from "@/generated/graphql";
import { formatDate, formatTime, getAvatarInitials } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import Option from "@apptypes/app/option";

interface InvestigationHeaderProps {
  investigation?: Investigation;
}

export const InvestigationHeader: FC<InvestigationHeaderProps> = ({ investigation }) => {
  const navigate = useNavigate();

  const investigationGuid = investigation?.investigationGuid;

  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const agencyText = leadAgencyOptions.find((option: Option) => option.value === investigation?.leadAgency);
  const leadAgency = agencyText ? agencyText.label : "Unknown";

  const dateLogged = investigation?.openedTimestamp ? new Date(investigation.openedTimestamp).toString() : undefined;
  const lastUpdated = investigation?.openedTimestamp ? new Date(investigation.openedTimestamp).toString() : undefined;
  const officerAssigned = "Not Assigned";
  const createdBy = "Unknown";
  const editButtonClick = () => {
    navigate(`/investigation/${investigationGuid}/edit`);
  };

  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container">
          {/* <!-- breadcrumb start --> */}
          <div className="comp-complaint-breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to="/investigations">Investigations</Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {investigationGuid}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- investigation info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Investigation </span>
                {investigationGuid}
              </h1>
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
        </div>
      </div>


      <section className="comp-details-body comp-container">
        <div className="comp-details-section-header">
          <div>
          </div>
          <div className="comp-details-section-header-actions mb-0 pb-3">
          <Button
            variant="outline-primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={editButtonClick}
          >
            <i className="bi bi-pencil"></i>
            <span>Edit investigation</span>
          </Button>
          </div>
        </div>
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
    </>
  );
};
