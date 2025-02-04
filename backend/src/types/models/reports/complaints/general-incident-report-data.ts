import { ComplaintReportData } from "./complaint-report-data";

export interface GeneralIncidentReportData extends ComplaintReportData {
  generalIncidentType: string;
}
