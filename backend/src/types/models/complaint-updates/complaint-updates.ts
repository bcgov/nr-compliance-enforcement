import { StringNullableChain } from "lodash";
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
  updReportedByCode?: string;
  updReportedByOtherText?: string;
  createUserId: string;
  createUtcTimestamp: Date;
  updateUserId: string;
  updateUtcTimestamp?: Date;
}
