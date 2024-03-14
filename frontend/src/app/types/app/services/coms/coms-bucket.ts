import { UUID } from "crypto";
import { ComsPermission } from "./coms-permission";

export interface ComsBucket {
  bucketId: UUID;
  permissions: Array<ComsPermission>;
}
