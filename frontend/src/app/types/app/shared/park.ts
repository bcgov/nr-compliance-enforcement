import { UUID } from "node:crypto";
import { ParkArea } from "@apptypes/app/shared/parkArea";

export interface Park {
  parkGuid: UUID;
  externalId?: UUID;
  name: string;
  legalName?: string;
  parkAreas?: Array<ParkArea>;
  isFallback?: boolean;
}
