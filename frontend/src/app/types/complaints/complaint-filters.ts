import Option from "../app/option";

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
  girTypeFilter?: Option;
  startDateFilter?: Date;
  endDateFilter?: Date;
  complaintStatusFilter?: Option;
  complaintMethodFilter?: Option;
  page?: number;
  pageSize?: number;
  query?: string;
}
