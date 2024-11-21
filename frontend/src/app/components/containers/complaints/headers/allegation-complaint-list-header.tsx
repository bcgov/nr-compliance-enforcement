import { FC } from "react";
import { SortableHeader } from "@components/common/sortable-header";
import UserService from "@service/user-service";
import Roles from "@apptypes/app/roles";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const AllegationComplaintListHeader: FC<Props> = ({ handleSort, sortKey, sortDirection }) => {
  return (
    <thead className="sticky-table-header">
      <tr>
        <SortableHeader
          title="Incident#"
          sortFnc={handleSort}
          sortKey="complaint_identifier"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left"
        />

        <SortableHeader
          id="incident-date-column"
          title="Date/Time"
          sortFnc={handleSort}
          sortKey="incident_reported_utc_timestmp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          className="comp-cell-width-160 comp-cell-min-width-160"
        />

        <SortableHeader
          title="Violation Type"
          sortFnc={handleSort}
          sortKey="violation_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        {/* customization 1:, if there are more than 2 of these exceptions create a new listview item */}
        {!UserService.hasRole([Roles.CEEB_COMPLIANCE_COORDINATOR, Roles.CEEB]) && (
          <SortableHeader
            title="Violation In Progress"
            sortFnc={handleSort}
            sortKey="in_progress_ind"
            currentSort={sortKey}
            sortDirection={sortDirection}
          />
        )}

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
          title="Last Updated"
          sortFnc={handleSort}
          sortKey="update_utc_timestamp"
          currentSort={sortKey}
          sortDirection={sortDirection}
          id="update-date-column"
          className="comp-cell-width-160 comp-cell-min-width-160"
        />

        <th className="unsortable sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col ac-table-actions-cell">
          <div className="header-label">Actions</div>
        </th>
      </tr>
    </thead>
  );
};
