import { FC } from "react";
import { formatTime } from "@/app/common/methods";
import { Event } from "@/generated/graphql";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { formatPhoneNumber } from "react-phone-number-input/input";

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

const getEventDescription = (event: Event): string => {
  const verb = event.eventVerbTypeCode.eventVerbTypeCode;
  const content = event.content as { field?: string; oldValue?: string; newValue?: string } | null;

  if (verb === "CREATED") {
    return "created the party";
  }

  const field = content?.field ?? "information";
  const oldValue = content?.oldValue;
  const newValue = content?.newValue;
  const formatValue = (value: string | null | undefined): string => {
    if (!value) return "";
    if (field === "sex") return SEX_LABELS[value] ?? value;
    if (field === "phone number") return formatPhoneNumber(value) || value;
    return value;
  };

  switch (verb) {
    case "ADDED":
      return `added ${field}: ${formatValue(newValue)}`;
    case "REMOVED":
      return `removed ${field}: ${formatValue(oldValue)}`;
    case "EDITED":
      return `updated ${field} from "${formatValue(oldValue)}" to "${formatValue(newValue)}"`;
    default:
      return `performed ${verb.toLowerCase()} on ${field}`;
  }
};

export const PartyHistoryItem: FC<PartyHistoryItemProps> = ({ event, appUsers }) => {
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
      <span>{getEventDescription(event)}</span>
    </li>
  );
};
