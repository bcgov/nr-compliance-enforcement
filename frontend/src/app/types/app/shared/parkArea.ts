import { UUID } from "crypto";

export interface ParkArea {
  parkAreaGuid: UUID;
  name: string;
  regionName?: string;
}
