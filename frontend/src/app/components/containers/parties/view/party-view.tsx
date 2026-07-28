import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PartyHeader } from "./party-header";
import { PartyTabs } from "./party-tabs";
import { PartyHistoryTab } from "./party-history-tab";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { Party } from "@/generated/graphql";
import { Button } from "react-bootstrap";
import PartyDetail from "@/app/components/containers/parties/view/party-detail/party-detail";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { isYoungPerson } from "@/app/common/methods";
import { getPartyName } from "@/app/common/party-name";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";
import {
  DetailField,
  DetailSection,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";

export const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      updatedDateTime
      createdByUserGuid
      addresses {
        contactMethods {
          contactMethodGuid
          typeCode
          value
          isPrimary
        }
        addressGuid
        addressName
        address
        city
        province
        postalCode
        country
        isPrimary
        displayInInvestigation
      }
      contactMethods {
        contactMethodGuid
        typeCode
        typeDescription
        value
        isPrimary
      }
      aliases {
        aliasGuid
        name
      }
      person {
        personGuid
        firstName
        middleNames
        lastName
        dateOfBirth
        approximateAgeCode
        driversLicenseNumber
        driversLicenseClass
        driversLicenseCountryCode
        driversLicenseCountrySubdivisionCode
        genderCode
        sexCode
        heightInCm
        weightInKg
        complexionCode
        buildCode
        hairColourCode
        hairLengthCode
        hairColourOther
        eyeColourCode
        eyeColourOther
        facialHairIndicator
        facialHairStyleCodes {
          personFacialStyleHairCodeGuid
          facialHairStyleCode
        }
        additionalHairDescriptors
        tattooIndicator
        tattooDescription
        additionalDescriptors
        comments
        boloIndicator
        boloComment
      }
      business {
        name
        businessGuid
        boloIndicator
        boloComment
        businessIdentifiers {
          businessIdentifierGuid
          identifierValue
          identifierCode
        }
        contactPeople {
          businessPersonXrefGuid
          title
          displayInInvestigation
          isPrimary
          business {
            businessGuid
          }
          person {
            personGuid
            firstName
            lastName
          }
          contactMethods {
            contactMethodGuid
            typeCode
            typeDescription
            value
            isPrimary
          }
          associatedAddresses {
            address {
              addressGuid
              addressName
            }
          }
        }
      }
    }
  }
`;

export type PartyParams = {
  id: string;
  tabKey?: string;
};

export const PartyView: FC = () => {
  const { id = "", tabKey } = useParams<PartyParams>();
  const navigate = useNavigate();
  const currentTab = tabKey || "details";

  const { data, isLoading } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: !!id,
  });

  const partyData = data?.party;

  const editButtonClick = () => {
    navigate(`/party/${id}/edit`);
  };

  const backToParties = () => navigate(`/parties/`);

  const personDob = partyData?.person?.dateOfBirth ? new Date(partyData.person.dateOfBirth) : null;
  const personIsYoung = partyData?.person ? isYoungPerson(personDob, partyData.person.approximateAgeCode) : false;

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
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
          <PartyHeader
            title={getPartyName(partyData)}
            badges={
              <PartyBadges
                isSafetyConcern={!!(partyData?.person?.boloIndicator || partyData?.business?.boloIndicator)}
                isYoungPerson={personIsYoung}
              />
            }
            actions={
              <>
                <Button
                  variant="outline-light"
                  onClick={backToParties}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Parties</span>
                </Button>
                {editButtonClick && (
                  <Button
                    variant="outline-light"
                    id="party-detail-edit-button"
                    onClick={editButtonClick}
                  >
                    <i className="bi bi-pencil"></i>
                    <span>Edit party</span>
                  </Button>
                )}
              </>
            }
          />
          <PartyTabs />
          {currentTab === "history" ? (
            <PartyHistoryTab partyIdentifier={id} />
          ) : (
            <section className="comp-details-body comp-container party-details-section">
              <hr className="comp-details-body-spacer"></hr>
              {(partyData?.person?.boloComment || partyData?.business?.boloComment) && (
                <DetailSection title="">
                  {partyData?.person?.boloComment && (
                    <DetailField label="Safety concern reason">{partyData?.person?.boloComment}</DetailField>
                  )}
                  {partyData?.business?.boloComment && (
                    <DetailField label="Safety concern reason">{partyData?.business?.boloComment}</DetailField>
                  )}
                </DetailSection>
              )}

              <PartyDetail
                party={partyData}
                attachmentType={AttachmentEnum.PARTY_ATTACHMENT}
              />
            </section>
          )}
        </div>
      )}
    </>
  );
};
