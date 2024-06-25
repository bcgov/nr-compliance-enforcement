import { ComplaintReportData } from "./complaint-report-data";

export interface AllegationReportData extends ComplaintReportData {
  //-- ers
  violationType: string;
  inProgress: string;
  wasObserved: string;
  details: string;
}
