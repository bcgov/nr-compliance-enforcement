import { FC, useContext, useEffect, useState } from "react";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import {
  selectComplaintsByType,
  selectWildlifeComplaints,
} from "../../../store/reducers/complaints";
import { ComplaintFilterState } from "../../../types/providers/complaint-filter-provider-type";
import { Table } from "react-bootstrap";
import { SORT_TYPES } from "../../../constants/sort-direction";
import { SortableHeader } from "../../common/sortable-header";
import { getComplaints } from "../../../store/reducers/complaints";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters";

type Props = {
  type: string;
};

export const ComplaintList: FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(selectComplaintsByType(type));

  const { filters } = useContext(ComplaintFilterContext);

  const [sortKey, setSortKey] = useState("incident_reported_datetime");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);

  useEffect(() => {
    const payload = generaComplaintRequestPayload(type);
    console.log(payload)
    dispatch(getComplaints(type, payload));
  }, [dispatch, type]);

  useEffect(() => { 
    // const payload = generaComplaintRequestPayload(type);
    // console.log("derp")
    // dispatch(getComplaints(type, payload));
    console.log(filters)
  }, [filters, sortKey, sortDirection])

  const generaComplaintRequestPayload = (
    complaintType: string
  ): ComplaintFilters => {
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
    } = filters as ComplaintFilterState;

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
    };

    switch (complaintType) {
      case COMPLAINT_TYPES.ERS:
        return {
          ...common,
          violationFilter: violationType,
        } as ComplaintFilters;
      case COMPLAINT_TYPES.HWCR:
      default:
        return {
          ...common,
          speciesCodeFilter: species,
          natureOfComplaintFilter: natureOfComplaint,
        } as ComplaintFilters;
    }
  };

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

  const renderComplaintListHeader = (type: string): JSX.Element => {
    const renderWildlifeHeader = () => {
      return (
        <tr className="row">
          <SortableHeader
            title="Incident#"
            sortFnc={handleSort}
            sortKey="complaint_identifier"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-small-cell comp-header-cell comp-top-left comp-cell-left"
          />
          <SortableHeader
            title="Date/Time"
            sortFnc={handleSort}
            sortKey="incident_reported_datetime"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-small-cell comp-header-cell"
          />
          <SortableHeader
            title="Nature of Complaint"
            sortFnc={handleSort}
            sortKey="hwcr_complaint_nature_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-nature-complaint-cell comp-header-cell"
          />

          <SortableHeader
            title="Species"
            sortFnc={handleSort}
            sortKey="species_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-medium-cell comp-header-cell"
          />

          <SortableHeader
            title="Community"
            sortFnc={handleSort}
            sortKey="geo_organization_unit_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-area-cell comp-header-cell"
          />
          <th className="comp-location-cell comp-header-cell">
            <div className="comp-header-label">Location/Address</div>
          </th>

          <SortableHeader
            title="Officer Assigned"
            sortFnc={handleSort}
            sortKey="last_name"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-medium-cell comp-header-cell"
          />

          <SortableHeader
            title="Status"
            sortFnc={handleSort}
            sortKey="complaint_status_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-status-cell comp-header-cell"
          />

          <SortableHeader
            title="Last Updated"
            sortFnc={handleSort}
            sortKey="update_timestamp"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-last-updated-cell comp-header-cell"
          />

          <th className="comp-ellipsis-cell comp-header-cell comp-top-right">
            <div className="comp-header-label">
              <i className="bi bi-three-dots-vertical"></i>
            </div>
          </th>
        </tr>
      );
    };

    const renderAllegationHeader = () => {
      return (
        <tr className="row">
          <SortableHeader
            title="Incident#"
            sortFnc={handleSort}
            sortKey="complaint_identifier"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-small-cell comp-header-cell comp-top-left comp-cell-left"
          />

          <SortableHeader
            title="Date/Time"
            sortFnc={handleSort}
            sortKey="incident_reported_datetime"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-small-cell comp-header-cell"
          />

          <SortableHeader
            title="Violation Type"
            sortFnc={handleSort}
            sortKey="violation_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-violation-cell comp-header-cell"
          />

          <SortableHeader
            title="Violation In Progress"
            sortFnc={handleSort}
            sortKey="in_progress_ind"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-in-progress-cell comp-header-cell"
          />

          <SortableHeader
            title="Community"
            sortFnc={handleSort}
            sortKey="geo_organization_unit_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-area-cell comp-header-cell"
          />
          <th className="comp-location-cell comp-header-cell">
            <div className="comp-header-label">Location/Address</div>
          </th>

          <SortableHeader
            title="Officer Assigned"
            sortFnc={handleSort}
            sortKey="last_name"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-medium-cell comp-header-cell"
          />

          <SortableHeader
            title="Status"
            sortFnc={handleSort}
            sortKey="complaint_status_code"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-status-cell comp-header-cell"
          />

          <SortableHeader
            title="Last Updated"
            sortFnc={handleSort}
            sortKey="update_timestamp"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-last-updated-cell comp-header-cell"
          />

          <th className="comp-ellipsis-cell comp-header-cell comp-top-right">
            <div className="comp-header-label">
              <i className="bi bi-three-dots-vertical"></i>
            </div>
          </th>
        </tr>
      );
    };

    switch (type) {
      case COMPLAINT_TYPES.ERS:
        return renderAllegationHeader();
      case COMPLAINT_TYPES.HWCR:
      default:
        return renderWildlifeHeader();
    }
  };

  return (
    <Table id="comp-table" className="comp-table comp-table-header">
      <thead>{renderComplaintListHeader(type)}</thead>
    </Table>
  );
};
