import { FC, useState, useContext, useEffect } from "react";
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
import {
  selectDefaultPageSize,
  selectDefaultZone,
} from "../../../store/reducers/app";
import { WildlifeComplaintListItem } from "./list-items/wildlife-complaint-list-item";
import { HwcrComplaint } from "../../../types/complaints/hwcr-complaint";
import { useNavigate } from "react-router-dom";
import { AllegationComplaintListItem } from "./list-items/allegation-complaint-list-item";
import { AllegationComplaint } from "../../../types/complaints/allegation-complaint";
import ComplaintPagination from "../../common/complaint-pagination";

type Props = {
  type: string;
};

export const ComplaintList: FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(selectComplaintsByType(type));
  const navigate = useNavigate();

  const totalComplaints = useAppSelector(selectTotalComplaintsByType(type));
  const defaultPageSize = useAppSelector(selectDefaultPageSize);

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

  const [sortKey, setSortKey] = useState("incident_reported_utc_timestmp");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize); // Default to 10 results per page

  const generateComplaintRequestPayload = (
    complaintType: string,
    filters: ComplaintFilters,
    page: number,
    pageSize: number
  ): ComplaintRequestPayload => {
    const {
      region,
      zone,
      community,
      officer,
      startDate,
      endDate,
      status,
      species,
      natureOfComplaint,
      violationType,
    } = filters;

    const common = {
      sortColumn: sortKey,
      sortOrder: sortDirection,
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

  const defaultZone = useAppSelector(selectDefaultZone);

  useEffect(() => {
    if (defaultZone) {
      const payload = generateComplaintRequestPayload(
        type,
        filters,
        page,
        pageSize
      );

      dispatch(getComplaints(type, payload));
    }
  }, [filters, sortKey, sortDirection, page, pageSize]);

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
      setSortDirection(
        sortDirection === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC
      );
    } else {
      setSortKey(sortInput);
      setSortDirection(SORT_TYPES.ASC);
    }
  };

  const handleComplaintClick = (
    e: any, //-- this needs to be updated to use the correct type when updating <Row> to <tr>
    id: string
  ) => {
    e.preventDefault();

    navigate(`/complaint/${type}/${id}`);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "auto" });
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
    <>
      <Table id="complaint-list">
        {renderComplaintListHeader(type)}
        <tbody>
          {complaints?.map((item) => {
            const { complaint_identifier: complaint } = item;
            const { complaint_identifier } = complaint;

            switch (type) {
              case COMPLAINT_TYPES.ERS:
                return (
                  <AllegationComplaintListItem
                    key={complaint_identifier}
                    type={type}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    complaint={item as AllegationComplaint}
                    complaintClick={handleComplaintClick}
                  />
                );
              case COMPLAINT_TYPES.HWCR:
              default:
                return (
                  <WildlifeComplaintListItem
                    key={complaint_identifier}
                    type={type}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    complaint={item as HwcrComplaint}
                    complaintClick={handleComplaintClick}
                  />
                );
            }
          })}
        </tbody>
      </Table>

      <ComplaintPagination
        currentPage={page}
        totalItems={totalComplaints}
        onPageChange={handlePageChange}
        resultsPerPage={pageSize}
      />
    </>
  );
};
