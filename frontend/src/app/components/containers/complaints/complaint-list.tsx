import { FC, useRef, useState, useContext, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import {
  getComplaints,
  selectComplaintsByType,
  setComplaints,
  selectTotalComplaintsByType,
  selectComplaintSearchParameters,
} from "@store/reducers/complaints";
import { Table } from "react-bootstrap";
import { SORT_TYPES } from "@constants/sort-direction";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "@/app/types/complaints/complaint-filters/complaint-request-payload";
import { WildlifeComplaintListHeader } from "./headers/wildlife-complaint-list-header";
import { GeneralComplaintListHeader } from "./headers/general-complaint-list-header";
import { AllegationComplaintListHeader } from "./headers/allegation-complaint-list-header";
import { SectorComplaintListHeader } from "./headers/sector-complaint-list-header";
import { selectActiveTab, selectDefaultPageSize } from "@store/reducers/app";
import { WildlifeComplaintListItem } from "./list-items/wildlife-complaint-list-item";
import { AllegationComplaintListItem } from "./list-items/allegation-complaint-list-item";
import { SectorComplaintListItem } from "./list-items/sector-complaint-list-item";
import Paginator from "@/app/components/common/paginator";

//-- new models
import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { GeneralInformationComplaintListItem } from "./list-items/general-complaint-list-item";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { Complaint } from "@apptypes/app/complaints/complaint";

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
  const {
    region,
    zone,
    community,
    park,
    area,
    officer,
    startDate,
    endDate,
    status,
    species,
    natureOfComplaint,
    violationType,
    girType,
    complaintMethod,
    actionTaken,
    outcomeAnimal,
    outcomeAnimalStartDate,
    outcomeAnimalEndDate,
    outcomeActionedBy,
    equipmentStatus,
    equipmentTypes,
  } = filters;

  const common = {
    sortColumn,
    sortOrder,
    regionCodeFilter: region,
    zoneCodeFilter: zone,
    areaCodeFilter: community,
    parkFilter: park,
    areaFilter: area,
    officerFilter: officer,
    startDateFilter: startDate,
    endDateFilter: endDate,
    complaintStatusFilter: status,
    girTypeFilter: girType,
    page,
    pageSize,
  };

  switch (complaintType) {
    case COMPLAINT_TYPES.GIR:
      return {
        ...common,
        girTypeFilter: girType,
      } as ComplaintRequestPayload;
    case COMPLAINT_TYPES.ERS:
      return {
        ...common,
        violationFilter: violationType,
        complaintMethodFilter: complaintMethod,
        actionTakenFilter: actionTaken,
      } as ComplaintRequestPayload;
    case COMPLAINT_TYPES.HWCR:
      return {
        ...common,
        speciesCodeFilter: species,
        natureOfComplaintFilter: natureOfComplaint,
        outcomeAnimalFilter: outcomeAnimal,
        outcomeAnimalStartDateFilter: outcomeAnimalStartDate,
        outcomeAnimalEndDateFilter: outcomeAnimalEndDate,
        outcomeActionedByFilter: outcomeActionedBy,
        equipmentStatusFilter: equipmentStatus,
        equipmentTypesFilter: equipmentTypes,
      } as ComplaintRequestPayload;
    case COMPLAINT_TYPES.SECTOR:
    default:
      return {
        ...common,
      } as ComplaintRequestPayload;
  }
};

export const ComplaintList: FC<Props> = ({ type, searchQuery }) => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(selectComplaintsByType(type));

  const totalComplaints = useAppSelector(selectTotalComplaintsByType(type));
  const defaultPageSize = useAppSelector(selectDefaultPageSize);
  const storedSearchParams = useAppSelector(selectComplaintSearchParameters);
  const { sortColumn, sortOrder } = storedSearchParams;
  const freshSearch = Object.keys(storedSearchParams).length === 2;

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);
  const [sortKey, setSortKey] = useState(freshSearch ? "incident_reported_utc_timestmp" : sortColumn);
  const [sortDirection, setSortDirection] = useState(freshSearch ? SORT_TYPES.DESC : sortOrder);

  const [page, setPage] = useState<number>(storedSearchParams.page ?? 1);
  const [pageSize, setPageSize] = useState<number>(storedSearchParams.pageSize ?? defaultPageSize); // Default to 10 results per page

  const storedTab = useAppSelector(selectActiveTab);
  const [activeTab, setActiveTab] = useState(storedTab);

  // If the user changed tabs, reset sortKey and sortOrder
  useEffect(() => {
    if (storedTab !== activeTab) {
      setActiveTab(storedTab);
      setSortKey("incident_reported_utc_timestmp");
      setSortDirection(SORT_TYPES.DESC);
    }
  }, [storedTab, activeTab]);

  useEffect(() => {
    let payload = generateComplaintRequestPayload(type, filters, page, pageSize, sortKey, sortDirection);
    if (searchQuery) {
      payload = { ...payload, query: searchQuery };
    }
    dispatch(getComplaints(type, payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filters, sortKey, sortDirection, page, pageSize]);

  useEffect(() => {
    //Refresh the list with the current filters when the search is cleared
    if (!searchQuery) {
      let payload = generateComplaintRequestPayload(type, filters, page, pageSize, sortKey, sortDirection);
      payload = { ...payload, query: searchQuery };
      dispatch(getComplaints(type, payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (defaultPageSize) {
      setPageSize(defaultPageSize);
    }
  }, [defaultPageSize]);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaints({ type: type, data: [] }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (sortInput: string) => {
    if (sortKey === sortInput) {
      setSortDirection(sortDirection === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC);
    } else {
      setSortKey(sortInput);
      setSortDirection(SORT_TYPES.ASC);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    scrollToTop();
  }, []);

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

      case COMPLAINT_TYPES.GIR:
        return (
          <GeneralComplaintListHeader
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        );
      case COMPLAINT_TYPES.HWCR:
        return (
          <WildlifeComplaintListHeader
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        );
      case COMPLAINT_TYPES.SECTOR:
      default:
        return (
          <SectorComplaintListHeader
            handleSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        );
    }
  };

  const renderNoComplaintsFound = () => {
    return (
      <tr>
        <td colSpan={11}>
          <i className="bi bi-info-circle-fill p-2"></i>
          <span>No complaints found using your current filters. Remove or change your filters to see complaints.</span>
        </td>
      </tr>
    );
  };

  return (
    <div className="comp-table-container">
      <div
        className="comp-table-scroll-container"
        ref={divRef}
      >
        <Table
          className="comp-table"
          id="complaint-list"
        >
          {renderComplaintListHeader(type)}
          <tbody>
            {totalComplaints === 0 && renderNoComplaintsFound()}
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
                case COMPLAINT_TYPES.GIR: {
                  return (
                    <GeneralInformationComplaintListItem
                      key={id}
                      type={type}
                      complaint={item as GeneralIncidentComplaint}
                    />
                  );
                }
                case COMPLAINT_TYPES.HWCR: {
                  return (
                    <WildlifeComplaintListItem
                      key={id}
                      type={type}
                      complaint={item as WildlifeComplaint}
                    />
                  );
                }
                case COMPLAINT_TYPES.SECTOR:
                default: {
                  return (
                    <SectorComplaintListItem
                      key={id}
                      complaint={item as Complaint}
                    />
                  );
                }
              }
            })}
          </tbody>
        </Table>
      </div>

      <Paginator
        currentPage={page}
        totalItems={totalComplaints}
        onPageChange={handlePageChange}
        resultsPerPage={pageSize}
        resetPageOnChange={true}
      />
    </div>
  );
};
