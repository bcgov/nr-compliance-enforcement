import { useAppSelector } from "@/app/hooks/hooks";
import {
  InspectionParty,
  InvestigationAddress,
  InvestigationAlias,
  InvestigationBusiness,
  InvestigationContactMethod,
  InvestigationParty,
  InvestigationPerson,
} from "@/generated/graphql";
import React from "react";
import { Badge, Card, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { CaseActivities } from "@/app/constants/case-activities";
import { ContactMethods } from "@/app/constants/contact-methods";
import { isYoungPerson, joinWithAnd, toSentenceCase, toPlural } from "@/app/common/methods";

const PARTY_ROLE_DISPLAY_ORDER = ["PTYOFINTRST", "ASSCTE", "WITNESS", "EXTRNLOFFCR", "OTHER"];

// Can we genercize this in the future?
interface Props {
  companies?: (InvestigationParty | InspectionParty)[];
  people?: (InvestigationParty | InspectionParty)[];
  parties?: (InvestigationParty | InspectionParty)[];
  onRemoveParty?: (partyIdentifier: string, partyName: string) => void;
  onEditParty?: (party: InvestigationParty | InspectionParty) => void;
  activityType: string;
}

const PartiesList: React.FC<Props> = ({ companies, people, parties, onRemoveParty, onEditParty, activityType }) => {
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const genderCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GENDER));
  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));

  const isInvestigation = activityType === CaseActivities.INVESTIGATION;

  let currentActivityTypeCode = "";
  if (activityType === CaseActivities.INSPECTION) {
    currentActivityTypeCode = "INSPECTION";
  } else if (isInvestigation) {
    currentActivityTypeCode = "INVSTGTN";
  }

  const getPartyName = (party: InvestigationParty | InspectionParty): string => {
    if (party.person) return `${party.person.lastName}, ${party.person.firstName}`;
    if (party.business) return party.business.name ?? "";
    return "-";
  };

  const getPartyKey = (party: InvestigationParty | InspectionParty): string =>
    party.person?.personGuid ?? party.business?.businessGuid ?? party.partyIdentifier;

  const getPartyRemoveName = (party: InvestigationParty | InspectionParty): string => {
    if (party.person) return `${party.person.firstName} ${party.person.lastName}`;
    if (party.business) return party.business.name ?? "";
    return "-";
  };

  const getPartyLink = (party: InvestigationParty | InspectionParty): string => {
    const guid = party.person?.partyGuid ?? party.business?.partyGuid;
    return guid ? `/party/${guid}` : "#";
  };

  const getAge = (person: InvestigationPerson): string => {
    if (person.dateOfBirth) {
      const dateStr = String(person.dateOfBirth).slice(0, 10);
      const [year, month, day] = dateStr.split("-").map(Number);
      const today = new Date();
      let age = today.getFullYear() - year;
      if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
        age--;
      }
      return `${age} (${dateStr})`;
    }
    if (person.approximateAgeCode) {
      return (
        approximateAgeCodes?.find((code: any) => code.approximateAgeCode === person.approximateAgeCode)
          ?.shortDescription ?? person.approximateAgeCode
      );
    }
    return "-";
  };

  const getGender = (person: InvestigationPerson): string => {
    if (!person.genderCode) return "-";
    return genderCodes?.find((code: any) => code.genderCode === person.genderCode)?.shortDescription ?? "-";
  };

  const getPhone = (contactMethods: Array<InvestigationContactMethod | null> | null | undefined): string => {
    const phone = contactMethods?.find((cm) => cm?.typeCode === ContactMethods.PHONE && cm.isPrimary);
    return phone?.value ?? "-";
  };

  const getPartyAddress = (addresses: Array<InvestigationAddress | null> | null | undefined): string => {
    const primary = (addresses ?? []).find((a) => a?.isPrimary) ?? (addresses ?? [])[0];
    if (!primary) return "-";
    return [primary.address, primary.city, primary.province, primary.postalCode, primary.country]
      .filter(Boolean)
      .join(", ");
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

  const isGlobalParty = (party: InvestigationParty | InspectionParty): boolean => {
    if (!isInvestigation) return false;
    const invParty = party as InvestigationParty;
    if (invParty.person) return !!invParty.person.personReference;
    return !!invParty.partyReference;
  };

  const getPersonMissingFields = (invParty: InvestigationParty): string[] => {
    if (!invParty.person) return [];
    const missing: string[] = [];
    if (!invParty.person.dateOfBirth) missing.push("age");

    if (!invParty.contactMethods?.some((cm) => cm?.typeCode === ContactMethods.PHONE && cm?.value))
      missing.push("phone number");
    if (getPartyAddress(invParty.addresses) === "-") missing.push("address");
    return missing;
  };

  const getBusinessMissingFields = (invParty: InvestigationParty): string[] => {
    if (!invParty.business) return [];
    const missing: string[] = [];
    if (!getBusinessNumbers(invParty.business)) missing.push("business number");
    if (getPartyAddress(invParty.addresses) === "-") missing.push("address");
    return missing;
  };

  const renderActionsDropdown = (party: InvestigationParty | InspectionParty) => {
    if (!onRemoveParty && !onEditParty) return null;
    return (
      <Dropdown
        drop="start"
        className="comp-action-dropdown"
      >
        <Dropdown.Toggle
          size="sm"
          variant="outline-primary"
          bsPrefix="btn btn-outline-primary btn-sm comp-kebab-toggle"
        >
          <i className="bi bi-three-dots-vertical ms-1 me-1"></i> Actions
        </Dropdown.Toggle>
        <Dropdown.Menu
          renderOnMount
          popperConfig={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 13],
                  placement: "start",
                },
              },
            ],
          }}
        >
          {onEditParty && (
            <Dropdown.Item onClick={() => onEditParty(party)}>
              <i className="bi bi-pencil me-2"></i> Edit
            </Dropdown.Item>
          )}
          {onRemoveParty && (
            <Dropdown.Item onClick={() => onRemoveParty(party.partyIdentifier, getPartyRemoveName(party))}>
              <i className="bi bi-trash me-2"></i> Remove
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
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

  const renderCardBody = (party: InvestigationParty | InspectionParty) => {
    if (!isInvestigation) return null;
    const invParty = party as InvestigationParty;

    if (invParty.person) {
      const gender = getGender(invParty.person);
      const phone = getPhone(invParty.contactMethods);
      const address = getPartyAddress(invParty.addresses);
      const age = getAge(invParty.person);
      const missingFields = getPersonMissingFields(invParty);
      const isPartyOfInterest = invParty.partyAssociationRole === "PTYOFINTRST";
      const dob = invParty.person.dateOfBirth ? new Date(String(invParty.person.dateOfBirth)) : null;
      const personIsYoung = isYoungPerson(dob, invParty.person.approximateAgeCode);
      const ageDisplay = personIsYoung ? (
        <>
          {age} <Badge bg="species-badge comp-species-badge">Young person</Badge>
        </>
      ) : (
        age
      );

      return (
        <Card.Body className="py-3 px-4">
          {renderDetailRow("Gender", gender, "Age", ageDisplay)}
          {renderDetailRow("Phone number", phone, "Address", address)}
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
      const phone = getPhone(invParty.contactMethods);
      const businessNumbers = getBusinessNumbers(invParty.business) || "-";
      const address = getPartyAddress(invParty.addresses);
      const missingFields = getBusinessMissingFields(invParty);
      const isPartyOfInterest = invParty.partyAssociationRole === "PTYOFINTRST";
      return (
        <Card.Body className="py-3 px-4">
          {renderDetailRow("Alias", aliases, "Business number", businessNumbers)}
          {renderDetailRow("Primary phone", phone, "Primary address", address)}
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
    const link = getPartyLink(party);
    const globalParty = isGlobalParty(party);

    return (
      <div className="d-flex justify-content-between align-items-center py-3 px-4">
        <div className="w-100 border-bottom d-flex justify-content-between pb-3">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${icon} text-muted`} />
            <Link to={link}>{getPartyName(party)}</Link>
            {(party?.person as InvestigationPerson)?.boloIndicator && (
              <Badge className="comp-danger-badge">Caution / BOLO</Badge>
            )}
            {globalParty && (
              <span className="text-success small d-flex align-items-center gap-1">
                <i className="bi bi-check-circle-fill"></i> Published
              </span>
            )}
          </div>
          {renderActionsDropdown(party)}
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
          const roleParties = grouped[role];
          return (
            <div
              key={role}
              className="mb-3"
            >
              <h4 className="fw-bold mt-4 mb-2">
                {roleText} ({roleParties.length})
              </h4>
              {roleParties.map((party) => (
                <Card
                  key={getPartyKey(party)}
                  className={`mb-3 party-card${isGlobalParty(party) ? " party-card--linked" : ""}`}
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
            {people!.map((party) => (
              <Card
                key={party.person?.personGuid}
                className={`mb-2 party-card${isGlobalParty(party) ? " party-card--linked" : ""}`}
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
            {companies!.map((party) => (
              <Card
                key={party.business?.businessGuid}
                className={`mb-2 party-card${isGlobalParty(party) ? " party-card--linked" : ""}`}
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
