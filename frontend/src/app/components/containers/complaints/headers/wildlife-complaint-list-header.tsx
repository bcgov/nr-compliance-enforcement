import { FC } from "react";
import { SortableHeader } from "../../../common/sortable-header";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const WildlifeComplaintListHeader: FC<Props> = ({ handleSort, sortKey, sortDirection }) => {
  return (
    <thead>
      <tr>
        <SortableHeader
          title="Incident#"
          sortFnc={handleSort}
          sortKey="complaint_identifier"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="sticky-col-left incident-col"
        />
        <SortableHeader
          id="incident-date-column"
          title="Date/Time"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-120"
        />
        <SortableHeader
          title="Nature of Complaint"
          sortFnc={handleSort}
          sortKey="hwcr_complaint_nature_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-200"
        />

        <SortableHeader
          title="Species"
          sortFnc={handleSort}
          sortKey="species_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="species-col"
        />

        <SortableHeader
          title="Community"
          sortFnc={handleSort}
          sortKey="geo_organization_unit_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-140"
        />

        <th className="comp-cell-width-180 unsortable">
          <div className="comp-header-label">Location/Address</div>
        </th>

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="status-col"
        />

        <SortableHeader
          title="Officer Assigned"
          sortFnc={handleSort}
          sortKey="last_name"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="assigned-col"
        />

        <SortableHeader
          id="update-date-column"
          title="Last Updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-120"
        />

        <th className="sticky-col-right actions-col">Actions</th>
      </tr>
    </thead>
  );
};
