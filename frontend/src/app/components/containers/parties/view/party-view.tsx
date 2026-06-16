import { FC, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PartyHeader } from "./party-header";
import { PartyTabs } from "./party-tabs";
import { PartyHistoryTab } from "./party-history-tab";
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
  Address,
  Contravention,
} from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { PartyCarousel } from "@/app/components/containers/parties/attachments/party-carousel";
import { CaseActivities } from "@/app/constants/case-activities";
import { PartyTypes } from "@/app/constants/party-types";
import {
  selectAgencyDropdown,
  selectApproximateAgeDropdown,
  selectBuildDropdown,
  selectCodeTable,
  selectComplexionDropdown,
  selectEyeColourDropdown,
  selectFacialHairStyleDropdown,
  selectGenderDropdown,
  selectHairColourDropdown,
  selectHairLengthDropdown,
} from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import Option from "@apptypes/app/option";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { CASE_ACTIVITY_TYPES } from "@/app/constants/case-activity-types";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { calculateAgeYears, formatDateOfBirth, isYoungPerson } from "@common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { getUserAgency } from "@/app/service/user-service";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { cmToFeetInches, kgToLb } from "@/app/components/containers/parties/form/party-form-utils";
import { BUSINESS_IDENTIFIER_LABELS } from "@/app/constants/business-identifiers";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";

type PartyRelation = {
  caseId?: string | null;
  caseName?: string | null;
  activities?: PartyActivity[] | null;
  leadAgency?: string | null;
  sameAgency?: boolean;
};

type PartyActivity = {
  id?: string | null;
  name?: string | null;
  activityType?: string | null;
  leadAgency?: string | null;
  role?: string | null;
  sameAgency?: boolean;
  status: string;
  primaryInvestigatorName?: string;
  contraventions?: Contravention[] | null;
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
      updatedDateTime
      createdByUserGuid
      addresses {
        addressGuid
        addressName
        address
        city
        province
        postalCode
        country
        isPrimary
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
      }
      business {
        name
        businessGuid
        identifiers {
          businessIdentifierGuid
          identifierValue
          identifierCode
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
          }
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
`;

const GET_INVESTIGATIONS_BY_PARTY = gql`
  query GetInvestigationsByParty($partyId: String!, $partyType: String!) {
    partyHistoryInvestigations(partyId: $partyId, partyType: $partyType) {
      investigationGuid
      description
      leadAgency
      openedTimestamp
      updatedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
      investigationStatus {
        shortDescription
      }
      primaryInvestigatorGuid
      contraventions {
        contraventionIdentifier
        legislationIdentifierRef
        investigationParty {
          enforcementActions {
            enforcementActionIdentifier
            enforcementActionCode {
              enforcementActionCode
            }
          }
        }
      }
    }
  }
`;

const GET_INSPECTIONS_BY_PARTY = gql`
  query GetInspectionsByParty($partyId: String!, $partyType: String!) {
    partyHistoryInspections(partyId: $partyId, partyType: $partyType) {
      inspectionGuid
      description
      leadAgency
      openedTimestamp
      updatedTimestamp
      locationGeometry
      locationAddress
      locationDescription
      name
    }
  }
`;

const GET_CASE_FILES_BY_ACTIVITIES = gql`
  query GetCaseFilesByActivityIds($activityIdentifiers: [String!]!) {
    partyHistoryCaseFiles(activityIdentifiers: $activityIdentifiers) {
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
  tabKey?: string;
};

const PersonIdentifyingInfo: FC<{
  person: Person;
  genderOptions: ReadonlyArray<Option>;
  approximateAgeOptions: ReadonlyArray<Option>;
  countryOptions: ReadonlyArray<Option>;
  countrySubdivisionOptions: ReadonlyArray<Option>;
}> = ({ person, genderOptions, approximateAgeOptions, countryOptions, countrySubdivisionOptions }) => (
  <>
    {person.dateOfBirth !== null && (
      <p>
        <b>Date of birth: </b>
        {formatDateOfBirth(person.dateOfBirth)}
      </p>
    )}
    {person.approximateAgeCode && (
      <p>
        <b>Approximate age: </b>
        {approximateAgeOptions?.find((opt) => opt.value === person?.approximateAgeCode)?.label ??
          person.approximateAgeCode}
      </p>
    )}
    {person.driversLicenseNumber && (
      <p>
        <b>Driver's licence number: </b>
        {person.driversLicenseNumber}
      </p>
    )}
    {person.driversLicenseClass && (
      <p>
        <b>Driver's licence class: </b>
        {person.driversLicenseClass}
      </p>
    )}
    {person.driversLicenseCountryCode && (
      <p>
        <b>Driver's licence country: </b>
        {countryOptions?.find((opt) => opt.value === person?.driversLicenseCountryCode)?.label ??
          person.driversLicenseCountryCode}
      </p>
    )}
    {person.driversLicenseCountrySubdivisionCode && (
      <p>
        <b>Driver's licence province: </b>
        {countrySubdivisionOptions?.find((opt) => opt.value === person?.driversLicenseCountrySubdivisionCode)?.label ??
          person.driversLicenseCountrySubdivisionCode}
      </p>
    )}
    {person.genderCode && (
      <p>
        <b>Gender: </b>
        {genderOptions?.find((opt) => opt.value === person?.genderCode)?.label ?? person.genderCode}
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
                {partyRelation.sameAgency ? (
                  <Link to={`/case/${partyRelation.caseId}`}>{partyRelation.caseName}</Link>
                ) : (
                  <span>{partyRelation.caseName}</span>
                )}
              </b>
              <span style={{ marginLeft: "0.8em" }}></span>
              <i className="bi-building bi"></i>
              <span style={{ marginLeft: "0.2em" }}>{partyRelation.leadAgency} </span>
            </p>
            {partyRelation.activities
              ?.toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""))
              .map((activity) => (
                <div key={activity.id}>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {`${activity.activityType === CaseActivities.INVESTIGATION ? "Investigation" : "Inspection"}`}:
                    &nbsp;&nbsp;
                    {activity.sameAgency ? (
                      <Link
                        to={`/${activity.activityType === CaseActivities.INVESTIGATION ? "investigation" : "inspection"}/${activity.id}`}
                      >
                        {activity.name}
                      </Link>
                    ) : (
                      <span>{activity.name}</span>
                    )}
                    <Badge
                      style={{ marginLeft: "0.3em" }}
                      bg="species-badge comp-species-badge"
                    >
                      {activity.status}
                    </Badge>
                    <span style={{ marginLeft: "0.4em" }}></span>
                    <span>|</span>
                    <span style={{ marginLeft: "0.4em" }}>{activity.primaryInvestigatorName} </span>
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
                  {activity.status !== "Open" &&
                    activity.contraventions?.map((contravention) => (
                      <LegislationRow
                        key={contravention.contraventionIdentifier}
                        contravention={contravention}
                      />
                    ))}
                </div>
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
          {contactMethod?.typeCode === ContactMethods.PHONE
            ? formatPhoneNumber(contactMethod?.value ?? "")
            : contactMethod?.value}
          {contactMethod?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
        </p>
      );
    })}
  </>
);

const AddressesList: FC<{
  addresses: ReadonlyArray<Address>;
  countryOptions: ReadonlyArray<Option>;
  countrySubdivisionOptions: ReadonlyArray<Option>;
}> = ({ addresses, countryOptions, countrySubdivisionOptions }) => (
  <>
    {addresses.map((address, index) => (
      <div
        key={address.addressGuid ?? `address-${index}`}
        className="party-details-item"
        style={index < addresses.length - 1 ? { marginBottom: "1em" } : undefined}
      >
        <h4 className="mb-3">
          {address.addressName || `Address ${index + 1}`}
          {address.isPrimary && <Badge className="ms-2 badge">Primary</Badge>}
        </h4>
        {address.address && (
          <p>
            <b>Address: </b>
            {address.address}
          </p>
        )}
        {address.city && (
          <p>
            <b>City: </b>
            {address.city}
          </p>
        )}
        {address.province && (
          <p>
            <b>Province: </b>
            {countrySubdivisionOptions?.find((opt) => opt.value === address?.province)?.label ?? address.province}
          </p>
        )}
        {address.postalCode && (
          <p>
            <b>Postal code: </b>
            {address.postalCode}
          </p>
        )}
        {address.country && (
          <p>
            <b>Country: </b>
            {countryOptions?.find((opt) => opt.value === address?.country)?.label ?? address.country}
          </p>
        )}
      </div>
    ))}
  </>
);

type LegislationRowProps = {
  contravention: Contravention;
};

const LegislationRow = ({ contravention }: LegislationRowProps) => {
  const legislation = useLegislation(contravention?.legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;
  const displayText = legislationData?.alternateText ?? legislationData?.legislationText;
  const enforcementActions = useAppSelector((state) => state.codeTables["enforcement-action-type"]);

  console.log(contravention);

  return (
    <>
      <p style={{ marginLeft: "2em" }}>{displayText}</p>
      {contravention.investigationParty![0]?.enforcementActions?.map((e) => (
        <p key={e?.enforcementActionIdentifier}>
          <span style={{ marginLeft: "5em" }}>
            {enforcementActions.find(
              (ea) => ea.enforcementActionCode === e?.enforcementActionCode.enforcementActionCode,
            )?.shortDescription ?? ""}
          </span>
        </p>
      ))}
    </>
  );
};

export const PartyView: FC = () => {
  const { id = "", tabKey } = useParams<PartyParams>();
  const navigate = useNavigate();
  const currentTab = tabKey || "details";
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const genderOptions = useAppSelector(selectGenderDropdown);
  const approximateAgeOptions = useAppSelector(selectApproximateAgeDropdown);
  const countryOptions = useAppSelector(selectCountries);
  const countrySubdivisionOptions = useAppSelector(selectCountrySubdivisions);
  const complexionOptions = useAppSelector(selectComplexionDropdown);
  const buildOptions = useAppSelector(selectBuildDropdown);
  const hairColourOptions = useAppSelector(selectHairColourDropdown);
  const hairLengthOptions = useAppSelector(selectHairLengthDropdown);
  const eyeColourOptions = useAppSelector(selectEyeColourDropdown);
  const facialHairStyleOptions = useAppSelector(selectFacialHairStyleDropdown);

  const { data, isLoading } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: !!id,
  });

  const partyData = data?.party;

  const addresses = (partyData?.addresses ?? []).filter((a): a is Address => a != null);

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
      const parts = [partyData.person?.firstName, partyData.person?.middleNames, partyData.person?.lastName].filter(
        Boolean,
      );
      result = parts.join(" ");
    } else if (partyData?.business) {
      result = `${partyData.business?.name}`;
    }
    return result;
  };

  const personDob = partyData?.person?.dateOfBirth ? new Date(partyData.person.dateOfBirth) : null;
  const personIsYoung = partyData?.person ? isYoungPerson(personDob, partyData.person.approximateAgeCode) : false;

  const imperialHeight = cmToFeetInches(partyData?.person?.heightInCm ?? 0);
  const imperialWeight = kgToLb(partyData?.person?.weightInKg ?? 0);

  const getPartyRoleText = (roleCode: string, activityType: string) => {
    const partyRoleText: string = partyRoles.find(
      (partyRole) => partyRole.partyAssociationRole === roleCode && partyRole.caseActivityTypeCode === activityType,
    )?.shortDescription;
    return partyRoleText;
  };

  const officers = useAppSelector(selectOfficers);

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
    },
    [officers],
  );

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

    const userAgency = getUserAgency();

    const relatedInvestigationsIds = relatedInvestigations?.map((investigation) => investigation.investigationGuid);
    const relatedInspectionIds = relatedInspections?.map((inspection) => inspection.inspectionGuid);

    const activityIds = [...(relatedInvestigationsIds ?? []), ...(relatedInspectionIds ?? [])];

    const { data: caseData, isLoading: isCaseLoading } = useGraphQLQuery<{
      partyHistoryCaseFiles: CaseFile[];
    }>(GET_CASE_FILES_BY_ACTIVITIES, {
      queryKey: ["activities", activityIds],
      variables: { activityIdentifiers: activityIds },
      enabled: !!activityIds && activityIds.length > 0,
    });

    const relatedCases = caseData?.partyHistoryCaseFiles;

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
      partyRelation.sameAgency = currentCase?.leadAgency?.agencyCode === userAgency;

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
            sameAgency: currenInvestigation?.leadAgency === userAgency,
            status: currenInvestigation?.investigationStatus?.shortDescription ?? "",
            primaryInvestigatorName: getOfficerName(currenInvestigation?.primaryInvestigatorGuid ?? ""),
            contraventions: (currenInvestigation?.contraventions as Contravention[]) ?? null,
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
            sameAgency: currenInspection?.leadAgency === userAgency,
            status: currenInspection?.inspectionStatus?.shortDescription ?? "",
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
      partyHistoryInvestigations: Investigation[];
    }>(GET_INVESTIGATIONS_BY_PARTY, {
      queryKey: ["InvestigationParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInvestigations = investigationData?.partyHistoryInvestigations ?? [];

    const { data: inspectionData, isLoading: isInspectionLoading } = useGraphQLQuery<{
      partyHistoryInspections: Inspection[];
    }>(GET_INSPECTIONS_BY_PARTY, {
      queryKey: ["InspectionParty", id],
      variables: { partyId, partyType },
      enabled: !!partyId && !!partyType,
    });

    const relatedInspections = inspectionData?.partyHistoryInspections ?? [];

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
          <PartyTabs />
          {currentTab === "history" ? (
            <PartyHistoryTab partyIdentifier={id} />
          ) : (
            <section className="comp-details-body comp-container party-details-section">
              <hr className="comp-details-body-spacer"></hr>
              <h2>Party details</h2>
              <div className="party-details-summary-container">
                <div className="party-details-summary-vcard-container">{id ? <PartyCarousel partyId={id} /> : ""}</div>
                <div className="party-details-summary-info">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="mb-0">{displayName()}</h3>
                    {partyData?.person?.boloIndicator && <Badge className="comp-danger-badge">Caution / BOLO</Badge>}
                  </div>
                  {partyData?.business?.identifiers && (
                    <>
                      {partyData.business.identifiers.map((identifier) => {
                        return (
                          <p key={identifier?.businessIdentifierGuid}>
                            <b>
                              {BUSINESS_IDENTIFIER_LABELS[identifier?.identifierCode ?? ""] ??
                                identifier?.identifierCode}
                              :{" "}
                            </b>
                            {identifier?.identifierValue}
                          </p>
                        );
                      })}
                    </>
                  )}{" "}
                  {(personDob || personIsYoung) && (
                    <p className="d-flex align-items-center gap-2">
                      {personDob && (
                        <span>
                          <b>Age: </b>
                          {calculateAgeYears(personDob)}
                        </span>
                      )}
                      {personIsYoung && <Badge bg="species-badge comp-species-badge">Young person</Badge>}
                    </p>
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
                {partyData?.aliases && (
                  <>
                    {partyData.aliases.map((alias) => {
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
                    genderOptions={genderOptions}
                    approximateAgeOptions={approximateAgeOptions}
                    countryOptions={countryOptions}
                    countrySubdivisionOptions={countrySubdivisionOptions}
                  />
                )}
              </div>
              <br />
              {partyRelations && partyRelations.length > 0 && (
                <AssociatedCasesAndActivities partyRelations={partyRelations} />
              )}
              <br />
              <h4>Contact information</h4>

              <div className="party-details-item">
                {partyData?.contactMethods && partyData.contactMethods.length > 0 && (
                  <ContactMethodsList contactMethods={partyData.contactMethods as ReadonlyArray<ContactMethod>} />
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
                          {contactPerson?.contactMethods && (
                            <ContactMethodsList
                              contactMethods={contactPerson.contactMethods as ReadonlyArray<ContactMethod>}
                            />
                          )}
                          {index < (partyData.business?.contactPeople?.length ?? 0) - 1 && <hr />}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              {addresses?.length > 0 && (
                <>
                  <br />
                  <h4>Addresses</h4>
                  <AddressesList
                    addresses={addresses}
                    countryOptions={countryOptions}
                    countrySubdivisionOptions={countrySubdivisionOptions}
                  />
                </>
              )}

              {partyData?.person && (
                <>
                  <br />
                  <h4>Physical descriptors</h4>
                  <div className="party-details-item">
                    {partyData?.person?.heightInCm && (
                      <p>
                        <b>Height: </b>
                        {partyData?.person?.heightInCm} cm ({imperialHeight.feet} feet {imperialHeight.inches} inches)
                      </p>
                    )}
                    {partyData?.person?.weightInKg && (
                      <p>
                        <b>Weight: </b>
                        {partyData?.person?.weightInKg} kg ({imperialWeight} lbs)
                      </p>
                    )}
                    {partyData?.person?.complexionCode && (
                      <p>
                        <b>Complexion: </b>
                        {complexionOptions?.find((opt) => opt.value === partyData?.person?.complexionCode)?.label ??
                          partyData?.person.complexionCode}
                      </p>
                    )}
                    {partyData?.person?.buildCode && (
                      <p>
                        <b>Build: </b>
                        {buildOptions?.find((opt) => opt.value === partyData?.person?.buildCode)?.label ??
                          partyData?.person.buildCode}
                      </p>
                    )}
                    {partyData?.person?.eyeColourCode && (
                      <p>
                        <b>Eye colour: </b>
                        {eyeColourOptions?.find((opt) => opt.value === partyData?.person?.eyeColourCode)?.label ??
                          partyData?.person.eyeColourCode}
                        {partyData?.person?.eyeColourOther && ` (${partyData?.person?.eyeColourOther})`}
                      </p>
                    )}
                    {partyData?.person?.hairColourCode && (
                      <p>
                        <b>Hair colour: </b>
                        {hairColourOptions?.find((opt) => opt.value === partyData?.person?.hairColourCode)?.label ??
                          partyData?.person.hairColourCode}
                        {partyData?.person?.hairColourOther && ` (${partyData?.person?.hairColourOther})`}
                      </p>
                    )}
                    {partyData?.person?.hairLengthCode && (
                      <p>
                        <b>Hair length: </b>
                        {hairLengthOptions?.find((opt) => opt.value === partyData?.person?.hairLengthCode)?.label ??
                          partyData?.person.hairLengthCode}
                      </p>
                    )}
                    {partyData?.person?.facialHairIndicator != null && (
                      <p>
                        <b>Has facial hair: </b>
                        {partyData.person.facialHairIndicator ? "Yes" : "No"}
                      </p>
                    )}
                    {partyData?.person?.facialHairStyleCodes && (
                      <>
                        {partyData.person.facialHairStyleCodes.map((fhs) => {
                          return (
                            <p key={fhs?.personFacialStyleHairCodeGuid}>
                              <b>Facial hair style: </b>
                              {facialHairStyleOptions?.find((opt) => opt.value === fhs?.facialHairStyleCode)?.label ??
                                fhs?.facialHairStyleCode}
                            </p>
                          );
                        })}
                      </>
                    )}
                    {partyData?.person?.additionalHairDescriptors && (
                      <p>
                        <b>Additional hair descriptors: </b>
                        {partyData?.person?.additionalHairDescriptors}
                      </p>
                    )}
                    {partyData?.person?.tattooIndicator != null && (
                      <p>
                        <b>Has tattoos: </b>
                        {partyData.person.tattooIndicator ? "Yes" : "No"}
                      </p>
                    )}
                    {partyData?.person?.tattooDescription && (
                      <p>
                        <b>Tattoo description: </b>
                        {partyData?.person?.tattooDescription}
                      </p>
                    )}
                    {partyData?.person?.additionalDescriptors && (
                      <p>
                        <b>Additional descriptors: </b>
                        {partyData?.person?.additionalDescriptors}
                      </p>
                    )}
                  </div>
                </>
              )}
              <br />
              <h4>C&E history</h4>
              <div className="party-details-item">
                <p>
                  <i>&#8226; Agencies that dealt with Party, Officer, Contravention Enf Action, Site etc..</i>
                </p>
              </div>
              <br />
              {partyData?.person?.comments && (
                <>
                  <h4>Additional information</h4>
                  <div className="party-details-item">
                    <p>
                      {partyData?.person?.comments && (
                        <p>
                          <b>Comments: </b>
                          {partyData?.person?.comments}
                        </p>
                      )}
                    </p>
                  </div>
                  <br />
                </>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
};
