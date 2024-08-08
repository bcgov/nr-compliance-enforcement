import { UUID } from "crypto";
import { ComplaintUpdate } from "src/v1/complaint_updates/entities/complaint_updates.entity";
import { ActionTaken } from "src/v1/complaint_updates/entities/action_taken.entity";

export interface RelatedDataDto {
  updates: Array<ComplaintUpdate>;
  actions: Array<ActionTaken>;
}
