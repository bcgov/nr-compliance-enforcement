// party-match-card.tsx
import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectGenderDropdown } from "@/app/store/reducers/code-table";
import { calculateAgeYears } from "@/app/common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { Address, ContactMethod, Party } from "@/generated/graphql";
import { formatPhoneNumber } from "react-phone-number-input";

type PartyMatchCardProps = {
  party: Party;
  onAdd: (party: Party) => void;
  isDisabled?: boolean;
};

export const PartyMatchCard: FC<PartyMatchCardProps> = ({ party, onAdd, isDisabled = false }) => {
  const genderOptions = useAppSelector(selectGenderDropdown);

  const { person } = party;

  const fullName = [person?.firstName, person?.middleNames, person?.lastName].filter(Boolean).join(" ").trim();

  const genderLabel = genderOptions?.find(
    (opt: { value: string; label: string }) => opt.value === person?.genderCode,
  )?.label;

  const dateOfBirth = person?.dateOfBirth ? String(person.dateOfBirth).slice(0, 10) : "";
  const age = person?.dateOfBirth ? calculateAgeYears(new Date(person.dateOfBirth)) : "";

  // Compose "Male, 24 (2002-02-23)", dropping whichever pieces are absent.
  const genderAge = [genderLabel, age === null ? "" : String(age)].filter(Boolean).join(", ");
  const descriptorLine = [genderAge, dateOfBirth ? `(${dateOfBirth})` : ""].filter(Boolean).join(" ");

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
        <div className="comp-party-match-card-name">{fullName || "-"}</div>
        {descriptorLine && <div className="comp-party-match-card-body-line">{descriptorLine}</div>}
        {primaryPhone?.value && (
          <div className="comp-party-match-card-body-line">{formatPhoneNumber(primaryPhone.value)}</div>
        )}
        {primaryAddress?.address && <div className="comp-party-match-card-body-line">{primaryAddress.address}</div>}
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
