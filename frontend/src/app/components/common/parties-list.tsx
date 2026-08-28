import { useAppSelector } from "@/app/hooks/hooks";
import {
  InspectionParty,
  InvestigationAddress,
  InvestigationAlias,
  InvestigationBusiness,
  InvestigationBusinessPerson,
  InvestigationContactMethod,
  InvestigationParty,
  InvestigationPerson,
} from "@/generated/graphql";
import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { CaseActivities } from "@/app/constants/case-activities";
import { ContactMethods } from "@/app/constants/contact-methods";
import { formatPhoneNumber } from "react-phone-number-input";
import { isYoungPerson, joinWithAnd, toSentenceCase, toPlural } from "@/app/common/methods";
import { getPartyName } from "@/app/common/party-name";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";

const PARTY_ROLE_DISPLAY_ORDER = ["PTYOFINTRST", "ASSCTE", "WITNESS", "EXTRNLOFFCR", "OTHER"];

// Can we genercize this in the future?
interface Props {
  companies?: (InvestigationParty | InspectionParty)[];
  people?: (InvestigationParty | InspectionParty)[];
  parties?: (InvestigationParty | InspectionParty)[];
  onRemoveParty?: (partyIdentifier: string, partyName: string) => void;
  onViewParty?: (partyIdentifier: string) => void;
  onUpdateParty?: (partyIdentifier: string) => void;
  activityType: string;
}

const PartiesList: React.FC<Props> = ({
  companies,
  people,
  parties,
  onRemoveParty,
  onViewParty,
  onUpdateParty,
  activityType,
}) => {
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));

  const isInvestigation = activityType === CaseActivities.INVESTIGATION;

  let currentActivityTypeCode = "";
  if (activityType === CaseActivities.INSPECTION) {
    currentActivityTypeCode = "INSPECTION";
  } else if (isInvestigation) {
    currentActivityTypeCode = "INVSTGTN";
  }

  const sortPartiesByName = (
    list: (InvestigationParty | InspectionParty)[],
  ): (InvestigationParty | InspectionParty)[] =>
    [...list].sort((a, b) => getPartyName(a).localeCompare(getPartyName(b)));

  const getPartyKey = (party: InvestigationParty | InspectionParty): string =>
    party.person?.personGuid ?? party.business?.businessGuid ?? party.partyIdentifier;

  const getPartyRemoveName = (party: InvestigationParty | InspectionParty): string => {
    if (party.person) return `${party.person.firstName} ${party.person.lastName}`;
    if (party.business) return party.business.name ?? "";
    return "-";
  };

  const getDateOfBirth = (person: InvestigationPerson): string => {
    if (person.dateOfBirth) {
      return String(person.dateOfBirth).slice(0, 10);
    }
    if (person.approximateAgeCode) {
      return (
        approximateAgeCodes?.find((code: any) => code.approximateAgeCode === person.approximateAgeCode)
          ?.shortDescription ?? person.approximateAgeCode
      );
    }
    return "-";
  };

  const getSex = (person: InvestigationPerson): string => {
    if (!person.sexCode) return "-";
    return person.sexCode;
  };

  const getPhone = (contactMethods: Array<InvestigationContactMethod | null> | null | undefined): string => {
    const phone = contactMethods?.find((cm) => cm?.typeCode === ContactMethods.PHONE && cm.isPrimary);
    return phone?.value ?? "-";
  };

  const getPartyAddress = (addresses: Array<InvestigationAddress | null> | null | undefined): string => {
    const primary = (addresses ?? []).find((a) => a?.isPrimary) ?? (addresses ?? [])[0];
    if (!primary) return "-";
    const province =
      primary.province &&
      countrySubdivisions?.find((code: any) => code.countrySubdivisionCode === primary.province)?.shortDescription;
    const country =
      primary.country && countries?.find((code: any) => code.countryCode === primary.country)?.longDescription;
    return [primary.address, primary.city, province, primary.postalCode, country].filter(Boolean).join(", ");
  };

  const getAliases = (aliases: Array<InvestigationAlias | null> | null | undefined): string =>
    (aliases ?? [])
      .filter(Boolean)
      .map((a) => a!.name)
      .join(", ");

  const getBusinessNumbers = (business: InvestigationBusiness): string =>
    (business.businessIdentifiers ?? [])
      .filter(Boolean)
      .map((id) => id!.identifierValue)
      .join(", ");

  const getPrimaryContactName = (business: InvestigationBusiness): string => {
    const contactPeople = (business.contactPeople ?? []).filter(Boolean) as InvestigationBusinessPerson[];
    const primary = contactPeople.find((cp) => cp.isPrimary) ?? contactPeople[0];
    const person = primary?.person;
    if (!person) return "-";
    return [person.firstName, person.lastName].filter(Boolean).join(", ") || "-";
  };

  const isGlobalParty = (party: InvestigationParty | InspectionParty): boolean => {
    if (!isInvestigation) return false;
    const invParty = party as InvestigationParty;
    if (invParty.person) return !!invParty.person.personReference;
    return !!invParty.partyReference;
  };

  const getPersonMissingFields = (invParty: InvestigationParty): string[] => {
    if (!invParty.person) return [];
    const missing: string[] = [];
    if (!invParty.person.firstName || !invParty.person.lastName) missing.push("name");
    if (!invParty.person.dateOfBirth) missing.push("date of birth");
    if (!invParty.contactMethods?.some((cm) => cm?.typeCode === ContactMethods.PHONE && cm?.value))
      missing.push("phone number");
    if (getPartyAddress(invParty.addresses) === "-") missing.push("address");
    return missing;
  };

  const getBusinessMissingFields = (invParty: InvestigationParty): string[] => {
    if (!invParty.business) return [];
    const missing: string[] = [];
    if (!invParty.business.name) missing.push("name");
    if (!getBusinessNumbers(invParty.business)) missing.push("business number");
    if (getPartyAddress(invParty.addresses) === "-") missing.push("address");
    return missing;
  };

  const isPartyIncomplete = (party: InvestigationParty | InspectionParty): boolean => {
    if (!isInvestigation) return false;
    const invParty = party as InvestigationParty;
    if (invParty.partyAssociationRole !== "PTYOFINTRST") return false;
    if (invParty.person) return getPersonMissingFields(invParty).length > 0;
    if (invParty.business) return getBusinessMissingFields(invParty).length > 0;
    return false;
  };

  const renderRemoveButton = (party: InvestigationParty | InspectionParty) => {
    if (!onRemoveParty) return null;
    return (
      <Button
        size="sm"
        variant="outline-primary"
        onClick={() => onRemoveParty(party.partyIdentifier, getPartyRemoveName(party))}
      >
        <i className="bi bi-trash me-2"></i> Remove
      </Button>
    );
  };

  const renderDetailRow = (label1: string, value1: React.ReactNode, label2: string, value2: React.ReactNode) => {
    return (
      <div className="row mb-2">
        <div className="col-2 text-muted">{label1}</div>
        <div className="col-4">{value1}</div>
        <div className="col-2 text-muted">{label2}</div>
        <div className="col-4">{value2}</div>
      </div>
    );
  };

  const renderNotUpToDateAlert = (partyIdentifier: string) => {
    return (
      <div
        id={`party-not-up-to-date-alert-${partyIdentifier}`}
        className="alert alert-warning d-flex align-items-center justify-content-between py-2 px-3 mb-0 mt-2 small"
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-circle me-2" />
          {onUpdateParty
            ? "Party information have changed as part of another investigation. Update to the latest version of information prior to making additional edits."
            : "This party includes the information available when the investigation was closed. See the published " +
              "profile list to view the most up-to-date information."}
        </div>
        <Button
          id={`update-party-information-button-${partyIdentifier}`}
          variant="outline-primary"
          size="sm"
          className="ms-3 text-nowrap"
          onClick={() => onUpdateParty?.(partyIdentifier)}
          disabled={!onUpdateParty}
        >
          Update party information
        </Button>
      </div>
    );
  };

  const renderCardBody = (party: InvestigationParty | InspectionParty) => {
    if (!isInvestigation) return null;
    const invParty = party as InvestigationParty;

    if (invParty.person) {
      const sex = getSex(invParty.person);
      const phone = getPhone(invParty.contactMethods);
      const address = getPartyAddress(invParty.addresses);
      const dateOfBirthText = getDateOfBirth(invParty.person);
      const missingFields = getPersonMissingFields(invParty);
      const isPartyOfInterest = invParty.partyAssociationRole === "PTYOFINTRST";
      const dob = invParty.person.dateOfBirth ? new Date(String(invParty.person.dateOfBirth)) : null;
      const personIsYoung = isYoungPerson(dob, invParty.person.approximateAgeCode);
      const dateOfBirthDisplay = personIsYoung ? (
        <>
          {dateOfBirthText} <Badge bg="species-badge comp-species-badge">Young person</Badge>
        </>
      ) : (
        dateOfBirthText
      );

      return (
        <Card.Body className="pt-2 pb-3 px-4">
          {renderDetailRow(
            "Sex as per ID",
            sex,
            invParty.person.approximateAgeCode ? "Age range" : "Date of birth",
            dateOfBirthDisplay,
          )}
          {renderDetailRow("Primary phone", formatPhoneNumber(phone), "Primary address", address)}
          {invParty.isUpToDate === false && renderNotUpToDateAlert(invParty.partyIdentifier)}
          {isPartyOfInterest && missingFields.length > 0 && (
            <div className="alert alert-warning d-flex align-items-center py-2 px-3 mb-0 mt-2 small">
              <i className="bi bi-exclamation-circle me-2" />
              This profile is incomplete. Add {joinWithAnd(missingFields)} before logging an enforcement action.
            </div>
          )}
        </Card.Body>
      );
    }

    if (invParty.business) {
      const aliases = getAliases(invParty.aliases) || "-";
      const primaryContact = getPrimaryContactName(invParty.business);
      const businessNumbers = getBusinessNumbers(invParty.business) || "-";
      const address = getPartyAddress(invParty.addresses);
      const missingFields = getBusinessMissingFields(invParty);
      const isPartyOfInterest = invParty.partyAssociationRole === "PTYOFINTRST";
      return (
        <Card.Body className="py-3 px-4">
          {renderDetailRow("Doing business as", aliases, "Business number", businessNumbers)}
          {renderDetailRow("Primary contact", primaryContact, "Primary address", address)}
          {invParty.isUpToDate === false && renderNotUpToDateAlert(invParty.partyIdentifier)}
          {isPartyOfInterest && missingFields.length > 0 && (
            <div className="alert alert-warning d-flex align-items-center py-2 px-3 mb-0 mt-2 small">
              <i className="bi bi-exclamation-circle me-2" />
              This profile is incomplete. Add {joinWithAnd(missingFields)} before logging an enforcement action.
            </div>
          )}
        </Card.Body>
      );
    }

    return null;
  };

  const renderPartyHeader = (party: InvestigationParty | InspectionParty) => {
    const isPerson = !!party.person;
    const icon = isPerson ? "bi-person" : "bi-building";
    const globalParty = isGlobalParty(party);

    return (
      <div className="d-flex justify-content-between align-items-center pt-3 px-4">
        <div className="w-100 border-bottom d-flex justify-content-between pb-2">
          <div className="d-flex align-items-center gap-2 investigation-party-name">
            <i className={`bi ${icon} text-muted party-icon`} />
            <Button
              variant="link"
              className="p-0"
              onClick={() => onViewParty?.(party.partyIdentifier)}
            >
              <h5>{getPartyName(party)}</h5>
            </Button>
            {((party?.person as InvestigationPerson)?.safetyConcernIndicator ||
              (party?.business as InvestigationBusiness)?.safetyConcernIndicator) && (
              <PartyBadges isSafetyConcern={true} />
            )}
            {isPartyIncomplete(party) && <PartyBadges isIncomplete={true} />}
            {globalParty && <PartyBadges isPublished={true} />}
          </div>
          {renderRemoveButton(party)}
        </div>
      </div>
    );
  };

  if (parties) {
    const grouped = parties.reduce(
      (acc, party) => {
        const role = party?.partyAssociationRole ?? "";
        if (!acc[role]) acc[role] = [];
        acc[role].push(party);
        return acc;
      },
      {} as Record<string, typeof parties>,
    );

    const sortedRoles = Object.keys(grouped).sort((a, b) => {
      const orderA = PARTY_ROLE_DISPLAY_ORDER.indexOf(a);
      const orderB = PARTY_ROLE_DISPLAY_ORDER.indexOf(b);
      return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
    });

    return (
      <div className="party-list mb-3">
        {sortedRoles.map((role) => {
          const roleText = toPlural(
            toSentenceCase(
              partyRoles.find(
                (r) => r.partyAssociationRole === role && r.caseActivityTypeCode === currentActivityTypeCode,
              )?.shortDescription ?? role,
            ),
          );
          const roleParties = sortPartiesByName(grouped[role]);
          return (
            <div
              key={role}
              className="mb-3"
            >
              <h4 className="fw-bold mt-4 mb-3">
                {roleText} ({roleParties.length})
              </h4>
              {roleParties.map((party) => (
                <Card
                  key={getPartyKey(party)}
                  className="mb-3 party-card--linked"
                >
                  {renderPartyHeader(party)}
                  {renderCardBody(party)}
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="comp-details-section">
      <div className="party-list mb-3">
        {(people?.length ?? 0) > 0 && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">
              <i className="bi bi-people me-1"></i> People ({people!.length})
            </h6>
            {sortPartiesByName(people!).map((party) => (
              <Card
                key={party.person?.personGuid}
                className="mb-2 party-card--linked"
              >
                {renderPartyHeader(party)}
                {renderCardBody(party)}
              </Card>
            ))}
          </div>
        )}

        {(companies?.length ?? 0) > 0 && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">
              <i className="bi bi-building me-1"></i> Companies ({companies!.length})
            </h6>
            {sortPartiesByName(companies!).map((party) => (
              <Card
                key={party.business?.businessGuid}
                className="mb-2 party-card--linked"
              >
                {renderPartyHeader(party)}
                {renderCardBody(party)}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PartiesList;
