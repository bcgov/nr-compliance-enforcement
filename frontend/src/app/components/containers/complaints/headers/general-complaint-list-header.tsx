import { FC } from "react";
import { SortableHeader } from "@components/common/sortable-header";

type Props = {
  handleSort: Function;
  sortKey: string;
  sortDirection: string;
};

export const GeneralComplaintListHeader: FC<Props> = ({ handleSort, sortKey, sortDirection }) => {
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
          title="GIR type"
          sortFnc={handleSort}
          sortKey="gir_type_code"
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

        <th className="unsortable">
          <div className="comp-header-label">Location/address</div>
        </th>

        <SortableHeader
          title="Status"
          sortFnc={handleSort}
          sortKey="complaint_status_code"
          currentSort={sortKey}
          sortDirection={sortDirection}
        />

        <SortableHeader
          title="Officer assigned"
          sortFnc={handleSort}
          sortKey="last_name"
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

        <th className="unsortable sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col gc-table-actions-cell">
          <div className="header-label">Actions</div>
        </th>
      </tr>
    </thead>
  );
};
