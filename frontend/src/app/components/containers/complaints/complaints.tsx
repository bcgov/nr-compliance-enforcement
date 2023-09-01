import { FC, useState, useEffect, useContext, useCallback } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useCollapse } from "react-collapsed";
import COMPLAINT_TYPES, {
  complaintTypeToName,
} from "../../../types/app/complaint-types";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectTotalComplaintsByType } from "../../../store/reducers/complaints";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";

import { ComplaintFilterBar } from "./complaint-filter-bar";
import {
  ComplaintFilterContext,
  ComplaintFilterProvider,
} from "../../../providers/complaint-filter-provider";
import {
  resetFilters,
  ComplaintFilterPayload,
  updateFilter,
} from "../../../store/reducers/complaint-filters";
import {
  selectDefaultZone,
  getTokenProfile,
} from "../../../store/reducers/app";
import { DropdownOption } from "../../../types/code-tables/option";

type Props = {
  defaultComplaintType: string;
};

export const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const dispatch = useAppDispatch();
  const { dispatch: filterDispatch } = useContext(ComplaintFilterContext); //-- make sure to keep this dispatch renamed
  const [complaintType, setComplaintType] = useState(defaultComplaintType);

  const defaultZone = useAppSelector(selectDefaultZone);
  const defaultStatus: DropdownOption = { value: "OPEN", label: "Open" };

  const totalComplaints = useAppSelector(
    selectTotalComplaintsByType(complaintType)
  );
  const [isExpanded, setExpanded] = useState(false);
  const { getToggleProps } = useCollapse({ isExpanded });

  useEffect(() => {
    if (!defaultZone) {
      dispatch(getTokenProfile());

      setFilter("zone", defaultZone);
      setFilter("status", defaultStatus);
    } else {
      setFilter("zone", defaultZone);
      setFilter("status", defaultStatus);
    }
  }, [defaultZone]);

  const setFilter = useCallback(
    (name: string, value?: DropdownOption | Date | null) => {
      let payload: ComplaintFilterPayload = { filter: name, value };
      filterDispatch(updateFilter(payload));
    },
    []
  );

  const complaintTypes: Array<{ name: string; id: string; code: string }> =
    Object.keys(COMPLAINT_TYPES).map((item) => {
      return {
        name: complaintTypeToName(item),
        id: `${item.toLocaleLowerCase()}-tab`,
        code: item,
      };
    });

  const renderComplaintTotal = (code: string): string | undefined => {
    if (complaintType === code) {
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
        { filter: "status", value: defaultStatus },
      ];
    }
    filterDispatch(resetFilters(payload));
  };

  return (
    <>
      <div className="comp-sub-header">Complaints</div>

      {/* <!-- create list of complaint types --> */}
      <Navbar className="basic-navbar-nav complaint-tab-container-width">
        <Nav className="nav nav-tabs comp-tab container-fluid">
          {/* <!-- dynamic tabs --> */}
          {complaintTypes.map(({ id, code, name }) => {
            return (
              <Nav.Item
                className={`nav-item comp-tab-${
                  complaintType === code ? "active" : "inactive"
                }`}
                key={`${code}-tab-item`}
              >
                <div
                  className={`nav-link ${
                    complaintType === code ? "active" : "inactive"
                  }`}
                  id={id}
                  onClick={() => handleComplaintTabChange(code)}
                >
                  {name} {renderComplaintTotal(code)}
                </div>
              </Nav.Item>
            );
          })}

          {/* <!-- dynamic tabs end --> */}
          <Nav.Item
            className="ms-auto"
            {...getToggleProps({
              onClick: () => setExpanded((prevExpanded) => !prevExpanded),
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
          </Nav.Item>
        </Nav>
      </Navbar>

      <div>
        <ComplaintFilter type={complaintType} isOpen={isExpanded} />
        <ComplaintFilterBar />
        <ComplaintList type={complaintType} />
      </div>
    </>
  );
};

export const ComplaintsWrapper: FC<Props> = ({ defaultComplaintType }) => {
  return (
    <ComplaintFilterProvider>
      <Complaints defaultComplaintType={defaultComplaintType} />
    </ComplaintFilterProvider>
  );
};
