import Option from "../app/option";
import COMPLAINT_TYPES from '../app/complaint-types';

export interface ComplaintFilters {
  sortColumn: string;
  sortOrder: string;
  regionCodeFilter?: Option;
  zoneCodeFilter?: Option;
  areaCodeFilter?: Option;
  officerFilter?: Option;
  natureOfComplaintFilter?: Option;
  speciesCodeFilter?: Option;
  violationFilter?: Option;
  startDateFilter?: Date;
  endDateFilter?: Date;
  statusFilter?: Option;
}
