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
  webeocId?: string;
}

export interface UpdateActionDTO {
  updateGuid: UUID;
  updateSeqNumber: number | null;
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
  webeocId?: string;
  actionTakenGuid?: UUID | null;
  actionDetailsText: string | null;
  loggedByText: string | null;
  isUpdate: boolean;
}
