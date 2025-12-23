import { FC } from "react";
import { Nav } from "react-bootstrap";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { NavigationTab } from "@apptypes/app/complaints/navigation-tabs";
import { COMPLAINT_VIEW_TYPES } from "@constants/complaint-view-type";
import { useAppSelector } from "@hooks/hooks";
import { selectTotalComplaintsByType, selectTotalMappedComplaints } from "@store/reducers/complaints";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";

type props = {
  complaintType: string;
  viewType: string;
  complaintTypes: Array<string>;
  onTabChange: Function;
};

export const ComplaintListTabs: FC<props> = ({ complaintType, viewType, complaintTypes, onTabChange }) => {
  const totalComplaints = useAppSelector(selectTotalComplaintsByType(complaintType));
  const totalComplaintsOnMap = useAppSelector(selectTotalMappedComplaints);

  // renders the complaint count on the list and map views, for the selected complaint type
  const complaintTotal = (selectedComplaintType: string): string | undefined => {
    if (COMPLAINT_VIEW_TYPES.MAP === viewType) {
      if (complaintType === selectedComplaintType) {
        return `(${totalComplaintsOnMap})`;
      }
    } else if (complaintType === selectedComplaintType) {
      return `(${totalComplaints})`;
    }
  };

  //--
  //-- Return a list of navigation tabs from COMPLAINT_TYPES enum
  //-- this will allow some customization of the label used to
  //-- identify each tab. for example for the ERS tab we want to
  //-- provide an alternate label based on the users role if they are
  //-- a CEEB user
  //--
  const tabs = (types: Array<string>): Array<NavigationTab> => {
    return types.map((item) => {
      let name = "";
      let record = { name: "", id: `${item.toLocaleLowerCase()}-tab`, code: item };

      switch (item) {
        case COMPLAINT_TYPES.ERS:
          if (UserService.hasRole(Roles.CEEB)) {
            name = "Waste and Pesticides";
          } else {
            name = "Enforcement";
          }

          record = { ...record, name };
          break;
        case COMPLAINT_TYPES.HWCR:
          record = { ...record, name: "Human Wildlife Conflicts" };
          break;
        case COMPLAINT_TYPES.GIR:
          record = { ...record, name: "General Incidents" };
          break;
        case COMPLAINT_TYPES.SECTOR:
          record = { ...record, name: "Sector View" };
          break;
        default:
          record = { ...record, name: "default" };
      }

      return record;
    });
  };

  return (
    <Nav className="nav nav-tabs">
      {tabs(complaintTypes).map(({ id, code, name }) => {
        return (
          <Nav.Item
            className={`nav-item comp-tab comp-tab-${complaintType === code ? "active" : "inactive"}`}
            key={`${code}-tab-item`}
          >
            <Nav.Link
              className={`nav-link ${complaintType === code ? "active" : "inactive"}`}
              id={id}
              onClick={() => onTabChange(code)}
            >
              {name} {complaintTotal(code)}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};
