import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatTime } from "@/app/common/methods";
import { Event } from "@/generated/graphql";
import { AppUser } from "@/app/types/app/app_user/app_user";

interface CaseHistoryItemProps {
  event: Event;
  appUsers?: AppUser[];
  entityNames?: Map<string, string>;
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
interface EventContext {
  sourceId?: string;
  targetId?: string;
  complaintType?: string | null;
  entityNames?: Map<string, string>;
}

type eventDescriptionTemplate = (context: EventContext) => ReactNode;

const eventDescriptionMap: Record<string, Record<string, Record<string, eventDescriptionTemplate>>> = {
  CASE: {
    CASE: {
      CREATED: () => `created the case`,
      CLOSED: () => `closed the case`,
      OPENED: () => `opened the case`,
    },
    COMPLAINT: {
      ADDED: ({ sourceId, complaintType }) => (
        <>
          added complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link> to the case
        </>
      ),
      REMOVED: ({ sourceId, complaintType }) => (
        <>
          removed complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      OPENED: ({ sourceId, complaintType }) => (
        <>
          opened complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
      CLOSED: ({ sourceId, complaintType }) => (
        <>
          closed complaint <Link to={`/complaint/${complaintType}/${sourceId}`}>{sourceId}</Link>
        </>
      ),
    },
    INSPECTION: {
      ADDED: ({ sourceId, entityNames }) => {
        return (
          <>
            added inspection{" "}
            <Link to={`/inspection/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link> to the
            case
          </>
        );
      },
      REMOVED: ({ sourceId, entityNames }) => {
        return (
          <>
            removed inspection{" "}
            <Link to={`/inspection/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
      OPENED: ({ sourceId, entityNames }) => {
        return (
          <>
            opened inspection{" "}
            <Link to={`/inspection/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
      CLOSED: ({ sourceId, entityNames }) => {
        return (
          <>
            closed inspection{" "}
            <Link to={`/inspection/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
    },
    INVESTIGATION: {
      ADDED: ({ sourceId, entityNames }) => {
        return (
          <>
            added investigation{" "}
            <Link to={`/investigation/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link> to the
            case
          </>
        );
      },
      REMOVED: ({ sourceId, entityNames }) => {
        return (
          <>
            removed investigation{" "}
            <Link to={`/investigation/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
      OPENED: ({ sourceId, entityNames }) => {
        return (
          <>
            opened investigation{" "}
            <Link to={`/investigation/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
      CLOSED: ({ sourceId, entityNames }) => {
        return (
          <>
            closed investigation{" "}
            <Link to={`/investigation/${sourceId}`}>{(sourceId && entityNames?.get(sourceId)) || sourceId}</Link>
          </>
        );
      },
    },
    USER: {
      ASSIGNED: () => `was assigned to the case`,
      UNASSIGNED: () => `was unassigned from the case`,
    },
  },
};

const getEventDescription = (event: Event, entityNames?: Map<string, string>): ReactNode => {
  const verb = event.eventVerbTypeCode.eventVerbTypeCode;
  const sourceType = event.sourceEntityTypeCode?.eventEntityTypeCode ?? "";
  const sourceId = event.sourceId ?? "";
  const targetType = event.targetEntityTypeCode.eventEntityTypeCode;
  const targetId = event.targetId;
  const complaintType = event.content?.complaintType ?? null;

  const template = eventDescriptionMap[targetType?.toUpperCase()]?.[sourceType?.toUpperCase()]?.[verb];
  return template
    ? template({ sourceId, targetId, complaintType, entityNames })
    : `performed ${verb.toLowerCase()} action`;
};

export const CaseHistoryItem: FC<CaseHistoryItemProps> = ({ event, appUsers, entityNames }) => {
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
      <span>{getEventDescription(event, entityNames)}</span>
    </li>
  );
};
