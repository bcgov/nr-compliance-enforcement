import Option from "@apptypes/app/option";

export interface ComplaintRequestPayload {
  sortColumn: string;
  sortOrder: string;
  agencyFilter?: Option;
  complaintTypeFilter?: Option;
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
  outcomeActionedByFilter?: Option;
  outcomeAnimalStartDateFilter?: Date;
  outcomeAnimalEndDateFilter?: Date;
  equipmentStatusFilter?: Option;
  equipmentTypesFilter?: Option[];
  page?: number;
  pageSize?: number;
  showReferrals?: boolean;
  query?: string;
}
