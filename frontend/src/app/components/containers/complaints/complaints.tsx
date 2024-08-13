import { FC, useState, useContext, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { Button, Collapse, Nav, Offcanvas } from "react-bootstrap";
import COMPLAINT_TYPES, { complaintTypeToName } from "../../../types/app/complaint-types";
import { useAppSelector } from "../../../hooks/hooks";
import { selectTotalComplaintsByType, selectTotalMappedComplaints } from "../../../store/reducers/complaints";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import { ComplaintFilterContext, ComplaintFilterProvider } from "../../../providers/complaint-filter-provider";
import { resetFilters, ComplaintFilterPayload } from "../../../store/reducers/complaint-filters";
import {
  selectDefaultZone,
  profilePersonalGuid,
  profileDisplayName,
  selectOfficerAgency,
} from "../../../store/reducers/app";
import { ComplaintMap } from "./complaint-map";
import { COMPLAINT_VIEW_TYPES } from "../../../constants/complaint-view-type";
import { useNavigate } from "react-router-dom";
import { DropdownOption } from "../../../types/app/drop-down-option";

type Props = {
  defaultComplaintType: string;
};

export const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const { dispatch: filterDispatch } = useContext(ComplaintFilterContext); //-- make sure to keep this dispatch renamed
  const [complaintType, setComplaintType] = useState(defaultComplaintType);
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<"map" | "list">("list");

  const totalComplaints = useAppSelector(selectTotalComplaintsByType(complaintType));

  const totalComplaintsOnMap = useAppSelector(selectTotalMappedComplaints);

  const defaultZone = useAppSelector(selectDefaultZone);

  //-- this is used to apply the search to the pager component
  const [search, setSearch] = useState("");

  const complaintTypes: Array<{ name: string; id: string; code: string }> = Object.keys(COMPLAINT_TYPES).map((item) => {
    return {
      name: complaintTypeToName(item),
      id: `${item.toLocaleLowerCase()}-tab`,
      code: item,
    };
  });

  // renders the complaint count on the list and map views, for the selected complaint type
  const renderComplaintTotal = (selectedComplaintType: string): string | undefined => {
    if (COMPLAINT_VIEW_TYPES.MAP === viewType) {
      if (complaintType === selectedComplaintType) {
        return `(${totalComplaintsOnMap})`;
      }
    } else if (complaintType === selectedComplaintType) {
      return `(${totalComplaints})`;
    }
  };

  const handleComplaintTabChange = (complaintType: string) => {
    setComplaintType(complaintType);

    //-- apply default filters, if more need to be set they can be added as needed
    let payload: Array<ComplaintFilterPayload> = [];
    if (defaultZone) {
      payload = [
        { filter: "zone", value: defaultZone },
        { filter: "status", value: { value: "OPEN", label: "Open" } },
      ];
    }

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

        <Nav className="nav nav-tabs">
          {/* <!-- dynamic tabs --> */}
          {complaintTypes.map(({ id, code, name }) => {
            return (
              <Nav.Item
                className={`nav-item comp-tab comp-tab-${complaintType === code ? "active" : "inactive"}`}
                key={`${code}-tab-item`}
              >
                <div
                  className={`nav-link ${complaintType === code ? "active" : "inactive"}`}
                  id={id}
                  onClick={() => handleComplaintTabChange(code)}
                >
                  {name} {renderComplaintTotal(code)}
                </div>
              </Nav.Item>
            );
          })}

          {/* <!-- dynamic tabs end --> */}
        </Nav>

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

  const userPersonalGuid = useAppSelector(profilePersonalGuid, shallowEqual);
  const userDisplayName = useAppSelector(profileDisplayName, shallowEqual);
  const userAgency = useAppSelector(selectOfficerAgency, shallowEqual);
  let officer: DropdownOption | null = null;
  let zone: DropdownOption | null = null;

  if (userAgency === "EPO") {
    officer = { value: userPersonalGuid, label: userDisplayName };
  } else {
    zone = defaultZone;
  }

  return (
    <>
      {defaultZone && (
        <ComplaintFilterProvider
          zone={zone}
          officer={officer}
        >
          <Complaints defaultComplaintType={defaultComplaintType} />
        </ComplaintFilterProvider>
      )}
    </>
  );
};
