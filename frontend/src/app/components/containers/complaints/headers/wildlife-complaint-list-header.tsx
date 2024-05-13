import { FC } from "react";
import { SortableHeader } from "../../../common/sortable-header";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const WildlifeComplaintListHeader: FC<Props> = ({ handleSort, sortKey, sortDirection }) => {
  return (
    <thead className="fixed-table-header">
      <tr>
        <SortableHeader
          title="Incident#"
          sortFnc={handleSort}
          sortKey="complaint_identifier"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="sticky-col-left comp-cell-width-100 incident-col"
        />
        <SortableHeader
          id="incident-date-column"
          title="Date/Time"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-100"
        />
        <SortableHeader
          title="Nature of Complaint"
          sortFnc={handleSort}
          sortKey="hwcr_complaint_nature_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Species"
          sortFnc={handleSort}
          sortKey="species_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Community"
          sortFnc={handleSort}
          sortKey="geo_organization_unit_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <th className="unsortable">
          <div className="comp-header-label">Location/Address</div>
        </th>

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Officer Assigned"
          sortFnc={handleSort}
          sortKey="last_name"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          id="update-date-column"
          title="Last Updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <th className="sticky-col-right actions-col">Actions</th>
      </tr>
    </thead>
  );
};
