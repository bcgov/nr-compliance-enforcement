import { FC, useRef, useState, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import {
  getComplaints,
  selectComplaintsByType,
  setComplaints,
  selectTotalComplaintsByType,
} from "../../../store/reducers/complaints";
import { Table } from "react-bootstrap";
import { SORT_TYPES } from "../../../constants/sort-direction";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "../../../types/complaints/complaint-filters/complaint-reauest-payload";
import { WildlifeComplaintListHeader } from "./headers/wildlife-complaint-list-header";
import { AllegationComplaintListHeader } from "./headers/allegation-complaint-list-header";
import { selectDefaultPageSize, selectDefaultZone } from "../../../store/reducers/app";
import { WildlifeComplaintListItem } from "./list-items/wildlife-complaint-list-item";
import { AllegationComplaintListItem } from "./list-items/allegation-complaint-list-item";
import ComplaintPagination from "../../common/complaint-pagination";

//-- new models
import { AllegationComplaint } from "../../../types/app/complaints/allegation-complaint";
import { WildlifeComplaint } from "../../../types/app/complaints/wildlife-complaint";

type Props = {
  type: string;
  searchQuery?: string;
};

export const generateComplaintRequestPayload = (
  complaintType: string,
  filters: ComplaintFilters,
  page: number,
  pageSize: number,
  sortColumn: string,
  sortOrder: string,
): ComplaintRequestPayload => {
  const { region, zone, community, officer, startDate, endDate, status, species, natureOfComplaint, violationType } =
    filters;

  const common = {
    sortColumn,
    sortOrder,
    regionCodeFilter: region,
    zoneCodeFilter: zone,
    areaCodeFilter: community,
    officerFilter: officer,
    startDateFilter: startDate,
    endDateFilter: endDate,
    complaintStatusFilter: status,
    page,
    pageSize,
  };

  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return {
        ...common,
        violationFilter: violationType,
      } as ComplaintRequestPayload;
    case COMPLAINT_TYPES.HWCR:
    default:
      return {
        ...common,
        speciesCodeFilter: species,
        natureOfComplaintFilter: natureOfComplaint,
      } as ComplaintRequestPayload;
  }
};

export const ComplaintList: FC<Props> = ({ type, searchQuery }) => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(selectComplaintsByType(type));

  const totalComplaints = useAppSelector(selectTotalComplaintsByType(type));
  const defaultPageSize = useAppSelector(selectDefaultPageSize);

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

  const [sortKey, setSortKey] = useState("incident_reported_utc_timestmp");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize); // Default to 10 results per page

  const defaultZone = useAppSelector(selectDefaultZone);

  useEffect(() => {
    if (defaultZone) {
      let payload = generateComplaintRequestPayload(type, filters, page, pageSize, sortKey, sortDirection);

      if (searchQuery) {
        payload = { ...payload, query: searchQuery };
      }

      dispatch(getComplaints(type, payload));
    }
  }, [filters, sortKey, sortDirection, page, pageSize]);

  useEffect(() => {
    //Refresh the list with the current filters when the search is cleared
    if (!searchQuery && defaultZone) {
      let payload = generateComplaintRequestPayload(type, filters, page, pageSize, sortKey, sortDirection);
      payload = { ...payload, query: searchQuery };
      dispatch(getComplaints(type, payload));
    }
  }, [searchQuery]);

  useEffect(() => {
    if (defaultPageSize) {
      setPageSize(defaultPageSize);
    }
  }, [defaultPageSize]);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaints({ type: { type }, data: [] }));
    };
  }, []);

  const handleSort = (sortInput: string) => {
    if (sortKey === sortInput) {
      setSortDirection(sortDirection === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC);
    } else {
      setSortKey(sortInput);
      setSortDirection(SORT_TYPES.ASC);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    scrollToTop();
  };

  // Scroll to top of table container when paginating
  const divRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    divRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderComplaintListHeader = (type: string): JSX.Element => {
    switch (type) {
      case COMPLAINT_TYPES.ERS:
        return (
          <AllegationComplaintListHeader
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        );
      case COMPLAINT_TYPES.HWCR:
      default:
        return (
          <WildlifeComplaintListHeader
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        );
    }
  };

  return (
    <div className="complaint-list-container">
      <div
        className="complaint-table-container"
        ref={divRef}
      >
        <Table id="complaint-list">
          {renderComplaintListHeader(type)}
          <tbody>
            {complaints.map((item) => {
              const { id } = item;

              switch (type) {
                case COMPLAINT_TYPES.ERS: {
                  return (
                    <AllegationComplaintListItem
                      key={id}
                      type={type}
                      complaint={item as AllegationComplaint}
                    />
                  );
                }
                case COMPLAINT_TYPES.HWCR:
                default: {
                  return (
                    <WildlifeComplaintListItem
                      key={id}
                      type={type}
                      complaint={item as WildlifeComplaint}
                    />
                  );
                }
              }
            })}
          </tbody>
        </Table>
      </div>

      <ComplaintPagination
        currentPage={page}
        totalItems={totalComplaints}
        onPageChange={handlePageChange}
        resultsPerPage={pageSize}
      />
    </div>
  );
};
