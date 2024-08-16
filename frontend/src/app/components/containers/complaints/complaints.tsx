import { FC, useState, useContext, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { Button, Collapse, Offcanvas } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import { ComplaintFilterContext, ComplaintFilterProvider } from "../../../providers/complaint-filter-provider";
import { resetFilters, ComplaintFilterPayload } from "../../../store/reducers/complaint-filters";

import { selectDefaultZone, selectOfficerAgency } from "../../../store/reducers/app";
import { ComplaintMap } from "./complaint-map";
import { useNavigate } from "react-router-dom";
import { ComplaintListTabs } from "./complaint-list-tabs";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters/complaint-filters";
import { selectCurrentOfficer } from "../../../store/reducers/officer";

type Props = {
  defaultComplaintType: string;
};

export const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const { dispatch: filterDispatch } = useContext(ComplaintFilterContext); //-- make sure to keep this dispatch renamed
  const [complaintType, setComplaintType] = useState(defaultComplaintType);
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<"map" | "list">("list");

  const currentOfficer = useAppSelector(selectCurrentOfficer(), shallowEqual);

  const defaultZone = useAppSelector(selectDefaultZone);

  const userAgency = useAppSelector(selectOfficerAgency, shallowEqual);

  //-- this is used to apply the search to the pager component
  const [search, setSearch] = useState("");

  const handleComplaintTabChange = (complaintType: string) => {
    setComplaintType(complaintType);

    //-- apply default filters, if more need to be set they can be added as needed
    let payload: Array<ComplaintFilterPayload> = [];
    // for CEEB default filter includes current user
    if (userAgency === "EPO") {
      if (currentOfficer) {
        let {
          person: { id, firstName, lastName },
        } = currentOfficer;
        payload = [{ filter: "officer", value: { value: id, label: `${lastName}, ${firstName}` } }];
      }
    } else if (defaultZone) {
      payload = [{ filter: "zone", value: defaultZone }];
    }

    payload = [...payload, { filter: "status", value: { value: "OPEN", label: "Open" } }];

    setSearch("");

    filterDispatch(resetFilters(payload));
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
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Complaints</h1>
          <Button onClick={() => handleCreateClick()}>Create Complaint</Button>
        </div>
        {/* <!-- create list of complaint types --> */}

        <ComplaintListTabs
          complaintType={complaintType}
          viewType={viewType}
          complaintTypes={Object.keys(COMPLAINT_TYPES)}
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
              <div className="comp-data-filters-header">Filter by</div>
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
  const userAgency = useAppSelector(selectOfficerAgency, shallowEqual);
  const currentOfficer = useAppSelector(selectCurrentOfficer(), shallowEqual);

  const complaintFilters: any = {};
  if (userAgency === "EPO") {
    if (currentOfficer) {
      let {
        person: { firstName, lastName, id },
      } = currentOfficer;
      (complaintFilters as ComplaintFilters).officer = { label: `${lastName}, ${firstName}`, value: id };
    }
  } else {
    (complaintFilters as ComplaintFilters).zone = defaultZone;
  }

  return (
    <>
      {complaintFilters && (
        <ComplaintFilterProvider {...complaintFilters}>
          <Complaints defaultComplaintType={defaultComplaintType} />
        </ComplaintFilterProvider>
      )}
    </>
  );
};
