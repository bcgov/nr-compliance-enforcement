import { FC } from "react";
import { SortableHeader } from "../../../common/sortable-header";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const AllegationComplaintListHeader: FC<Props> = ({
  handleSort,
  sortKey,
  sortDirection,
}) => {
  return (
    <thead className="fixed-table-header">
      <tr>
        <SortableHeader
          title="Incident#"
          sortFnc={handleSort}
          sortKey="complaint_identifier"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-95 comp-header-left-radius "
        />

        <SortableHeader
          id="incident-date-column"
          title="Date/Time"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-95 comp-header-horizontal-border comp-header-vertical-border"
        />

        <SortableHeader
          title="Violation Type"
          sortFnc={handleSort}
          sortKey="violation_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-305 comp-header-horizontal-border "
        />

        <SortableHeader
          title="Violation In Progress"
          sortFnc={handleSort}
          sortKey="in_progress_ind"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-155 comp-header-horizontal-border comp-header-vertical-border"
        />

        <SortableHeader
          title="Community"
          sortFnc={handleSort}
          sortKey="geo_organization_unit_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-165 comp-header-horizontal-border"
        />
        <th className="comp-cell-width-170 comp-header-horizontal-border comp-header-vertical-border unsortable">
          <div className="comp-header-label">Location/Address</div>
        </th>

        <SortableHeader
          title="Officer Assigned"
          sortFnc={handleSort}
          sortKey="last_name"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-130 comp-header-horizontal-border"
        />

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-75 comp-header-horizontal-border comp-header-vertical-border"
        />

        <SortableHeader
          title="Last Updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-110 comp-header-horizontal-border"
          id="update-date-column"
        />

        <th className="comp-cell-width-30 comp-header-right-radius unsortable">
          <div className="comp-header-label">
            <i className="bi bi-three-dots-vertical"></i>
          </div>
        </th>
      </tr>
    </thead>
  );
};
