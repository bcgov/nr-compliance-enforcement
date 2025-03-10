import { ReportedByCode } from "src/v1/reported_by_code/entities/reported_by_code.entity";
import { Point } from "typeorm";

export class ComplaintUpdatesDto {
  complaintUpdateGuid: string;
  complaintIdentifier: string;
  updateSeqNumber: number;
  updDetailText?: string;
  updLocationSummaryText?: string;
  updLocationDetailedText?: string;
  updLocationGeometryPoint?: Point;
  updCallerName?: string;
  updCallerPhone1?: string;
  updCallerPhone2?: string;
  updCallerPhone3?: string;
  updCallerAddress?: string;
  updCallerEmail?: string;
  updReportedByCode?: ReportedByCode;
  updReportedByOtherText?: string;
  createUserId: string;
  createUtcTimestamp: Date;
  updateUserId: string;
  updateUtcTimestamp?: Date;
}
