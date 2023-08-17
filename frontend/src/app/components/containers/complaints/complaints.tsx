import { FC, useState, useEffect, useContext } from "react";
import { Nav, Navbar, Tabs, Tab } from "react-bootstrap";
import { useCollapse } from "react-collapsed";
import COMPLAINT_TYPES, {
  complaintTypeToName,
} from "../../../types/app/complaint-types";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { selectTotalComplaintsByType } from "../../../store/reducers/complaints";
import { ComplaintFilter } from "./complaint-filter";
import { ComplaintList } from "./complaint-list";
import {
  ComplaintFilterContext,
  ComplaintFilterProvider,
} from "../../../providers/complaint-filter-provider";
import { ComplaintFilterBar } from "./complaint-filter-bar";

type Props = {
  defaultComplaintType: string;
};

const Complaints: FC<Props> = ({ defaultComplaintType }) => {
  const dispatch = useAppDispatch();
  const [complaintType, setComplaintType] = useState(defaultComplaintType);

  const { resetFilters } = useContext(ComplaintFilterContext);

  const totalComplaints = useAppSelector(
    selectTotalComplaintsByType(complaintType)
  );
  const [isExpanded, setExpanded] = useState(false);
  const { getToggleProps } = useCollapse({ isExpanded });

  useEffect(() => {}, []);

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
    resetFilters();
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
      <ComplaintFilter type={complaintType} isOpen={isExpanded} />
      <ComplaintFilterBar />
      <ComplaintList type={complaintType} />
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
