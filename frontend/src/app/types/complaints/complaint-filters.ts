import Option from "@apptypes/app/option";

export interface ComplaintFilters {
  sortColumn: string;
  sortOrder: string;
  regionCodeFilter?: Option;
  zoneCodeFilter?: Option;
  areaCodeFilter?: Option;
  parkFilter?: Option;
  areaFilter?: Option;
  officerFilter?: Option;
  natureOfComplaintFilter?: Option;
  speciesCodeFilter?: Option;
  violationFilter?: Option;
  girTypeFilter?: Option;
  startDateFilter?: Date;
  endDateFilter?: Date;
  complaintStatusFilter?: Option;
  complaintMethodFilter?: Option;
  actionTakenFilter?: Option;
  outcomeAnimalFilter?: Option;
  outcomeAnimalStartDateFilter?: Date;
  outcomeAnimalEndDateFilter?: Date;
  outcomeActionedByFilter?: Option;
  equipmentStatusFilter?: Option;
  equipmentTypeFilter?: Option;
  equipmentTypesFilter?: Option[];
  page?: number;
  pageSize?: number;
  query?: string;
}
