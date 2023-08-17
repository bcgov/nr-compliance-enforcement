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
import { SORT_DIRECTIONS } from "../../../constants/sort-direction";
import { SortableHeader } from '../../common/sortable-header';

type Props = {
  type: string;
};

export const ComplaintList: FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(selectComplaintsByType(type));

  const { filters } = useContext(ComplaintFilterContext);

  const [sort, setSort] = useState(["incident_reported_datetime", "DESC"]);

  const [sortKey, setSortKey] = useState("incident_reported_datetime");
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.DECENDING);

  useEffect(() => {
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
  }, [type]);

  const handleSort = () => { 

  }

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
          />
          {/* <th className="comp-small-cell comp-header-cell comp-top-left comp-cell-left">
            <div className="comp-header-label">Incident#</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("complaint_identifier")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th> */}
          {/* <th className="comp-small-cell comp-header-cell">
            <div className="comp-header-label">Date/Time</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("incident_reported_datetime")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-nature-complaint-cell comp-header-cell">
            <div className="comp-header-label">Nature of Complaint</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("hwcr_complaint_nature_code")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-medium-cell comp-header-cell">
            <div className="comp-header-label">Species</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("species_code")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-area-cell comp-header-cell">
            <div className="comp-header-label">Community</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("geo_organization_unit_code")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-location-cell comp-header-cell">
            <div className="comp-header-label">Location/Address</div>
          </th>
          <th className="comp-medium-cell comp-header-cell">
            <div className="comp-header-label">Officer Assigned</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("last_name")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-status-cell comp-header-cell">
            <div className="comp-header-label">Status</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("complaint_status_code")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-last-updated-cell comp-header-cell">
            <div className="comp-header-label">Last Updated</div>
            <div
              className="comp-header-caret"
              onClick={() => handleSort("update_timestamp")}
            >
              <img src={carets} alt="sort" />
            </div>
          </th>
          <th className="comp-ellipsis-cell comp-header-cell comp-top-right">
            <div className="comp-header-label">
              <i className="bi bi-three-dots-vertical"></i>
            </div>
          </th> */}
        </tr>
      );
    };

    const renderAllegationHeader = () => {
      return <thead className="comp-table-header"></thead>;
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
