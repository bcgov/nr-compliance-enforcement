import { FC } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "@common/methods";
import { Party } from "@/generated/graphql";
import { ActionMenu } from "@/app/components/common/action-menu";

interface PartyHeaderProps {
  partyData?: Party;
}

export const PartyHeader: FC<PartyHeaderProps> = ({ partyData }) => {
  const partyId = partyData?.partyIdentifier || "Unknown";
  const partyType = partyData?.longDescription || "Unknown";
  const dateLogged = partyData?.createdDateTime ? new Date(partyData.createdDateTime).toString() : undefined;

  return (
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

        {/* <!-- party info start --> */}
        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>Party of Interest</span>&nbsp;&nbsp;#{partyId}
            </h1>
          </div>
          <ActionMenu />
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
  );
};
