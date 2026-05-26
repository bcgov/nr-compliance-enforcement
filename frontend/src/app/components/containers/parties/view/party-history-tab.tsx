import { FC, useEffect, useState, useMemo } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { PartyHistoryItem } from "./party-history-item";
import { EventResult, Event } from "@/generated/graphql";
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

interface PartyHistoryTabProps {
  partyIdentifier: string;
}

export const PartyHistoryTab: FC<PartyHistoryTabProps> = ({ partyIdentifier }) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useGraphQLQuery<{ searchEvents: EventResult }>(SEARCH_EVENTS, {
    queryKey: ["searchPartyEvents", partyIdentifier, page, pageSize, sortOrder],
    variables: {
      page,
      pageSize,
      filters: {
        targetId: partyIdentifier,
        sortBy: "publishedTimestamp",
        sortOrder,
      },
    },
    enabled: !!partyIdentifier,
  });

  const events = data?.searchEvents?.items || [];
  const totalCount = data?.searchEvents?.pageInfo?.totalCount || 0;

  const allOfficers = useAppSelector(selectOfficers);
  const [eventOfficers, setEventOfficers] = useState<AppUser[]>([]);

  useEffect(() => {
    if (events.length > 0 && allOfficers) {
      const userGuids = new Set<string>();
      for (const event of events) {
        if (event.actorEntityTypeCode?.eventEntityTypeCode === "USER" && event.actorId) {
          userGuids.add(event.actorId);
        }
      }
      const officers = allOfficers.filter((o) => userGuids.has(o.auth_user_guid.toUpperCase().split("-").join("")));
      setEventOfficers(officers);
    }
  }, [events, allOfficers]);

  const groupedEvents = useMemo(() => {
    return events.reduce(
      (groups, event) => {
        const dateKey = new Date(event.publishedTimestamp).toISOString().split("T")[0];
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(event);
        return groups;
      },
      {} as Record<string, Event[]>,
    );
  }, [events]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="container-fluid px-4 py-3">
        <p>Loading party history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-3">
        <div>Error loading history. Please try again later.</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container-fluid px-4 py-3">
        <div>No history found for this party.</div>
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
            <i className="bi bi-filter me-2"></i>
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
                <i className="bi bi-calendar me-3 text-primary"></i>
                {formatDate(new Date(dateKey).toString())}
              </h6>
              <hr className="px-0 m-0" />
              <ul className="px-0">
                {dateEvents.map((event) => (
                  <PartyHistoryItem
                    key={event.eventGuid}
                    event={event}
                    appUsers={eventOfficers}
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
              onPageChange={(newPage) => setPage(newPage)}
              resultsPerPage={pageSize}
              resetPageOnChange={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
