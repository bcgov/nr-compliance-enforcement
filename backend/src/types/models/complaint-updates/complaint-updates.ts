import { Point } from "typeorm";

export class ComplaintUpdatesDto {
  complaintUpdateGuid: string;
  complaintIdentifier: string;
  updateSeqNumber: number;
  updDetailText: string | null;
  updLocationSummaryText: string | null;
  updLocationDetailedText: string | null;
  updLocationGeometryPoint: Point | null;
  createUserId: string;
  createUtcTimestamp: Date;
  updateUserId: string;
  updateUtcTimestamp: Date | null;
}
