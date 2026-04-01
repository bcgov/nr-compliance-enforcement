import { FC } from "react";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
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
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";

import {
  actionsColumn,
  authorizationColumn,
  communityColumn,
  complaintNumberColumn,
  dateLoggedColumn,
  lastUpdatedColumn,
  locationAddressColumn,
  officerAssignedColumn,
  parkColumn,
  statusColumn,
  violationInProgressColumn,
  violationTypeColumn,
} from "@/app/components/containers/complaints/lists/complaint-column-definitions";

type Props = {
  complaints: AllegationComplaint[];
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const AllegationComplaintList: FC<Props> = ({
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
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const officers = useAppSelector(selectOfficers);

  const isParkColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.PARK_COLUMN));
  const isLocationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.LOCATION_COLUMN));
  const isAuthorizationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.AUTHORIZATION_COLUMN));
  const isCeebRole = UserService.hasRole([Roles.CEEB, Roles.CEEB_COMPLIANCE_COORDINATOR]);

  const userAgency = getUserAgency();

  const getStatusDescription = (input: string): string => {
    if (input === "Referred") return "Referred";
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code?.longDescription ?? "";
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code?.longDescription ?? "";
  };

  const columns: CompColumn<AllegationComplaint>[] = [
    complaintNumberColumn<AllegationComplaint>(COMPLAINT_TYPES.ERS),
    dateLoggedColumn<AllegationComplaint>(),
    authorizationColumn<AllegationComplaint>(!isAuthorizationColumnEnabled),
    violationTypeColumn<AllegationComplaint>(getViolationDescription),
    violationInProgressColumn<AllegationComplaint>(isCeebRole),
    communityColumn<AllegationComplaint>(),
    parkColumn<AllegationComplaint>(!isParkColumnEnabled),
    locationAddressColumn<AllegationComplaint>(!isLocationColumnEnabled),
    statusColumn<AllegationComplaint>(userAgency, getStatusDescription),
    officerAssignedColumn<AllegationComplaint>((complaint) => getOfficerAssigned(complaint, officers) ?? ""),
    lastUpdatedColumn<AllegationComplaint>(),
    actionsColumn<AllegationComplaint>(COMPLAINT_TYPES.ERS),
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
