import { FC, useEffect, useState, useMemo } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { CaseHistoryItem } from "./case-history-item";
import { EventResult, Event, CaseFile, Inspection, Investigation } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { AppUser } from "@/app/types/app/app_user/app_user";
import Paginator from "@/app/components/common/paginator";
import { formatDate } from "@/app/common/methods";
import { Button } from "react-bootstrap";

const SEARCH_EVENTS = gql`
  query SearchEvents($page: Int, $pageSize: Int, $filters: EventFilters) {
    searchEvents(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        eventGuid
        eventVerbTypeCode {
          eventVerbTypeCode
          shortDescription
          longDescription
        }
        publishedTimestamp
        sourceId
        sourceEntityTypeCode {
          eventEntityTypeCode
          shortDescription
        }
        actorId
        actorEntityTypeCode {
          eventEntityTypeCode
          shortDescription
        }
        targetId
        targetEntityTypeCode {
          eventEntityTypeCode
          shortDescription
        }
        content
      }
      pageInfo {
        totalCount
      }
    }
  }
`;

const GET_ENTITY_NAMES = gql`
  query GetEntityNames($caseIds: [String!]!, $inspectionIds: [String], $investigationIds: [String]) {
    caseFiles(caseIdentifiers: $caseIds) {
      caseIdentifier
      name
    }
    getInspections(ids: $inspectionIds) {
      inspectionGuid
      name
    }
    getInvestigations(ids: $investigationIds) {
      investigationGuid
      name
    }
  }
`;

interface CaseHistoryTabProps {
  caseIdentifier: string;
}

const getUserGuidsFromEvents = (events: Event[]): Set<string> => {
  const userAuthGuids = new Set<string>();

  for (const event of events) {
    if (event.sourceEntityTypeCode?.eventEntityTypeCode === "USER" && event.sourceId) {
      userAuthGuids.add(event.sourceId);
    }
    if (event.actorEntityTypeCode?.eventEntityTypeCode === "USER" && event.actorId) {
      userAuthGuids.add(event.actorId);
    }
    if (event.targetEntityTypeCode?.eventEntityTypeCode === "USER" && event.targetId) {
      userAuthGuids.add(event.targetId);
    }
  }

  return userAuthGuids;
};

const getEntityIdsFromEvents = (events: Event[]) => {
  const caseIds = new Set<string>();
  const inspectionIds = new Set<string>();
  const investigationIds = new Set<string>();

  const addEntityId = (id: string | null | undefined, type: string | null | undefined) => {
    if (!id || !type) return;

    switch (type) {
      case "CASE":
        caseIds.add(id);
        break;
      case "INSPECTION":
        inspectionIds.add(id);
        break;
      case "INVESTIGATION":
        investigationIds.add(id);
        break;
    }
  };

  for (const event of events) {
    addEntityId(event.sourceId, event.sourceEntityTypeCode?.eventEntityTypeCode);
    addEntityId(event.actorId, event.actorEntityTypeCode?.eventEntityTypeCode);
    addEntityId(event.targetId, event.targetEntityTypeCode?.eventEntityTypeCode);
  }

  return {
    caseIds: Array.from(caseIds),
    inspectionIds: Array.from(inspectionIds),
    investigationIds: Array.from(investigationIds),
  };
};

export const CaseHistoryTab: FC<CaseHistoryTabProps> = ({ caseIdentifier }) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useGraphQLQuery<{ searchEvents: EventResult }>(SEARCH_EVENTS, {
    queryKey: ["searchEvents", caseIdentifier, page, pageSize, sortOrder],
    variables: {
      page,
      pageSize,
      filters: {
        targetId: caseIdentifier,
        sortBy: "publishedTimestamp",
        sortOrder: sortOrder,
      },
    },
    enabled: !!caseIdentifier,
  });

  const events = data?.searchEvents?.items || [];
  const totalCount = data?.searchEvents?.pageInfo?.totalCount || 0;

  const allOfficers = useAppSelector(selectOfficers);
  const [eventOfficers, setEventOfficers] = useState<AppUser[]>([]);
  const [entityNames, setEntityNames] = useState<Map<string, string>>(new Map());

  const entityIds = useMemo(() => getEntityIdsFromEvents(events), [events]);

  const hasEntityIds =
    entityIds.caseIds.length > 0 || entityIds.inspectionIds.length > 0 || entityIds.investigationIds.length > 0;

  const { data: entitiesData } = useGraphQLQuery<{
    caseFiles: CaseFile[];
    getInspections: Inspection[];
    getInvestigations: Investigation[];
  }>(GET_ENTITY_NAMES, {
    queryKey: ["entityNames", entityIds.caseIds, entityIds.inspectionIds, entityIds.investigationIds],
    variables: {
      caseIds: entityIds.caseIds.length > 0 ? entityIds.caseIds : [],
      inspectionIds: entityIds.inspectionIds.length > 0 ? entityIds.inspectionIds : undefined,
      investigationIds: entityIds.investigationIds.length > 0 ? entityIds.investigationIds : undefined,
    },
    enabled: hasEntityIds,
  });

  useEffect(() => {
    const nameMap = new Map<string, string>();
    for (const caseFile of entitiesData?.caseFiles || []) {
      if (caseFile.caseIdentifier && caseFile.name) {
        nameMap.set(caseFile.caseIdentifier, caseFile.name);
      }
    }
    for (const inspection of entitiesData?.getInspections || []) {
      if (inspection.inspectionGuid && inspection.name) {
        nameMap.set(inspection.inspectionGuid, inspection.name);
      }
    }
    for (const investigation of entitiesData?.getInvestigations || []) {
      if (investigation.investigationGuid && investigation.name) {
        nameMap.set(investigation.investigationGuid, investigation.name);
      }
    }
    setEntityNames(nameMap);
  }, [entitiesData]);

  // Get officers by auth_user_guid when events are loaded
  useEffect(() => {
    if (events.length > 0 && allOfficers) {
      const userAuthGuids = getUserGuidsFromEvents(events);
      const officers = allOfficers.filter((officer) =>
        userAuthGuids.has(officer.auth_user_guid.toUpperCase().split("-").join("")),
      );
      setEventOfficers(officers);
    }
  }, [events, allOfficers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const groupedEvents = useMemo(() => {
    return events.reduce(
      (groups, event) => {
        const date = new Date(event.publishedTimestamp);
        const dateKey = date.toISOString().split("T")[0];

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(event);

        return groups;
      },
      {} as Record<string, Event[]>,
    );
  }, [events]);

  if (isLoading) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row g-3">
          <div className="col-12">
            <p>Loading case history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row g-3">
          <div className="col-12">Error loading history. Please try again later.</div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row g-3">
          <div className="col-12">No history found for this case.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row g-3 pb-4 px-4">
        <div className="col-12">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={toggleSortOrder}
          >
            <i className={`bi bi-filter me-2`}></i>
            {sortOrder === "desc" ? "Newest to Oldest" : "Oldest to Newest"}
          </Button>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12">
          {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div
              key={dateKey}
              className="px-4"
            >
              <h6 className="px-0 mb-3">
                <i className={`bi bi-calendar me-3 text-primary`}></i>
                {formatDate(new Date(dateKey).toString())}
              </h6>
              <hr className="px-0 m-0" />
              <ul className="px-0">
                {dateEvents.map((event) => (
                  <CaseHistoryItem
                    key={event.eventGuid}
                    event={event}
                    appUsers={eventOfficers}
                    entityNames={entityNames}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {totalCount > pageSize && (
        <div className="row mt-3 px-4">
          <div className="col-12">
            <Paginator
              currentPage={page}
              totalItems={totalCount}
              onPageChange={handlePageChange}
              resultsPerPage={pageSize}
              resetPageOnChange={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
