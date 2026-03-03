import { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PartyHeader } from "./party-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import {
  Party,
  Investigation,
  Inspection,
  CaseFile,
  InspectionParty,
  InvestigationParty,
  Person,
  ContactMethod,
} from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { CaseActivities } from "@/app/constants/case-activities";
import { PartyTypes } from "@/app/constants/party-types";
import { selectAgencyDropdown, selectCodeTable, selectSexDropdown } from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import Option from "@apptypes/app/option";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { CASE_ACTIVITY_TYPES } from "@/app/constants/case-activity-types";
import { formatPhoneNumber } from "react-phone-number-input/input";
<<<<<<< HEAD
=======
import { formatDate } from "@common/methods";
>>>>>>> release/2.18

type PartyRelation = {
  caseId?: string | null;
  caseName?: string | null;
  activities?: PartyActivity[] | null;
  leadAgency?: string | null;
};

type PartyActivity = {
  id?: string | null;
  name?: string | null;
  activityType?: string | null;
  leadAgency?: string | null;
  role?: string | null;
};

export const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        middleName
        middleName2
        lastName
        dateOfBirth
        driversLicenseNumber
        driversLicenseJurisdiction
        sexCode
        contactMethods {
          contactMethodGuid
          typeCode
          typeDescription
          value
          isPrimary
        }
      }
      business {
        name
        businessGuid
        aliases {
          aliasGuid
          name
        }
        identifiers {
          businessIdentifierGuid
          identifierValue
          identifierCode {
            businessIdentifierCode
            shortDescription
          }
        }
        contactMethods {
          contactMethodGuid
          typeCode
          typeDescription
          value
          isPrimary
        }
        contactPeople {
          businessPersonXrefGuid
          business {
            businessGuid
          }
          person {
            personGuid
            firstName
            lastName
            contactMethods {
              contactMethodGuid
              typeCode
              typeDescription
              value
              isPrimary
            }
          }
        }
      }
    }
  }
`;

const GET_INVESTIGATIONS_BY_PARTY = gql`
  query GetInvestigationsByParty($partyId: String!, $partyType: String!) {
    getInvestigationsByParty(partyId: $partyId, partyType: $partyType) {
      investigationGuid
      description
      leadAgency
      openedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
    }
  }
`;

const GET_INSPECTIONS_BY_PARTY = gql`
  query GetInspectionsByParty($partyId: String!, $partyType: String!) {
    getInspectionsByParty(partyId: $partyId, partyType: $partyType) {
      inspectionGuid
      description
      leadAgency
      openedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
    }
  }
`;

const GET_CASE_FILES_BY_ACTIVITIES = gql`
  query GetCaseFilesByActivityIds($activityIdentifiers: [String!]!) {
    caseFilesByActivityIds(activityIdentifiers: $activityIdentifiers) {
      caseIdentifier
      name
      leadAgency {
        agencyCode
      }
      activities {
        activityIdentifier
      }
    }
  }
`;

const GET_INSPECTION_PARTY_ROLES = gql`
  query GetInspectionPartyByReference($partyRefId: String!) {
    InspectionParties(partyRefId: $partyRefId) {
      inspectionGuid
      partyReference
      partyAssociationRole
    }
  }
`;

const GET_INVESTIGATION_PARTY_ROLES = gql`
  query GetInvestigationPartyByReference($partyRefId: String!) {
    InvestigationParties(partyRefId: $partyRefId) {
      investigationGuid
      partyReference
      partyAssociationRole
    }
  }
`;

export type PartyParams = {
  id: string;
};

// Use date-only (YYYY-MM-DD) for display so stored calendar date is shown without timezone shift
const formatDateOfBirth = (date: string | undefined | null) => {
  if (date == null) return "";
  const dateOnly = String(date).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(dateOnly) ? formatDate(dateOnly) : formatDate(date);
};

const PersonIdentifyingInfo: FC<{ person: Person; sexOptions: ReadonlyArray<Option> }> = ({ person, sexOptions }) => (
  <>
    {person.dateOfBirth !== null && (
      <p>
        <b>Date of birth: </b>
        {formatDateOfBirth(person.dateOfBirth)}
      </p>
    )}
    {person.driversLicenseNumber && (
      <p>
        <b>Driver's licence number: </b>
        {person.driversLicenseNumber}
      </p>
    )}
    {person.driversLicenseJurisdiction && (
      <p>
        <b>Driver's licence jurisdiction: </b>
        {person.driversLicenseJurisdiction}
      </p>
    )}
    {person.sexCode && (
      <p>
        <b>Sex: </b>
        {sexOptions?.find((opt) => opt.value === person?.sexCode)?.label ?? person.sexCode}
      </p>
    )}
  </>
);

const AssociatedCasesAndActivities: FC<{ partyRelations: PartyRelation[] }> = ({ partyRelations }) => (
  <>
    <br />
    <h4>Associated cases and activities</h4>
    <div className="party-details-item">
      {partyRelations
        .toSorted((left, right) => (left.caseName ?? "").localeCompare(right.caseName ?? ""))
        .map((partyRelation) => (
          <div key={partyRelation.caseId}>
            <p>
              <b>
                Case:&nbsp;&nbsp;
                <Link to={`/case/${partyRelation.caseId}`}>{partyRelation.caseName}</Link>
              </b>
              <span style={{ marginLeft: "0.8em" }}></span>
              <i className="bi-building bi"></i>
              <span style={{ marginLeft: "0.2em" }}>{partyRelation.leadAgency} </span>
            </p>
            {partyRelation.activities
              ?.toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""))
              .map((activity) => (
                <p key={activity.id}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {`${activity.activityType === CaseActivities.INVESTIGATION ? "Investigation" : "Inspection"}`}:
                  &nbsp;&nbsp;
                  <Link
                    to={`/${activity.activityType === CaseActivities.INVESTIGATION ? "investigation" : "inspection"}/${activity.id}`}
                  >
                    {activity.name}
                  </Link>
                  <span style={{ marginLeft: "0.4em" }}></span>
                  <span>|</span>
                  <i
                    style={{ marginLeft: "0.3em" }}
                    className="bi bi-building"
                  ></i>
                  <span style={{ marginLeft: "0.1em" }}>{activity.leadAgency} </span>
                  <span style={{ marginLeft: "0.1em" }}>|</span>
                  <Badge
                    style={{ marginLeft: "0.3em" }}
                    bg="species-badge comp-species-badge"
                  >
                    {activity.role}
                  </Badge>
                </p>
              ))}
          </div>
        ))}
    </div>
  </>
);

const ContactMethodsList: FC<{ contactMethods: ReadonlyArray<ContactMethod> }> = ({ contactMethods }) => (
  <>
    {contactMethods.map((contactMethod) => {
      return (
        <p key={contactMethod?.contactMethodGuid}>
          <b>{contactMethod?.typeDescription}: </b>
          {contactMethod?.typeCode === "PHONE" ? formatPhoneNumber(contactMethod?.value ?? "") : contactMethod?.value}
          {contactMethod?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
        </p>
      );
    })}
  </>
);

export const PartyView: FC = () => {
  const { id = "" } = useParams<PartyParams>();
  const navigate = useNavigate();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const sexOptions = useAppSelector(selectSexDropdown);

  const { data, isLoading } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: !!id,
  });

  const partyData = data?.party;

  let partyType;
  let partyId;
  if (partyData?.person) {
    partyType = PartyTypes.PERSON;
    partyId = partyData?.person?.personGuid;
  } else if (partyData?.business) {
    partyType = PartyTypes.BUSINESS;
    partyId = partyData?.business?.businessGuid;
  }

  const editButtonClick = () => {
    navigate(`/party/${id}/edit`);
  };

  const displayName = () => {
    let result = "";
    if (partyData?.person) {
      const parts = [
        partyData.person?.firstName,
        partyData.person?.middleName,
        partyData.person?.middleName2,
        partyData.person?.lastName,
      ].filter(Boolean);
      result = parts.join(" ");
    } else if (partyData?.business) {
      result = `${partyData.business?.name}`;
    }
    return result;
  };

  const getPartyRoleText = (roleCode: string, activityType: string) => {
    const partyRoleText: string = partyRoles.find(
      (partyRole) => partyRole.partyAssociationRole === roleCode && partyRole.caseActivityTypeCode === activityType,
    )?.shortDescription;
    return partyRoleText;
  };

  const GetPartyRelations = (
    partyId: string,
    partyType: string,
  ): {
    partyRelations: PartyRelation[];
    isPartyRelationLoading: boolean;
  } => {
    const { relatedInvestigations, relatedInspections, isActivityLoading } = GetRelatedActivities(
      partyId ?? "",
      partyType ?? "",
    );

    const partyRelations = [];

    const relatedInvestigationsIds = relatedInvestigations?.map((investigation) => investigation.investigationGuid);
    const relatedInspectionIds = relatedInspections?.map((inspection) => inspection.inspectionGuid);

    const activityIds = [...(relatedInvestigationsIds ?? []), ...(relatedInspectionIds ?? [])];

    const { data: caseData, isLoading: isCaseLoading } = useGraphQLQuery<{
      caseFilesByActivityIds: CaseFile[];
    }>(GET_CASE_FILES_BY_ACTIVITIES, {
      queryKey: ["activities", activityIds],
      variables: { activityIdentifiers: activityIds },
      enabled: !!activityIds && activityIds.length > 0,
    });

    const relatedCases = caseData?.caseFilesByActivityIds;

    const uniqueCaseIds = [...new Set(relatedCases?.map((item) => item.caseIdentifier))];

    const { rolesInInvestigations, rolesInInspections, isPartyRoleLoading } = GetPartyRoles(id);

    for (let uniqueCaseId of uniqueCaseIds) {
      const partyRelation: PartyRelation = {};
      const currentCase = relatedCases?.find((relatedCase) => relatedCase.caseIdentifier === uniqueCaseId);
      partyRelation.caseId = uniqueCaseId;
      partyRelation.caseName = currentCase?.name;
      partyRelation.activities = [];
      partyRelation.leadAgency = leadAgencyOptions.find(
        (option: Option) => option.value === currentCase?.leadAgency?.agencyCode,
      )?.label;

      for (let caseActivity of currentCase?.activities ?? []) {
        const currenInvestigation = relatedInvestigations?.find(
          (relatedInvestigation) => relatedInvestigation.investigationGuid === caseActivity?.activityIdentifier,
        );

        if (currenInvestigation) {
          partyRelation.activities.push({
            id: currenInvestigation.investigationGuid,
            name: currenInvestigation.name,
            activityType: CaseActivities.INVESTIGATION,
            leadAgency: leadAgencyOptions.find((option: Option) => option.value === currenInvestigation?.leadAgency)
              ?.label,
            role: getPartyRoleText(
              rolesInInvestigations.find(
                (investigation) => investigation.investigationGuid === currenInvestigation.investigationGuid,
              )?.partyAssociationRole ?? "",
              CASE_ACTIVITY_TYPES.INVESTIGATION,
            ),
          });
        }

        const currenInspection = relatedInspections?.find(
          (relatedInspection) => relatedInspection.inspectionGuid === caseActivity?.activityIdentifier,
        );
        if (currenInspection) {
          partyRelation.activities.push({
            id: currenInspection.inspectionGuid,
            name: currenInspection.name,
            activityType: CaseActivities.INSPECTION,
            leadAgency: leadAgencyOptions.find((option: Option) => option.value === currenInspection?.leadAgency)
              ?.label,
            role: getPartyRoleText(
              rolesInInspections.find((inspection) => inspection.inspectionGuid === currenInspection.inspectionGuid)
                ?.partyAssociationRole ?? "",
              CASE_ACTIVITY_TYPES.INSPECTION,
            ),
          });
        }
      }
      partyRelations.push(partyRelation);
    }
    const isPartyRelationLoading = isActivityLoading || isCaseLoading || isPartyRoleLoading;

    return { partyRelations, isPartyRelationLoading };
  };

  const GetRelatedActivities = (
    partyId: string,
    partyType: string,
  ): {
    relatedInvestigations: Investigation[];
    relatedInspections: Inspection[];
    isActivityLoading: boolean;
  } => {
    const { data: investigationData, isLoading: isInvestigationLoading } = useGraphQLQuery<{
      getInvestigationsByParty: Investigation[];
    }>(GET_INVESTIGATIONS_BY_PARTY, {
      queryKey: ["InvestigationParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInvestigations = investigationData?.getInvestigationsByParty ?? [];

    const { data: inspectionData, isLoading: isInspectionLoading } = useGraphQLQuery<{
      getInspectionsByParty: Inspection[];
    }>(GET_INSPECTIONS_BY_PARTY, {
      queryKey: ["InspectionParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInspections = inspectionData?.getInspectionsByParty ?? [];

    const isActivityLoading = isInspectionLoading || isInvestigationLoading;

    return { relatedInvestigations, relatedInspections, isActivityLoading };
  };

  const GetPartyRoles = (
    id: string,
  ): {
    rolesInInvestigations: InvestigationParty[];
    rolesInInspections: InspectionParty[];
    isPartyRoleLoading: boolean;
  } => {
    const { data: rolesInInvestigationsData, isLoading: isInvestigationRoleLoading } = useGraphQLQuery<{
      InvestigationParties: InvestigationParty[];
    }>(GET_INVESTIGATION_PARTY_ROLES, {
      queryKey: ["InvestigationPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInvestigations = rolesInInvestigationsData?.InvestigationParties ?? [];

    const { data: rolesInInspectionsData, isLoading: isInspectionRoleLoading } = useGraphQLQuery<{
      InspectionParties: InspectionParty[];
    }>(GET_INSPECTION_PARTY_ROLES, {
      queryKey: ["InspectionPartyRoles", id],
      variables: { partyRefId: id },
      enabled: !!id,
    });

    const rolesInInspections = rolesInInspectionsData?.InspectionParties ?? [];

    const isPartyRoleLoading = isInvestigationRoleLoading || isInspectionRoleLoading;

    return { rolesInInvestigations, rolesInInspections, isPartyRoleLoading };
  };

  const { partyRelations, isPartyRelationLoading } = GetPartyRelations(partyId ?? "", partyType ?? "");

  if (isLoading || isPartyRelationLoading) {
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
                {partyData?.business?.identifiers && (
                  <>
                    {partyData.business.identifiers.map((identifier) => {
                      return (
                        <p key={identifier?.businessIdentifierGuid}>
                          <b>{identifier?.identifierCode?.shortDescription}: </b>
                          {identifier?.identifierValue}
                        </p>
                      );
                    })}
                  </>
                )}
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
              {partyData?.business?.aliases && (
                <>
                  {partyData.business.aliases.map((alias) => {
                    return (
                      <p key={alias?.aliasGuid}>
                        <b>Alias: </b>
                        {alias?.name}
                      </p>
                    );
                  })}
                </>
              )}
              {partyData?.person && (
                <PersonIdentifyingInfo
                  person={partyData.person}
                  sexOptions={sexOptions}
                />
              )}
            </div>
            {partyRelations && partyRelations.length > 0 && (
<<<<<<< HEAD
              <>
                <br />
                <h4>Associated cases and activities</h4>
                <div className="party-details-item">
                  {partyRelations
                    .toSorted((left, right) => (left.caseName ?? "").localeCompare(right.caseName ?? ""))
                    .map((partyRelation) => (
                      <div key={partyRelation.caseId}>
                        <p>
                          <b>
                            Case:&nbsp;&nbsp;
                            <Link to={`/case/${partyRelation.caseId}`}>{partyRelation.caseName}</Link>
                          </b>
                          <span style={{ marginLeft: "0.8em" }}></span>
                          <i className="bi-building bi"></i>
                          <span style={{ marginLeft: "0.2em" }}>{partyRelation.leadAgency} </span>
                        </p>
                        {partyRelation.activities
                          ?.toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""))
                          .map((activity) => (
                            <p key={activity.id}>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              {`${activity.activityType === CaseActivities.INVESTIGATION ? "Investigation" : "Inspection"}`}
                              : &nbsp;&nbsp;
                              <Link
                                to={`/${activity.activityType === CaseActivities.INVESTIGATION ? "investigation" : "inspection"}/${activity.id}`}
                              >
                                {activity.name}
                              </Link>
                              <span style={{ marginLeft: "0.4em" }}></span>
                              <span>|</span>
                              <i
                                style={{ marginLeft: "0.3em" }}
                                className="bi bi-building"
                              ></i>
                              <span style={{ marginLeft: "0.1em" }}>{activity.leadAgency} </span>
                              <span style={{ marginLeft: "0.1em" }}>|</span>
                              <Badge
                                style={{ marginLeft: "0.3em" }}
                                bg="species-badge comp-species-badge"
                              >
                                {activity.role}
                              </Badge>
                            </p>
                          ))}
                      </div>
                    ))}
                </div>
              </>
=======
              <AssociatedCasesAndActivities partyRelations={partyRelations} />
>>>>>>> release/2.18
            )}
            <br />
            <h4>Contact information</h4>

            <div className="party-details-item">
<<<<<<< HEAD
              {partyData?.business?.contactMethods && (
                <>
                  {partyData.business.contactMethods.map((contactMethod) => {
                    return (
                      <p key={contactMethod?.contactMethodGuid}>
                        <b>{contactMethod?.typeDescription}: </b>
                        {contactMethod?.typeCode === "PHONE"
                          ? formatPhoneNumber(contactMethod?.value ?? "")
                          : contactMethod?.value}
                        {contactMethod?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                      </p>
                    );
                  })}
                </>
=======
              {partyData?.person?.contactMethods && partyData.person.contactMethods.length > 0 && (
                <ContactMethodsList contactMethods={partyData.person.contactMethods as ReadonlyArray<ContactMethod>} />
              )}
              {partyData?.business?.contactMethods && (
                <ContactMethodsList
                  contactMethods={partyData.business.contactMethods as ReadonlyArray<ContactMethod>}
                />
>>>>>>> release/2.18
              )}
              {partyData?.business?.contactPeople && (
                <>
                  <h4>Business contacts</h4>
                  {partyData.business.contactPeople.map((contactPerson, index) => {
                    return (
                      <div key={contactPerson?.person?.personGuid}>
                        <p>
                          <b>Name: </b>
                          {contactPerson?.person?.lastName}, {contactPerson?.person?.firstName}
                        </p>
<<<<<<< HEAD
                        {contactPerson?.person?.contactMethods?.map((contactMethod) => {
                          return (
                            <p key={contactMethod?.contactMethodGuid}>
                              <b>{contactMethod?.typeDescription}: </b>
                              {contactMethod?.typeCode === "PHONE"
                                ? formatPhoneNumber(contactMethod?.value ?? "")
                                : contactMethod?.value}
                              {contactMethod?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                            </p>
                          );
                        })}
=======
                        {contactPerson?.person?.contactMethods && (
                          <ContactMethodsList
                            contactMethods={contactPerson.person.contactMethods as ReadonlyArray<ContactMethod>}
                          />
                        )}
>>>>>>> release/2.18
                        {index < (partyData.business?.contactPeople?.length ?? 0) - 1 && <hr />}
                      </div>
                    );
                  })}
                </>
              )}
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
