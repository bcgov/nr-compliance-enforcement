import { FC } from "react";
import { useParams } from "react-router-dom";
import { PartyHeader } from "./party-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { Party } from "@/generated/graphql";
import { Button } from "react-bootstrap";

const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
      partyIdentifier
      partyTypeCode
      partyTypeLongDescription
      partyTypeLongDescription
      partyCreatedDateTime
      person {
        personGuid
        firstName
        lastName
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

export type PartyParams = {
  id: string;
};

export const PartyView: FC = () => {
  const { id = "" } = useParams<PartyParams>();

  const { data, isLoading } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: !!id,
  });

  const partyData = data?.party;

  const editButtonClick = () => {
    window.alert("Navigating to the party edit view");
  };

  const displayName = () => {
    let result = "";
    if (partyData && partyData.person) result = `${partyData.person?.firstName} ${partyData.person?.lastName}`;
    else if (partyData && partyData.business) {
      result = `${partyData.business?.name}`;
    }
    return result;
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <PartyHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading party details...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {!partyData && <div className="case-not-found">No data found for ID: {id}</div>}
      {partyData && (
        <div className="comp-complaint-details">
          <PartyHeader partyData={partyData} />
          <section className="comp-details-body comp-container party-details-section">
            <hr className="comp-details-body-spacer"></hr>
            <h2>Party details</h2>
            <div className="party-details-summary-container">
              <div className="party-details-summary-vcard-container">
                <i className="bi bi-person-vcard party-details-summary-vcard"></i>
              </div>
              <div className="party-details-summary-info">
                <h3>{displayName()}</h3>
                <p>Desciption</p>
                <p>Id</p>
              </div>
              <div className="comp-details-section-header-actions party-details-summary-actions">
                <Button
                  variant="outline-primary"
                  size="sm"
                  id="details-screen-edit-button"
                  onClick={editButtonClick}
                >
                  <i className="bi bi-pencil"></i>
                  <span>Edit party</span>
                </Button>
              </div>
            </div>
            <br />
            <h4>Identifying information</h4>
            <div className="party-details-item">
              <p>
                <b>Name: </b>
                {displayName()}
              </p>
              {partyData && partyData?.person && (
                <p>
                  <b>Date of birth:</b>
                </p>
              )}
            </div>
            <br />
            <h4>Contact information</h4>
            <div className="party-details-item">
              <p>
                <b>TextLabel: </b>
                abc
              </p>
              <p>
                <b>TextLabel: </b>
                abc
              </p>
            </div>
            <br />
            <h4>C&E history</h4>
            <div className="party-details-item">
              <p>
                <i>&#8226; Agencies that dealt with Party, Officer, Contravention Enf Action, Site etc..</i>
              </p>
            </div>
            <br />
            <h4>Additional information</h4>
            <div className="party-details-item">
              <p>
                <i>&#8226; Related people, vehicles etc.</i>
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
