import { WebEOCComplaintUpdateDTO } from "./webeoc-complaint-update";
import { ActionTaken } from "./action-taken";

export interface RelatedData {
  updates: Array<WebEOCComplaintUpdateDTO>;
  actions: Array<ActionTaken>;
}
