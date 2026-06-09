import { FC } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "@common/methods";
import { Party } from "@/generated/graphql";
import { ActionMenu } from "@/app/components/common/action-menu";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useAppSelector } from "@/app/hooks/hooks";

interface PartyHeaderProps {
  partyData?: Party;
}

export const PartyHeader: FC<PartyHeaderProps> = ({ partyData }) => {
  const officers = useAppSelector(selectOfficers);
  const partyId = partyData?.partyIdentifier || "Unknown";
  const partyType = partyData?.longDescription || "Unknown";
  const dateLogged = partyData?.createdDateTime ? new Date(partyData.createdDateTime).toString() : undefined;
  const lastUpdated = partyData?.updatedDateTime ? new Date(partyData.updatedDateTime).toString() : undefined;
  const getCreatedByDisplayName = (createdBy: string, officers: any) => {
    const officer = officers?.find((item: { app_user_guid: string }) => item.app_user_guid === createdBy);
    return officer ? `${officer?.last_name}, ${officer?.first_name} (${officer?.agency_code?.shortDescription})` : "";
  };

  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/parties">Parties of Interest</Link>
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
          {" by "}
          {getCreatedByDisplayName(partyData?.createdByUserGuid ?? "", officers)}
        </div>
        <div className="mt-1 max-width-48ch">
          <span>{`Last updated ${formatDate(lastUpdated)} ${formatTime(lastUpdated)}`}</span>
        </div>
      </div>
    </div>
  );
};
