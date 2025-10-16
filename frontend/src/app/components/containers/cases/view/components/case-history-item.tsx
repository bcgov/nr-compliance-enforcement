import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatTime } from "@/app/common/methods";
import { Event } from "@/generated/graphql";
import { Officer } from "@/app/types/person/person";

interface CaseHistoryItemProps {
  event: Event;
  officers?: Officer[];
}

const getIconByVerb = (verbCode: string): string => {
  const verbIcons: { [key: string]: string } = {
    ADDED: "bi-plus-circle",
    REMOVED: "bi-x-circle",
    OPENED: "bi-unlock",
    CLOSED: "bi-lock",
    CREATED: "bi-box-seam",
  };

  return verbIcons[verbCode] || "bi-clock";
};

// [targetType][sourceType][verb]
type eventDescriptionTemplate = (sourceId?: string, targetId?: string, complaintType?: string) => ReactNode;
const eventDescriptionMap: Record<string, Record<string, Record<string, eventDescriptionTemplate>>> = {
  CASE: {
    CASE: {
      CREATED: () => `created the case`,
      CLOSED: () => `closed the case`,
      OPENED: () => `opened the case`,
    },
    COMPLAINT: {
      ADDED: (sourceId, _, complaintType) => (
        <>
          added complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link> to the case
        </>
      ),
      REMOVED: (sourceId, _, complaintType) => (
        <>
          removed complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      OPENED: (sourceId, _, complaintType) => (
        <>
          opened complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      CLOSED: (sourceId, _, complaintType) => (
        <>
          closed complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
    },
    INSPECTION: {
      ADDED: (sourceId) => (
        <>
          added inspection <Link to={`/inspection/${sourceId}`}>{sourceId}</Link> to the case
        </>
      ),
      REMOVED: (sourceId) => (
        <>
          removed inspection <Link to={`/inspection/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      OPENED: (sourceId) => (
        <>
          opened inspection <Link to={`/inspection/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      CLOSED: (sourceId) => (
        <>
          closed inspection <Link to={`/inspection/${sourceId}`}>{sourceId}</Link>
        </>
      ),
    },
    INVESTIGATION: {
      ADDED: (sourceId) => (
        <>
          added investigation <Link to={`/investigation/${sourceId}`}>{sourceId}</Link> to the case
        </>
      ),
      REMOVED: (sourceId) => (
        <>
          removed investigation <Link to={`/investigation/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      OPENED: (sourceId) => (
        <>
          opened investigation <Link to={`/investigation/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      CLOSED: (sourceId) => (
        <>
          closed investigation <Link to={`/investigation/${sourceId}`}>{sourceId}</Link>
        </>
      ),
    },
    USER: {
      ASSIGNED: () => `was assigned to the case`,
      UNASSIGNED: () => `was unassigned from the case`,
    },
  },
};

const getEventDescription = (event: Event): ReactNode => {
  const verb = event.eventVerbTypeCode.eventVerbTypeCode;
  const sourceType = event.sourceEntityTypeCode?.eventEntityTypeCode ?? "";
  const sourceId = event.sourceId ?? "";
  const targetType = event.targetEntityTypeCode.eventEntityTypeCode;
  const targetId = event.targetId;
  const complaintType = event.content?.complaintType ?? null;

  const template = eventDescriptionMap[targetType?.toUpperCase()]?.[sourceType?.toUpperCase()]?.[verb];
  return template ? template(sourceId, targetId, complaintType) : `performed ${verb.toLowerCase()} action`;
};

export const CaseHistoryItem: FC<CaseHistoryItemProps> = ({ event, officers }) => {
  const getActorName = () => {
    const actorId = event.actorId;
    if (actorId && event.actorEntityTypeCode?.eventEntityTypeCode === "USER" && officers) {
      const officer = officers.find((o) => o.auth_user_guid.toUpperCase().split("-").join("") === actorId);
      if (officer) {
        return `${officer.person_guid.first_name} ${officer.person_guid.last_name} (${officer.agency_code?.shortDescription})`;
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
