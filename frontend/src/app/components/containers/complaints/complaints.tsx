import { FC, useState, useContext, useCallback, useEffect, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { Button, CloseButton, Collapse, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import { ComplaintFilterContext, ComplaintFilterProvider } from "@providers/complaint-filter-provider";
import { resetFilters, ComplaintFilterPayload } from "@store/reducers/complaint-filters";

import {
  isFeatureActive,
  selectDefaultZone,
  setActiveTab,
  selectActiveTab,
  selectActiveComplaintsViewType,
  setActiveComplaintsViewType,
  selectDefaultRegion,
  selectDefaultParkArea,
} from "@store/reducers/app";

import { ComplaintMapWithServerSideClustering } from "./complaint-map-with-server-side-clustering";
import { useNavigate } from "react-router-dom";
import { ComplaintListTabs } from "./complaint-list-tabs";
import { COMPLAINT_TYPES, CEEB_TYPES, HWCR_ONLY_TYPES, SECTOR_TYPES } from "@apptypes/app/complaint-types";
import { selectCurrentOfficer } from "@store/reducers/officer";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";
import Option from "@apptypes/app/option";
import { resetComplaintSearchParameters, selectComplaintSearchParameters } from "@/app/store/reducers/complaints";
import { AgencyType } from "@/app/types/app/agency-types";
import { DropdownOption } from "@/app/types/app/drop-down-option";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";

type Props = {
  defaultComplaintType: string;
};

export const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const { dispatch: filterDispatch } = useContext(ComplaintFilterContext); //-- make sure to keep this dispatch renamed

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showSectorView = useAppSelector(isFeatureActive(FEATURE_TYPES.SECTOR_VIEW));

  //-- Check global state for active tab and set it to default if it was not set there.
  const storedComplaintType = useAppSelector(selectActiveTab);
  useEffect(() => {
    if (!storedComplaintType) dispatch(setActiveTab(defaultComplaintType));
  }, [storedComplaintType, dispatch, defaultComplaintType]);

  useEffect(() => {
    if (UserService.hasRole([Roles.CEEB])) {
      dispatch(setActiveTab(CEEB_TYPES.ERS));
    }
  }, [dispatch]);

  const [complaintType, setComplaintType] = useState(() => {
    if (UserService.hasRole([Roles.CEEB])) {
      return CEEB_TYPES.ERS;
    } else if (UserService.hasRole([Roles.SECTOR])) {
      return SECTOR_TYPES.SECTOR;
    } else {
      return storedComplaintType ?? defaultComplaintType;
    }
  });

  const storedComplaintViewType = useAppSelector(selectActiveComplaintsViewType);
  useEffect(() => {
    if (!storedComplaintViewType) dispatch(setActiveComplaintsViewType("list"));
  }, [storedComplaintViewType, dispatch]);
  const [viewType, setViewType] = useState<"map" | "list">(storedComplaintViewType ?? "list");

  const currentOfficer = useAppSelector(selectCurrentOfficer);

  const defaultZone = useAppSelector(selectDefaultZone);
  const defaultRegion = useAppSelector(selectDefaultRegion);
  const defaultParkArea = useAppSelector(selectDefaultParkArea);

  //-- this is used to apply the search to the pager component
  const storedSearchParams = useAppSelector(selectComplaintSearchParameters);
  const [search, setSearch] = useState(storedSearchParams.query ?? "");

  const handleComplaintTabChange = (complaintType: string) => {
    setComplaintType(complaintType);
    dispatch(resetComplaintSearchParameters());
    let filters = getFilters(currentOfficer, defaultZone, defaultRegion, defaultParkArea);

    const payload: Array<ComplaintFilterPayload> = [
      ...Object.entries(filters).map(([filter, value]) => ({
        filter,
        value: value as Option | Date | null, // Explicitly casting value to the correct type
      })),
      { filter: "status", value: { value: "OPEN", label: "Open" } as Option },
    ];

    setSearch("");
    filterDispatch(resetFilters(payload));
    dispatch(setActiveTab(complaintType));
  };

  const handleCreateClick = () => {
    navigate(`/complaint/createComplaint`);
  };

  const toggleViewType = (view: "list" | "map") => {
    dispatch(setActiveComplaintsViewType(view));
    setViewType(view);
  };

  const sectorComplaintsTooltipOverlay = () => (
    <OverlayTrigger
      key="sector-complaints-tooltip-overlay"
      placement="right"
      trigger={["hover", "click"]}
      overlay={
        <Tooltip
          id={"sector-complaints-tooltip"}
          className="comp-tooltip comp-tooltip-right sector-complaints-tooltip"
          style={{
            maxWidth: "260px",
          }}
        >
          <p
            className="sector-complaint-info"
            style={{ marginBottom: 0, whiteSpace: "pre-line", wordBreak: "break-word" }}
          >
            Complaints containing sensitive information are hidden based on agency permissions.
          </p>
        </Tooltip>
      }
    >
      <p className="permission-info">
        <i
          id="sector-complaint-info-icon"
          className="bi bi-info-circle-fill"
        ></i>
      </p>
    </OverlayTrigger>
  );

  // Show/Hide Mobile Filters
  const [show, setShow] = useState(false);
  const hideFilters = () => setShow(false);
  const toggleShowMobileFilters = useCallback(() => setShow((prevShow) => !prevShow), []);

  const [open, setOpen] = useState(false);
  const toggleShowDesktopFilters = useCallback(() => setOpen((prevShow) => !prevShow), []);

  const complaintTypes = useMemo(() => Object.keys(getComplaintTypes(showSectorView)), [showSectorView]);

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <div className="title-text-container">
            <h1>Complaints</h1>
            {complaintType === COMPLAINT_TYPES.SECTOR && sectorComplaintsTooltipOverlay()}
          </div>
          {!UserService.hasRole(Roles.SECTOR) && (
            <Button onClick={() => handleCreateClick()}>
              <i className="bi bi-plus-circle"></i>Create complaint
            </Button>
          )}
        </div>
        {/* <!-- create list of complaint types --> */}

        <ComplaintListTabs
          complaintType={complaintType}
          viewType={viewType}
          complaintTypes={complaintTypes}
          onTabChange={handleComplaintTabChange}
        />

        <ComplaintFilterBar
          viewType={viewType}
          toggleViewType={toggleViewType}
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
          complaintType={complaintType}
          searchQuery={search}
          applySearchQuery={setSearch}
        />
      </div>

      <div className="comp-data-container">
        <Collapse
          in={open}
          dimension="width"
        >
          <div className="comp-data-filters">
            <div className="comp-data-filters-inner">
              <div className="comp-data-filters-header">
                Filter by{" "}
                <CloseButton
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  aria-label="Close filters"
                />
              </div>
              <div className="comp-data-filters-body">
                <ComplaintFilter type={complaintType} />
              </div>
            </div>
          </div>
        </Collapse>

        <div className="comp-data-list-map">
          {viewType === "list" ? (
            <ComplaintList
              type={complaintType}
              searchQuery={search}
            />
          ) : (
            <ComplaintMapWithServerSideClustering
              type={complaintType}
              searchQuery={search}
            />
          )}
        </div>
      </div>

      <Offcanvas
        show={show}
        onHide={hideFilters}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ComplaintFilter type={complaintType} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export const ComplaintsWrapper: FC<Props> = ({ defaultComplaintType }) => {
  const defaultZone = useAppSelector(selectDefaultZone, shallowEqual);
  const defaultRegion = useAppSelector(selectDefaultRegion);
  const defaultParkArea = useAppSelector(selectDefaultParkArea);
  const currentOfficer = useAppSelector(selectCurrentOfficer);
  const storedSearchParams = useAppSelector(selectComplaintSearchParameters);

  // If the search is fresh, there are only 2 default parameters set. If more than 2 exist,
  // this is not a fresh search as the search funtion itself sets more filters, even if blank.
  const freshSearch = Object.keys(storedSearchParams).length === 2;
  const complaintFilters = freshSearch
    ? getFilters(currentOfficer, defaultZone, defaultRegion, defaultParkArea)
    : storedSearchParams;
  return (
    <>
      {currentOfficer && (
        <ComplaintFilterProvider
          freshSearch={freshSearch}
          complaintFilters={complaintFilters}
        >
          <Complaints defaultComplaintType={defaultComplaintType} />
        </ComplaintFilterProvider>
      )}
    </>
  );
};
const getComplaintTypes = (showSectorView: boolean) => {
  let returnTypes;
  switch (true) {
    case UserService.hasRole(Roles.CEEB):
      returnTypes = CEEB_TYPES;
      break;
    case UserService.hasRole(Roles.HWCR_ONLY):
      returnTypes = HWCR_ONLY_TYPES;
      break;
    case UserService.hasRole(Roles.SECTOR):
      returnTypes = SECTOR_TYPES;
      break;
    default:
      returnTypes = COMPLAINT_TYPES;
      if (!showSectorView) {
        const { SECTOR, ...rest } = returnTypes;
        returnTypes = rest; // Remove SECTOR type if the feature is not active
      }
      break;
  }

  if (!showSectorView && returnTypes.hasOwnProperty("SECTOR")) {
    const { SECTOR, ...rest } = returnTypes as any;
    returnTypes = rest; // Remove SECTOR type if the feature is not active
  }

  return returnTypes;
};

// Sets the default filters
const getFilters = (
  currentOfficer: any,
  defaultZone: DropdownOption | null,
  defaultRegion: DropdownOption | null,
  defaultParkArea: DropdownOption | null,
) => {
  let filters: any = {};

  // If user has both Parks and Province-wide roles, default filter are "Open" and "Unassigned"
  if (UserService.hasRole(Roles.PROVINCE_WIDE) && UserService.hasRole(Roles.PARKS)) {
    return { officer: { value: "Unassigned", label: "Unassigned" } };
  }

  // Province-wide, HWCR only and Parks role defaults to only "Open" so skip the other checks
  if (
    UserService.hasRole(Roles.PROVINCE_WIDE) ||
    UserService.hasRole(Roles.HWCR_ONLY) ||
    UserService.hasRole(Roles.SECTOR)
  ) {
    return filters;
  }

  const userAgency = UserService.getUserAgency();
  if (userAgency === AgencyType.COS) {
    if (UserService.hasRole(Roles.INSPECTOR)) {
      filters = { ...filters, region: defaultRegion };
    } else {
      filters = { ...filters, zone: defaultZone };
    }
  } else if (UserService.hasRole(Roles.PARKS)) {
    filters = { ...filters, area: defaultParkArea };
  } else if (currentOfficer && !UserService.hasRole(Roles.CEEB_COMPLIANCE_COORDINATOR)) {
    const { first_name: firstName, last_name: lastName, app_user_guid: id } = currentOfficer;
    const officer = { label: `${lastName}, ${firstName}`, value: id };
    filters = { ...filters, officer };
  }

  return filters;
};
