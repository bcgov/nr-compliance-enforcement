import { FC } from "react";
import { SortableHeader } from "@components/common/sortable-header";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const SectorComplaintListHeader: FC<Props> = ({ handleSort, sortKey, sortDirection }) => {
  return (
    <thead className="sticky-table-header">
      <tr>
        <SortableHeader
          title="Complaint #"
          sortFnc={handleSort}
          sortKey="complaint_identifier"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left"
        />
        <SortableHeader
          id="incident-date-column"
          title="Date logged"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-160 comp-cell-min-width-160"
        />
        <SortableHeader
          title="Agency"
          sortFnc={handleSort}
          sortKey="lead_agency"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Complaint type"
          sortFnc={handleSort}
          sortKey="complaint_type"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Type of issue"
          sortFnc={handleSort}
          sortKey="issue_type"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Community"
          sortFnc={handleSort}
          sortKey="area_name"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <FeatureFlag feature={FEATURE_TYPES.LOCATION_COLUMN}>
          <th className="unsortable-header">
            <div className="header-label">Location/address</div>
          </th>
        </FeatureFlag>

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          id="update-date-column"
          title="Last updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-160 comp-cell-min-width-160"
        />
      </tr>
    </thead>
  );
};
