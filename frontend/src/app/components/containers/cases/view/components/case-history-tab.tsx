import { FC, useEffect, useState, useMemo } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { CaseHistoryItem } from "./case-history-item";
import { EventResult, Event } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { Officer } from "@/app/types/person/person";
import Paginator from "@/app/components/common/paginator";
import { formatDate } from "@/app/common/methods";

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

interface CaseHistoryTabProps {
  caseIdentifier: string;
}

export const CaseHistoryTab: FC<CaseHistoryTabProps> = ({ caseIdentifier }) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data, isLoading, error } = useGraphQLQuery<{ searchEvents: EventResult }>(SEARCH_EVENTS, {
    queryKey: ["searchEvents", caseIdentifier, page, pageSize],
    variables: {
      page,
      pageSize,
      filters: {
        targetId: caseIdentifier,
        sortBy: "publishedTimestamp",
        sortOrder: "desc",
      },
    },
    enabled: !!caseIdentifier,
  });

  const events = data?.searchEvents?.items || [];
  const totalCount = data?.searchEvents?.pageInfo?.totalCount || 0;

  const allOfficers = useAppSelector(selectOfficers);
  const [eventOfficers, setEventOfficers] = useState<Officer[]>([]);

  // Get officers by auth_user_guid when events are loaded
  useEffect(() => {
    if (events.length > 0 && allOfficers) {
      const userAuthGuids = new Set<string>();

      // Collect user GUIDs from both source and actor fields
      events.forEach((event) => {
        if (event.sourceEntityTypeCode?.eventEntityTypeCode === "USER" && event.sourceId) {
          userAuthGuids.add(event.sourceId);
        }
        if (event.actorEntityTypeCode?.eventEntityTypeCode === "USER" && event.actorId) {
          userAuthGuids.add(event.actorId);
        }
      });

      const officers = allOfficers.filter((officer) => userAuthGuids.has(officer.auth_user_guid));

      setEventOfficers(officers);
    }
  }, [events, allOfficers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
          <div className="col-12">
            <div
              className="alert alert-danger"
              role="alert"
            >
              Error loading history. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container-fluid px-4 py-3">
        <div className="row g-3">
          <div className="col-12">
            <div
              className="alert alert-info"
              role="alert"
            >
              No history found for this case.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
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
                    officers={eventOfficers}
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
