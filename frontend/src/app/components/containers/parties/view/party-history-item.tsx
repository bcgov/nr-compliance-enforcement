import { FC } from "react";
import { formatTime } from "@/app/common/methods";
import { Event } from "@/generated/graphql";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";

interface PartyHistoryItemProps {
  event: Event;
  appUsers?: AppUser[];
}

const SEX_LABELS: Record<string, string> = { M: "male", F: "female", U: "unknown" };

const getIconByVerb = (verbCode: string): string => {
  const verbIcons: { [key: string]: string } = {
    CREATED: "bi-box-seam",
    ADDED: "bi-plus-circle",
    EDITED: "bi-pencil-square",
    REMOVED: "bi-x-circle",
  };
  return verbIcons[verbCode] || "bi-clock";
};

const useEventDescription = (event: Event): string => {
  const countries = useAppSelector(selectCountries);
  const countrySubdivisions = useAppSelector(selectCountrySubdivisions);

  const verb = event.eventVerbTypeCode.eventVerbTypeCode;
  const content = event.content as {
    field?: string;
    oldValue?: string;
    newValue?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  } | null;

  if (verb === "CREATED") {
    return "created the party";
  }

  const field = content?.field ?? "information";
  const oldValue = content?.oldValue;
  const newValue = content?.newValue;

  const formatValue = (value: string | null | undefined): string => {
    if (!value) return "";
    if (field === "sex") return SEX_LABELS[value] ?? value;
    if (field.includes("phone number")) return formatPhoneNumber(value) || value;
    if (field.includes("country")) return countries.find((c) => c.value === value)?.label ?? value;
    if (field.includes("province")) return countrySubdivisions.find((s) => s.value === value)?.label ?? value;
    return value;
  };

  // Builds the detail portion for address add/remove events: "123 Main St, Victoria, British Columbia, V8V 1A1, Canada"
  const formatAddressDetails = (): string => {
    const provinceName = content?.province
      ? (countrySubdivisions.find((s) => s.value === content.province)?.label ?? content.province)
      : null;
    const countryName = content?.country
      ? (countries.find((c) => c.value === content.country)?.label ?? content.country)
      : null;
    return [content?.streetAddress, content?.city, provinceName, content?.postalCode, countryName]
      .filter(Boolean)
      .join(", ");
  };

  switch (verb) {
    case "ADDED": {
      if (field === "address") {
        const details = formatAddressDetails();
        return details ? `added address ${newValue}: ${details}` : `added address: ${newValue}`;
      }
      return `added ${field}: ${formatValue(newValue)}`;
    }
    case "REMOVED": {
      if (field === "address") {
        const details = formatAddressDetails();
        return details ? `removed address ${oldValue}: ${details}` : `removed address: ${oldValue}`;
      }
      return `removed ${field}: ${formatValue(oldValue)}`;
    }
    case "EDITED":
      return `updated ${field} from "${formatValue(oldValue)}" to "${formatValue(newValue)}"`;
    default:
      return `performed ${verb.toLowerCase()} on ${field}`;
  }
};

export const PartyHistoryItem: FC<PartyHistoryItemProps> = ({ event, appUsers }) => {
  const eventDescription = useEventDescription(event);

  const getActorName = () => {
    const actorId = event.actorId;
    if (actorId && event.actorEntityTypeCode?.eventEntityTypeCode === "USER" && appUsers) {
      const officer = appUsers.find((o) => o.auth_user_guid.toUpperCase().split("-").join("") === actorId);
      if (officer) {
        return `${officer.last_name}, ${officer.first_name} (${officer.agency_code?.shortDescription})`;
      }
    }
    return actorId;
  };

  return (
    <li className="list-group-item d-flex align-items-center py-2">
      <i className={`bi ${getIconByVerb(event.eventVerbTypeCode.eventVerbTypeCode)} me-3 text-primary`}></i>
      <span className="me-3 text-muted">{formatTime(event.publishedTimestamp)}</span>
      <span className="me-3 text-muted">{`•`}</span>
      <span className="fw-bold me-2">{getActorName()}</span>
      <span>{eventDescription}</span>
    </li>
  );
};
