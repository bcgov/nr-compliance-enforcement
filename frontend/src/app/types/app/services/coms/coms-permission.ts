import { UUID } from "crypto";

export interface ComsPermission {
  id: UUID;
  bucketId: UUID;
  userId: UUID;
  permCode: "READ" | "CREATE" | "UPDATE" | "DELETE" | "MANAGE";
}
