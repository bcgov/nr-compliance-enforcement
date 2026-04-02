import { FC, useRef, useState, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import {
  getComplaints,
  selectComplaintsByType,
  setComplaints,
  selectTotalComplaintsByType,
  selectComplaintSearchParameters,
} from "@store/reducers/complaints";

import { SORT_TYPES } from "@constants/sort-direction";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "@/app/types/complaints/complaint-filters/complaint-request-payload";
import { selectActiveTab, selectDefaultPageSize } from "@store/reducers/app";

//-- new models
import { ComplaintTableList } from "@/app/components/containers/complaints/lists/complaint-table-list";

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
    agency,
    complaintType: filterComplaintType, // awkward name due to existing complaintType in component props
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
    agencyFilter: agency,
    complaintTypeFilter: filterComplaintType,
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
    showReferrals: complaintType === "ERS",
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
        speciesCodeFilter: species,
        natureOfComplaintFilter: natureOfComplaint,
        violationFilter: violationType,
        outcomeAnimalFilter: outcomeAnimal,
        outcomeAnimalStartDateFilter: outcomeAnimalStartDate,
        outcomeAnimalEndDateFilter: outcomeAnimalEndDate,
        outcomeActionedByFilter: outcomeActionedBy,
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

  // Single useEffect for if tab, filters, sort or search is changed
  useEffect(() => {
    // If tab changed, update state and return early (don't fetch yet)
    if (storedTab !== activeTab) {
      setActiveTab(storedTab);
      setSortKey("incident_reported_utc_timestmp");
      setSortDirection(SORT_TYPES.DESC);
      setPage(1);
      return; // prevent fetch with old sort key
    }

    // Only run fetch when state is settled
    let payload = generateComplaintRequestPayload(type, filters, page, pageSize, sortKey, sortDirection);
    payload.query = searchQuery ?? "";
    dispatch(getComplaints(type, payload));
  }, [storedTab, activeTab, type, filters, sortKey, sortDirection, page, pageSize, searchQuery]);

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

  // Scroll to top of table container when paginating
  const divRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    divRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderComplaintList = (type: string): JSX.Element => (
    <ComplaintTableList
      key={type}
      complaints={complaints}
      complaintType={type}
      isLoading={false}
      error={null}
      totalItems={totalComplaints}
      currentPage={page}
      pageSize={pageSize}
      onSort={(key, direction) => {
        setSortKey(key);
        setSortDirection(direction);
      }}
      onPageChange={(newPage) => {
        setPage(newPage);
        scrollToTop();
      }}
    />
  );

  return (
    <div
      className="comp-table-container"
      ref={divRef}
    >
      {renderComplaintList(type)}
    </div>
  );
};
