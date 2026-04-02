import { FC, useCallback } from "react";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { SORT_TYPES } from "@constants/sort-direction";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { AgencyType } from "@/app/types/app/agency-types";
import Option from "@apptypes/app/option";

const EMPTY = "—";

type Props = {
  officers: AppUser[];
  activeAgencyTab: string;
  offices: Array<{ id: string; name: string; agency: string }> | undefined;
  parkAreas: Option[] | undefined;
  teams: Option[] | undefined;
  agencyDetailLabel: string;
  onSort: (sortKey: string, sortDirection: string) => void;
};

// Helper functions moved from SelectUser
const getAgencyLabel = (officer: AppUser): string => officer.agency_code?.shortDescription ?? EMPTY;

const getOfficeDisplayName = (
  officer: AppUser,
  offices: Array<{ id: string; name: string; agency: string }> | undefined,
): string => {
  const og = officer.office_guid;
  if (!og) return EMPTY;
  if (typeof og === "object" && og?.cos_geo_org_unit?.office_location_name) {
    return og.cos_geo_org_unit.office_location_name;
  }
  const guid = typeof og === "string" ? og : (og as { office_guid?: string })?.office_guid;
  if (!guid || !offices?.length) return EMPTY;
  const office = offices.find((o) => o.id === guid);
  return office?.name ?? EMPTY;
};

const getParkAreaDisplayName = (parkAreaGuid: string | null, parkAreas: Option[] | undefined): string => {
  if (!parkAreaGuid || !parkAreas?.length) return EMPTY;
  const found = parkAreas.find((p) => p.value === parkAreaGuid);
  return (found?.label as string) ?? EMPTY;
};

const getTeamDisplayName = (teamCode: string | undefined, teams: Option[] | undefined): string => {
  if (!teamCode || !teams?.length) return EMPTY;
  const found = teams.find((t) => t.value === teamCode);
  return (found?.label as string) ?? EMPTY;
};

const getAgencyDetailDisplay = (
  u: AppUser,
  offices: Array<{ id: string; name: string; agency: string }> | undefined,
  parkAreas: Option[] | undefined,
  teams: Option[] | undefined,
): string => {
  const code = u.agency_code?.agency;
  switch (code) {
    case AgencyType.COS:
      return getOfficeDisplayName(u, offices);
    case AgencyType.PARKS:
      return getParkAreaDisplayName(u.park_area_guid, parkAreas);
    case AgencyType.CEEB:
      return getTeamDisplayName(u.team_code as string | undefined, teams);
    default:
      return EMPTY;
  }
};

const getZoneDisplayName = (officer: AppUser): string => officer.office_guid?.cos_geo_org_unit?.zone_name ?? EMPTY;

const getRegionDisplayName = (officer: AppUser): string => officer.office_guid?.cos_geo_org_unit?.region_name ?? EMPTY;

export const UserList: FC<Props> = ({
  officers,
  activeAgencyTab,
  offices,
  parkAreas,
  teams,
  agencyDetailLabel,
  onSort,
}) => {
  const getAgencyDetail = useCallback(
    (u: AppUser) => getAgencyDetailDisplay(u, offices, parkAreas, teams),
    [offices, parkAreas, teams],
  );

  const columns: CompColumn<AppUser>[] = [
    {
      label: "Name (last, first)",
      sortKey: "name",
      isSortable: true,
      getValue: (u) => `${(u.last_name ?? "").toLowerCase()}, ${(u.first_name ?? "").toLowerCase()}`,
      renderCell: (u) => (
        <>
          {u.last_name}, {u.first_name}
          {u.deactivate_ind ? " (deactivated)" : ""}
        </>
      ),
    },
    {
      label: "User ID",
      sortKey: "user_id",
      isSortable: true,
      getValue: (u) => (u.user_id ?? EMPTY).toLowerCase(),
      renderCell: (u) => u.user_id ?? EMPTY,
    },
    {
      label: "Agency",
      sortKey: "agency",
      isSortable: true,
      getValue: (u) => getAgencyLabel(u).toLowerCase(),
      renderCell: (u) => getAgencyLabel(u),
    },
    {
      label: agencyDetailLabel,
      sortKey: "agency_detail",
      isSortable: true,
      getValue: (u) => getAgencyDetail(u).toLowerCase(),
      renderCell: (u) => getAgencyDetail(u),
    },
    {
      label: "Zone",
      sortKey: "zone",
      isSortable: true,
      isHidden: activeAgencyTab !== AgencyType.COS,
      getValue: (u) => getZoneDisplayName(u).toLowerCase(),
      renderCell: (u) => getZoneDisplayName(u),
    },
    {
      label: "Region",
      sortKey: "region",
      isSortable: true,
      isHidden: activeAgencyTab !== AgencyType.COS,
      getValue: (u) => getRegionDisplayName(u).toLowerCase(),
      renderCell: (u) => getRegionDisplayName(u),
    },
    {
      label: "Role",
      sortKey: "role",
      isSortable: true,
      getValue: (u) => (u.user_roles?.length ? u.user_roles.join(", ") : EMPTY).toLowerCase(),
      renderCell: (u) => (u.user_roles?.length ? u.user_roles.join(", ") : EMPTY),
    },
  ];

  return (
    <CompTable
      data={officers}
      tableIdentifier="user-list"
      isFixedHeight={false}
      columns={columns}
      getRowKey={(u) => u.app_user_guid}
      defaultSortLabel="Name (last, first)"
      defaultSortDirection={SORT_TYPES.ASC}
      emptyMessage="No users to display for this agency."
      onSort={onSort}
      pageSize={1000}
    />
  );
};
