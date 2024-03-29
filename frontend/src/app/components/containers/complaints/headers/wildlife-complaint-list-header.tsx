import { FC } from "react";
import { SortableHeader } from "../../../common/sortable-header";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const WildlifeComplaintListHeader: FC<Props> = ({
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
          className="comp-cell-width-95 comp-header-left-radius"
        />
        <SortableHeader
          id="incident-date-column"
          title="Date/Time"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-95 comp-header-horizontal-border  comp-header-vertical-border"
        />
        <SortableHeader
          title="Nature of Complaint"
          sortFnc={handleSort}
          sortKey="hwcr_complaint_nature_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-330 comp-header-horizontal-border"
        />

        <SortableHeader
          title="Species"
          sortFnc={handleSort}
          sortKey="species_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-130 comp-header-horizontal-border comp-header-vertical-border"
        />

        <SortableHeader
          title="Community"
          sortFnc={handleSort}
          sortKey="geo_organization_unit_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-165 comp-header-horizontal-border"
        />
        <th className="comp-cell-width-170 comp-header-horizontal-border comp-header-vertical-border-left unsortable">
          <div className="comp-header-label">Location/Address</div>
        </th>

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-75 comp-header-horizontal-border comp-header-vertical-border"
        />

        <SortableHeader
          title="Officer Assigned"
          sortFnc={handleSort}
          sortKey="last_name"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-130 comp-header-horizontal-border"
        />

        <SortableHeader
          id="update-date-column"
          title="Last Updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-110 comp-header-horizontal-border comp-header-right-radius"
        />
      </tr>
    </thead>
  );
};
