import { FC } from "react";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectOfficers } from "@store/reducers/officer";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { SORT_TYPES } from "@constants/sort-direction";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { getUserAgency } from "@/app/service/user-service";
import getOfficerAssigned from "@common/get-officer-assigned";

import {
  actionsColumn,
  communityColumn,
  complaintNumberColumn,
  dateLoggedColumn,
  girTypeColumn,
  lastUpdatedColumn,
  locationAddressColumn,
  officerAssignedColumn,
  parkColumn,
  statusColumn,
} from "@/app/components/containers/complaints/lists/complaint-column-definitions";

type Props = {
  complaints: GeneralIncidentComplaint[];
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const GeneralComplaintList: FC<Props> = ({
  complaints,
  totalItems,
  isLoading = false,
  error = null,
  onSort,
  onPageChange,
  currentPage,
  pageSize,
}) => {
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const officers = useAppSelector(selectOfficers);

  const isParkColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.PARK_COLUMN));
  const isLocationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.LOCATION_COLUMN));

  const userAgency = getUserAgency();

  const getStatusDescription = (input: string): string => {
    if (input === "Referred") return "Referred";
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code?.longDescription ?? "";
  };

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code?.longDescription ?? "";
  };

  const columns: CompColumn<GeneralIncidentComplaint>[] = [
    complaintNumberColumn<GeneralIncidentComplaint>(COMPLAINT_TYPES.GIR),
    dateLoggedColumn<GeneralIncidentComplaint>(),
    girTypeColumn<GeneralIncidentComplaint>(getGirTypeDescription),
    communityColumn<GeneralIncidentComplaint>(),
    parkColumn<GeneralIncidentComplaint>(!isParkColumnEnabled),
    locationAddressColumn<GeneralIncidentComplaint>(!isLocationColumnEnabled),
    statusColumn<GeneralIncidentComplaint>(userAgency, getStatusDescription),
    officerAssignedColumn<GeneralIncidentComplaint>((complaint) => getOfficerAssigned(complaint, officers) ?? ""),
    lastUpdatedColumn<GeneralIncidentComplaint>(),
    actionsColumn<GeneralIncidentComplaint>(COMPLAINT_TYPES.GIR),
  ];
  return (
    <CompTable
      data={complaints}
      emptyMessage="No complaints found using your current filters. Remove or change your filters to see complaints."
      columns={columns}
      getRowKey={(complaint) => complaint.id}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      defaultSortLabel="Date logged"
      defaultSortDirection={SORT_TYPES.DESC}
      onSort={onSort}
      onPageChange={onPageChange}
      renderExpandedContent={(complaint) => {
        const truncatedDescription = truncateString(complaint.details, 185);
        const truncatedLocationDetail = truncateString(complaint.locationDetail, 220);
        return (
          <dl className="hwc-table-dl">
            <div>
              <dt>Complaint description</dt>
              <dd>{truncatedDescription}</dd>
            </div>
            <div>
              <dt>Location description</dt>
              {truncatedLocationDetail ? <dd>{truncatedLocationDetail}</dd> : <dd>No location description provided</dd>}
            </div>
          </dl>
        );
      }}
    />
  );
};
function communityLookupColumn<T>(getLocationName: (input: string) => string): CompColumn<GeneralIncidentComplaint> {
  throw new Error("Function not implemented.");
}
