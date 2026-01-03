import { FC } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { Investigation } from "@/generated/graphql";
import { InvestigationTabs } from "@/app/components/containers/investigations/details/investigation-navigation";
import { applyStatusClass } from "@/app/common/methods";

interface InvestigationHeaderProps {
  investigation?: Investigation;
}

export const InvestigationHeader: FC<InvestigationHeaderProps> = ({ investigation }) => {
  const investigationId = investigation?.name || investigation?.investigationGuid || "Unknown";
  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container mw-100 px-4">
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
                  {investigationId}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- investigation info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Investigation #</span>
                {investigationId}
              </h1>
              {investigation?.investigationStatus && investigation?.investigationStatus?.investigationStatusCode && (
                <span
                  className={`badge ${applyStatusClass(investigation?.investigationStatus.investigationStatusCode)}`}
                >
                  {investigation?.investigationStatus.shortDescription}
                </span>
              )}
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
      <InvestigationTabs />
    </>
  );
};
