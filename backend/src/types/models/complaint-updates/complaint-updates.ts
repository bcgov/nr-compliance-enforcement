import { Point } from "typeorm";

export class ComplaintUpdatesDto {
  complaintUpdateGuid: string;
  complaintIdentifier: string;
  updateSeqNumber: number;
  updDetailText?: string;
  updLocationSummaryText?: string;
  updLocationDetailedText?: string;
  updLocationGeometryPoint?: Point;
  createUserId: string;
  createUtcTimestamp: Date;
  updateUserId: string;
  updateUtcTimestamp?: Date;
}
