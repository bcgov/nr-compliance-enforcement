// party-match-card.tsx
import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { calculateAgeYears } from "@/app/common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { Address, Alias, BusinessIdentifier, ContactMethod, Party } from "@/generated/graphql";
import { formatPhoneNumber } from "react-phone-number-input";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { getPartyName } from "@/app/common/party-name";

type PartyMatchCardProps = {
  party: Party;
  onAdd: (party: Party) => void;
  isDisabled?: boolean;
};

export const PartyMatchCard: FC<PartyMatchCardProps> = ({ party, onAdd, isDisabled = false }) => {
  const { person, business } = party;
  const isBusiness = party.partyTypeCode === PartyTypeCodes.BUSINESS;

  // --- Business-specific derivations ---
  const aliases = (party.aliases ?? []).filter((a): a is Alias => a != null).slice(0, 2);

  const businessNumber = (business?.businessIdentifiers ?? [])
    .filter((bi): bi is BusinessIdentifier => bi != null)
    .find((bi) => bi.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER)?.identifierValue;

  const businessAddresses = (party.addresses ?? []).filter((a): a is Address => a != null).slice(0, 2);

  // --- Person-specific derivations ---
  const sexLabel = person?.sexCode ? `Sex as per ID: ${person.sexCode}` : "";

  const dateOfBirth = person?.dateOfBirth ? String(person.dateOfBirth).slice(0, 10) : "";
  const age = person?.dateOfBirth ? calculateAgeYears(new Date(person.dateOfBirth)) : "";

  // Compose "Sex as per ID: F, 24 (2002-02-23)", dropping whichever pieces are absent.
  const sexAge = [sexLabel, age === null ? "" : String(age)].filter(Boolean).join(", ");
  const descriptorLine = [sexAge, dateOfBirth ? `(${dateOfBirth})` : ""].filter(Boolean).join(" ");

  // --- Shared derivations ---
  const name = getPartyName(party);
  const contactMethods = (party.contactMethods ?? []).filter((cm): cm is ContactMethod => cm != null);
  const phones = contactMethods.filter((cm) => cm.typeCode === ContactMethods.PHONE);
  const primaryPhone = phones.find((cm) => cm.isPrimary) ?? phones[0];

  const addresses = (party.addresses ?? []).filter((a): a is Address => a != null);
  const primaryAddress = addresses.find((a) => a.isPrimary) ?? addresses[0];

  return (
    <Card className="comp-party-match-card mb-3">
      <Card.Body>
        <div className="comp-party-match-card-title">Potential matching profile:</div>
        <hr className="mt-0 mb-0"></hr>
        {isBusiness ? (
          <>
            <div className="comp-party-match-card-name">{name}</div>
            {aliases.map((alias) => (
              <div
                key={alias.aliasGuid}
                className="comp-party-match-card-body-line"
              >
                {alias.name}
              </div>
            ))}
            {businessNumber && (
              <div className="comp-party-match-card-body-line">{`Business number: ${businessNumber}`}</div>
            )}
            {businessAddresses.map((address) => (
              <div
                key={address.addressGuid}
                className="comp-party-match-card-body-line"
              >
                {`${address.addressName}: ${address.address}`}
              </div>
            ))}
            {primaryPhone?.value && (
              <div className="comp-party-match-card-body-line">{`Primary: ${formatPhoneNumber(primaryPhone.value)}`}</div>
            )}
          </>
        ) : (
          <>
            <div className="comp-party-match-card-name">{name}</div>
            {descriptorLine && <div className="comp-party-match-card-body-line">{descriptorLine}</div>}
            {primaryPhone?.value && (
              <div className="comp-party-match-card-body-line">{`Primary: ${formatPhoneNumber(primaryPhone.value)}`}</div>
            )}
            {primaryAddress?.address && (
              <div className="comp-party-match-card-body-line">{`${primaryAddress.addressName}: ${primaryAddress.address}`}</div>
            )}
          </>
        )}
        <div className="comp-party-match-card-actions">
          <Button
            variant="primary"
            onClick={() => onAdd(party)}
            disabled={isDisabled}
          >
            <i className="bi bi-plus-circle" />
            <span>Add to investigation</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
