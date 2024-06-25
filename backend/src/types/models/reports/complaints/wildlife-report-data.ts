import { ComplaintReportData } from "./complaint-report-data";

export interface WildlifeReportData extends ComplaintReportData {
  //-- hwcr
  natureOfComplaint: string;
  species: string;
  attractants: string;
}
