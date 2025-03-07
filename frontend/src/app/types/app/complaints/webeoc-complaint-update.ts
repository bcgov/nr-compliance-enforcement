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
  updCallerName: string | null;
  updCallerPhone1: string | null;
  updCallerPhone2: string | null;
  updCallerPhone3: string | null;
  updCallerAddress: string | null;
  updCallerEmail: string | null;
  updReportedByCode: string | null;
  updReportedByOtherText: string | null;
  createUserId: string;
  createUtcTimestamp: string;
  updateUserId: string;
  updateUtcTimestamp: string;
  webeocId?: string;
}
