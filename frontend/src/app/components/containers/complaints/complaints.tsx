import { FC, useState, useContext } from "react";
import { shallowEqual } from "react-redux";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useCollapse } from "react-collapsed";
import COMPLAINT_TYPES, { complaintTypeToName } from "../../../types/app/complaint-types";
import { useAppSelector } from "../../../hooks/hooks";
import { selectTotalComplaintsByType, selectTotalMappedComplaints } from "../../../store/reducers/complaints";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import { ComplaintFilterContext, ComplaintFilterProvider } from "../../../providers/complaint-filter-provider";
import { resetFilters, ComplaintFilterPayload } from "../../../store/reducers/complaint-filters";
import { selectDefaultZone } from "../../../store/reducers/app";
import { ComplaintMap } from "./complaint-map";
import { COMPLAINT_VIEW_TYPES } from "../../../constants/complaint-view-type";
import { useNavigate } from "react-router-dom";

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

  const [isExpanded, setExpanded] = useState(false);
  const { getToggleProps } = useCollapse({ isExpanded });

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

  return (
    <>
      <div className="nat-page-header">
        <div className="nat-title-container">
          <h1>Complaints</h1>
          <Button onClick={() => handleCreateClick()}>Create Complaint</Button>
        </div>
      </div>

      {/* <div className="comp-sub-header">Complaints</div> */}

      {/* <!-- create list of complaint types --> */}

      <Nav
        variant="underline"
        className="nav nav-tabs"
      >
        {/* <!-- dynamic tabs --> */}
        {complaintTypes.map(({ id, code, name }) => {
          return (
            <Nav.Item
              className={`nav-item comp-tab-${complaintType === code ? "active" : "inactive"}`}
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

        {/* <Nav.Item
          {...getToggleProps({
            onClick: () => {
              const filterElem = document.querySelector("#collapsible-complaints-list-filter-id");
              const rect = filterElem?.getBoundingClientRect();
              const bottom = rect?.bottom;

              if ({ isExpanded }.isExpanded && bottom !== undefined && bottom < 140) {
                //page has been scrolled while filter is open... need to close it!
                setExpanded((prevExpanded) => !prevExpanded);
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setExpanded((prevExpanded) => !prevExpanded);
            },
          })}
        >
          <div
            className="complaint-filter-image-container"
            id="complaint-filter-image-id"
          >
            <i className="bi bi-filter filter-image-spacing"></i>
          </div>
          <div className="left-float">Filters</div>
          <div className="clear-left-float"></div>
        </Nav.Item> */}
      </Nav>

      <div>
        <ComplaintFilter
          type={complaintType}
          isOpen={isExpanded}
        />
        <ComplaintFilterBar
          viewType={viewType}
          toggleViewType={toggleViewType}
          complaintType={complaintType}
          searchQuery={search}
          applySearchQuery={setSearch}
        />
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
    </>
  );
};

export const ComplaintsWrapper: FC<Props> = ({ defaultComplaintType }) => {
  const defaultZone = useAppSelector(selectDefaultZone, shallowEqual);
  return (
    <>
      {defaultZone && (
        <ComplaintFilterProvider zone={defaultZone}>
          <Complaints defaultComplaintType={defaultComplaintType} />
        </ComplaintFilterProvider>
      )}
    </>
  );
};
