import { FC, useState, useContext, useCallback, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import { ComplaintFilterContext, ComplaintFilterProvider } from "../../../providers/complaint-filter-provider";
import { resetFilters, ComplaintFilterPayload } from "../../../store/reducers/complaint-filters";

import { selectDefaultZone, setActiveTab } from "../../../store/reducers/app";

import { ComplaintMap } from "./complaint-map";
import { useNavigate } from "react-router-dom";
import { ComplaintListTabs } from "./complaint-list-tabs";
import { COMPLAINT_TYPES, CEEB_TYPES } from "../../../types/app/complaint-types";
import { selectCurrentOfficer } from "../../../store/reducers/officer";
import UserService from "../../../service/user-service";
import Roles from "../../../types/app/roles";
import Option from "../../../types/app/option";

type Props = {
  defaultComplaintType: string;
};

export const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const { dispatch: filterDispatch } = useContext(ComplaintFilterContext); //-- make sure to keep this dispatch renamed
  const [complaintType, setComplaintType] = useState(defaultComplaintType);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [viewType, setViewType] = useState<"map" | "list">("list");

  const currentOfficer = useAppSelector(selectCurrentOfficer(), shallowEqual);

  const defaultZone = useAppSelector(selectDefaultZone);

  //-- this is used to apply the search to the pager component
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(setActiveTab(defaultComplaintType));
  }, [dispatch, defaultComplaintType]);

  const handleComplaintTabChange = (complaintType: string) => {
    setComplaintType(complaintType);

    let filters = getFilters(currentOfficer, defaultZone);

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
    setViewType(view);
  };

  // Show/Hide Mobile Filters
  const [show, setShow] = useState(false);
  const hideFilters = () => setShow(false);
  const toggleShowMobileFilters = useCallback(() => setShow((prevShow) => !prevShow), []);

  const [open, setOpen] = useState(false);
  const toggleShowDesktopFilters = useCallback(() => setOpen((prevShow) => !prevShow), []);

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <ToastContainer />
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Complaints</h1>
          <Button onClick={() => handleCreateClick()}>Create Complaint</Button>
        </div>
        {/* <!-- create list of complaint types --> */}

        <ComplaintListTabs
          complaintType={complaintType}
          viewType={viewType}
          complaintTypes={Object.keys(getComplaintTypes())}
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
            <ComplaintMap
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
  const currentOfficer = useAppSelector(selectCurrentOfficer(), shallowEqual);
  const filters = getFilters(currentOfficer, defaultZone);

  return (
    <>
      {currentOfficer && (
        <ComplaintFilterProvider {...filters}>
          <Complaints defaultComplaintType={defaultComplaintType} />
        </ComplaintFilterProvider>
      )}
    </>
  );
};
const getComplaintTypes = () => {
  return UserService.hasRole(Roles.CEEB) ? CEEB_TYPES : COMPLAINT_TYPES;
};

const getFilters = (currentOfficer: any, defaultZone: any) => {
  let filters: any = {};

  if (UserService.hasRole([Roles.CEEB]) && !UserService.hasRole([Roles.CEEB_COMPLIANCE_COORDINATOR])) {
    if (currentOfficer) {
      let {
        person: { firstName, lastName, id },
      } = currentOfficer;
      const officer = { label: `${lastName}, ${firstName}`, value: id };

      filters = { ...filters, officer };
    }
  }

  if (UserService.hasRole([Roles.CEEB, Roles.CEEB_COMPLIANCE_COORDINATOR])) {
    // No additional filters needed, default will apply
  } else if (defaultZone) {
    filters = { ...filters, zone: defaultZone };
  }

  return filters;
};
