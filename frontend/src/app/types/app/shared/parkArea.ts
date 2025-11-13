import { UUID } from "node:crypto";

export interface ParkArea {
  parkAreaGuid: UUID;
  name: string;
  regionName?: string;
}
