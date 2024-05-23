import { UUID } from "crypto";

export interface WebEOCComplaintUpdateDTO {
  complaintUpdateGuid: UUID;
  updateSeqNumber: number;
  updDetailText: string | null;
  updLocationSummaryText: string | null;
  updLocationDetailedText: string | null;
  updLocationGeometryPoint: {
    type: string;
    coordinates: [number, number];
  } | null;
  createUserId: string;
  createUtcTimestamp: string;
  updateUserId: string;
  updateUtcTimestamp: string;
}
