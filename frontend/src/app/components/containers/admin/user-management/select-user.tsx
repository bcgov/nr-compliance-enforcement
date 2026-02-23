import { Dispatch, FC, SetStateAction, useEffect, useMemo, useCallback, useState } from "react";
import { Button, Nav, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectOfficers } from "@store/reducers/officer";
import { fetchOfficeAssignments } from "@store/reducers/office";
import { selectOffices } from "@store/reducers/office";
import { selectParkAreasDropdown } from "@store/reducers/code-table-selectors";
import { CompSelect } from "@components/common/comp-select";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import Option from "@apptypes/app/option";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { AgencyType } from "@/app/types/app/agency-types";
import { Agency } from "@apptypes/app/code-tables/agency";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";
import "@assets/sass/user-management.scss";

interface SelectUserProps {
  officer: any;
  officerError: string;
  setOfficer: Dispatch<SetStateAction<Option | undefined>>;
  setOfficerError: Dispatch<SetStateAction<string>>;
  handleEdit: () => void;
  handleAddNewUser: () => void;
}

// String used for an empty value (e.g. when a user has no office assigned)
const EMPTY = "—";

function getOfficerAgencyCode(officer: AppUser): string | undefined {
  return officer.agency_code?.agency;
}

function getAgencyLabel(officer: AppUser): string {
  return officer.agency_code?.shortDescription ?? EMPTY;
}

function getAgencyLabelByCode(agencyCode: string, agencyCodes: Agency[] | undefined): string {
  return agencyCodes?.find(({ agency }) => agency === agencyCode)?.shortDescription ?? agencyCode;
}

function getOfficeDisplayName(
  officer: AppUser,
  offices: Array<{ id: string; name: string; agency: string }> | undefined,
): string {
  const og = officer.office_guid;
  if (!og) return EMPTY;
  if (typeof og === "object" && og?.cos_geo_org_unit?.office_location_name) {
    return og.cos_geo_org_unit.office_location_name;
  }
  const guid = typeof og === "string" ? og : (og as { office_guid?: string })?.office_guid;
  if (!guid || !offices?.length) return EMPTY;
  const office = offices.find((o) => o.id === guid);
  return office?.name ?? EMPTY;
}

function getParkAreaDisplayName(parkAreaGuid: string | null, parkAreas: Option[] | undefined): string {
  if (!parkAreaGuid || !parkAreas?.length) return EMPTY;
  const found = parkAreas.find((p) => p.value === parkAreaGuid);
  return (found?.label as string) ?? EMPTY;
}

// Gets agency specific area / office assignment
function getAgencyDetailDisplay(
  u: AppUser,
  offices: Array<{ id: string; name: string; agency: string }> | undefined,
  parkAreas: Option[] | undefined,
): string {
  const code = getOfficerAgencyCode(u);
  switch (code) {
    case AgencyType.COS:
      return getOfficeDisplayName(u, offices);
    case AgencyType.PARKS:
      return getParkAreaDisplayName(u.park_area_guid, parkAreas);
    case AgencyType.CEEB: // EPO
      return EMPTY; // Team not on officer
    default:
      return EMPTY;
  }
}

type SortColumn = "name" | "user_id" | "agency" | "agency_detail" | "role";

// Agencies with a dedicated tab / table
const AGENCY_TAB_CODES = [AgencyType.COS, AgencyType.PARKS, AgencyType.CEEB, AgencyType.SECTOR] as const;

// Labels for the agency detail column
const AGENCY_DETAIL_COLUMN_LABEL: Record<string, string> = {
  [AgencyType.COS]: "Office",
  [AgencyType.PARKS]: "Park area",
  [AgencyType.CEEB]: "Team",
  [AgencyType.SECTOR]: "—",
};

const SORT_COLUMNS: SortColumn[] = ["name", "user_id", "agency", "agency_detail", "role"];

function compareStrings(a: string, b: string, dir: string): number {
  const aa = (a ?? "").toLowerCase();
  const bb = (b ?? "").toLowerCase();
  const cmp = aa.localeCompare(bb, undefined, { sensitivity: "base" });
  return dir === SORT_TYPES.ASC ? cmp : -cmp;
}

export const SelectUser: FC<SelectUserProps> = ({
  setOfficer,
  setOfficerError,
  handleAddNewUser,
  officer,
  officerError,
  handleEdit,
}) => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficers);
  const offices = useAppSelector(selectOffices);
  const parkAreas = useAppSelector(selectParkAreasDropdown);
  const agencyCodes = useAppSelector((state) => state.codeTables.agency);
  const [activeAgencyTab, setActiveAgencyTab] = useState<string>(AgencyType.COS);
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<string>(SORT_TYPES.ASC);

  // Tabs the active user can see: GLOBAL_ADMINISTRATOR sees all
  // AGENCY_ADMINISTRATOR sees COS, CEEB, PARKS based on their core roles
  const visibleTabCodes = useMemo((): string[] => {
    if (UserService.hasRole(Roles.GLOBAL_ADMINISTRATOR)) {
      return [...AGENCY_TAB_CODES];
    }
    if (UserService.hasRole(Roles.AGENCY_ADMINISTRATOR)) {
      const tabs: string[] = [];
      if (UserService.hasRole(Roles.COS)) tabs.push(AgencyType.COS);
      if (UserService.hasRole(Roles.CEEB)) tabs.push(AgencyType.CEEB); // EPO
      if (UserService.hasRole(Roles.PARKS)) tabs.push(AgencyType.PARKS);
      return tabs;
    }
    return [];
  }, []);

  useEffect(() => {
    dispatch(fetchOfficeAssignments());
  }, [dispatch]);

  useEffect(() => {
    if (visibleTabCodes.length > 0 && !visibleTabCodes.includes(activeAgencyTab)) {
      setActiveAgencyTab(visibleTabCodes[0]);
    }
  }, [visibleTabCodes, activeAgencyTab]);

  const handleSort = useCallback(
    (sortInput: string) => {
      if (sortColumn === sortInput) {
        setSortDirection((prev) => (prev === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC));
      } else {
        setSortColumn(sortInput as SortColumn);
        setSortDirection(SORT_TYPES.ASC);
      }
    },
    [sortColumn],
  );

  const getSortKey = useCallback(
    (u: AppUser, sortCol: SortColumn): string => {
      switch (sortCol) {
        case "name":
          return `${(u.last_name ?? "").toLowerCase()}, ${(u.first_name ?? "").toLowerCase()}`;
        case "user_id":
          return (u.user_id ?? EMPTY).toLowerCase();
        case "agency":
          return getAgencyLabel(u).toLowerCase();
        case "agency_detail":
          return getAgencyDetailDisplay(u, offices, parkAreas).toLowerCase();
        case "role":
          return (u.user_roles?.length ? u.user_roles.join(", ") : EMPTY).toLowerCase();
        default:
          return "";
      }
    },
    [offices, parkAreas],
  );

  // Filter officers by tab: each officer's agency comes from officer.agency_code.agency (EPO, COS, PARKS, NRS/SECTOR).
  const officersByAgency = useMemo(() => {
    if (!officers?.length) return {} as Record<string, AppUser[]>;
    return AGENCY_TAB_CODES.reduce(
      (acc, code) => {
        acc[code] = officers.filter((u) => {
          const officerAgency = getOfficerAgencyCode(u);
          if (code === AgencyType.SECTOR) return officerAgency === "NRS" || officerAgency === "SECTOR";
          return officerAgency === code;
        });
        return acc;
      },
      {} as Record<string, AppUser[]>,
    );
  }, [officers]);

  const sortedOfficersForTab = useMemo(() => {
    const list = officersByAgency[activeAgencyTab as keyof typeof officersByAgency] ?? [];
    return [...list].sort((a, b) =>
      compareStrings(getSortKey(a, sortColumn), getSortKey(b, sortColumn), sortDirection),
    );
  }, [officersByAgency, activeAgencyTab, sortColumn, sortDirection, getSortKey]);

  const officerList = useMemo(
    () =>
      officers?.map((o: AppUser) => ({
        value: o.app_user_guid,
        label: `${o.last_name}, ${o.first_name} ${o.deactivate_ind ? "(deactivated user)" : ""}`,
      })) ?? [],
    [officers],
  );

  const agencyTabsWithLabels = useMemo(
    () =>
      AGENCY_TAB_CODES.map((code) => ({
        code,
        label: getAgencyLabelByCode(code, agencyCodes) || code,
      })).filter(({ code }) => visibleTabCodes.includes(code)),
    [agencyCodes, visibleTabCodes],
  );

  const handleOfficerChange = (input: Option | null | undefined) => {
    setOfficerError("");
    if (input?.value) setOfficer(input);
  };

  const handleCancel = () => {
    setOfficer({ value: "", label: "" });
  };

  return (
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h3>User administration</h3>
          <Button
            variant="primary"
            onClick={handleAddNewUser}
          >
            <i className="comp-sidenav-item-icon bi bi-plus-circle"></i>Add new user
          </Button>
        </div>

        <p className="admin-subtitle">
          After selecting a user, click <strong>Edit</strong> for more options, such as: choosing an agency,
          team/office, specifying roles, updating the last name and/or email address, temporarily disabling or deleting
          the user.
        </p>
      </div>
      <section className="comp-details-section">
        <div>
          <dl className="comp-call-details-group">
            <div>
              <dt>Search User</dt>
              <dd>
                <CompSelect
                  id="species-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(evt) => handleOfficerChange(evt)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={officerList}
                  placeholder="Search"
                  enableValidation={true}
                  value={officer}
                  errorMessage={officerError}
                />
              </dd>
            </div>
          </dl>
          <div className="admin-button-groups">
            <Button
              variant="outline-primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>{" "}
            &nbsp;
            <Button
              variant="primary"
              onClick={handleEdit}
              disabled={officer && officer.value === ""}
            >
              Edit
            </Button>
          </div>
        </div>
      </section>

      {visibleTabCodes.length > 0 && (
        <section className="comp-details-section mt-4">
          <h4 className="mb-3">Users by agency</h4>
          <Nav className="nav nav-tabs mb-3">
            {agencyTabsWithLabels.map(({ code, label }) => (
              <Nav.Item
                className={`nav-item comp-tab comp-tab-${activeAgencyTab === code ? "active" : "inactive"}`}
                key={`${code}-tab`}
              >
                <Nav.Link
                  className={`nav-link ${activeAgencyTab === code ? "active" : ""}`}
                  id={`${code}-tab`}
                  onClick={() => setActiveAgencyTab(code)}
                >
                  {label} ({officersByAgency[code as keyof typeof officersByAgency]?.length ?? 0})
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="comp-table-container">
            <div className="comp-table-scroll-container">
              <Table
                className="comp-table"
                id="user-list"
              >
                <thead className="sticky-table-header">
                  <tr>
                    <SortableHeader
                      title="Name (last, first)"
                      sortFnc={handleSort}
                      sortKey="name"
                      currentSort={sortColumn}
                      sortDirection={sortDirection}
                    />
                    <SortableHeader
                      title="User ID"
                      sortFnc={handleSort}
                      sortKey="user_id"
                      currentSort={sortColumn}
                      sortDirection={sortDirection}
                    />
                    <SortableHeader
                      title="Agency"
                      sortFnc={handleSort}
                      sortKey="agency"
                      currentSort={sortColumn}
                      sortDirection={sortDirection}
                    />
                    <SortableHeader
                      title={AGENCY_DETAIL_COLUMN_LABEL[activeAgencyTab] ?? EMPTY}
                      sortFnc={handleSort}
                      sortKey="agency_detail"
                      currentSort={sortColumn}
                      sortDirection={sortDirection}
                    />
                    <SortableHeader
                      title="Role"
                      sortFnc={handleSort}
                      sortKey="role"
                      currentSort={sortColumn}
                      sortDirection={sortDirection}
                    />
                  </tr>
                </thead>
                <tbody>
                  {sortedOfficersForTab.length ? (
                    sortedOfficersForTab.map((u) => (
                      <tr key={u.app_user_guid}>
                        <td>
                          {u.last_name}, {u.first_name}
                          {u.deactivate_ind ? " (deactivated)" : ""}
                        </td>
                        <td>{u.user_id ?? EMPTY}</td>
                        <td>{getAgencyLabel(u)}</td>
                        <td>{getAgencyDetailDisplay(u, offices, parkAreas)}</td>
                        <td>{u.user_roles?.length ? u.user_roles.join(", ") : EMPTY}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={SORT_COLUMNS.length}>
                        <i className="bi bi-info-circle-fill p-2"></i>
                        <span>No users to display for this agency.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
