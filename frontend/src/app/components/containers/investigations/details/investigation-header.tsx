import { FC } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { Investigation } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import Option from "@apptypes/app/option";
import { InvestigationTabs } from "@/app/components/containers/investigations/details/investigation-navigation";

interface InvestigationHeaderProps {
  investigation?: Investigation;
}

export const InvestigationHeader: FC<InvestigationHeaderProps> = ({ investigation }) => {
  const investigationId = investigation?.name || investigation?.investigationGuid || "Unknown";
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const agencyText = leadAgencyOptions.find((option: Option) => option.value === investigation?.leadAgency);
  const leadAgency = agencyText ? agencyText.label : "Unknown";

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
                <span>Investigation </span>
                {investigationId}
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

          <div
            className="mt-1 max-width-48ch"
            id="comp-details-lead-agency-text-id"
          >
            <span>Lead agency: {leadAgency}</span>
          </div>
        </div>
      </div>
      <InvestigationTabs />
    </>
  );
};
