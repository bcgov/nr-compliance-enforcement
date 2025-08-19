import { FC } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { formatDate, formatTime } from "@common/methods";
import { Party } from "@/generated/graphql";

interface PartyHeaderProps {
  partyData?: Party;
}

export const PartyHeader: FC<PartyHeaderProps> = ({ partyData }) => {
  const partyId = partyData?.partyIdentifier || "Unknown";
  const partyType = partyData?.partyTypeLongDescription || "Unknown";
  const dateLogged = partyData?.partyCreatedDateTime ? new Date(partyData.partyCreatedDateTime).toString() : undefined;

  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container">
          {/* <!-- breadcrumb start --> */}
          <div className="comp-complaint-breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link
                    to=""
                    onClick={() => window.alert("Navigating to the list of parties")}
                  >
                    Parties of Interest
                  </Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {partyId}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- case info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Party of Interest</span>&nbsp;&nbsp;#{partyId}
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

          {/* Party Type Details */}
          <div
            className="mt-1 max-width-48ch"
            id="comp-nature-of-complaint"
          >
            <span>{partyType}</span>
          </div>
          <div
            className="mt-1 max-width-48ch"
            id="comp-nature-of-complaint"
          >
            <span>{`Created on: ${formatDate(dateLogged)} ${formatTime(dateLogged)}`}</span>
          </div>
        </div>
      </div>
    </>
  );
};
