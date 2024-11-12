import { OfficeAssignment } from "@apptypes/app/office/office-assignment";
import { Office } from "./office";

export interface OfficeState {
  officesInZone: Array<Office>;
  //-- this state object is only ever to be used for usemanagement
  //-- the office state is also black listed  to prevent this from staying in state
  officeAssignments: Array<OfficeAssignment>;
}
