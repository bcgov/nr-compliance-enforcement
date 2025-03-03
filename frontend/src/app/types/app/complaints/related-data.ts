import { WebEOCComplaintUpdateDTO } from "./webeoc-complaint-update";
import { ActionTaken } from "./action-taken";
import { ComplaintReferral } from "@/app/types/app/complaints/complaint-referral";

export interface RelatedData {
  updates: Array<WebEOCComplaintUpdateDTO>;
  actions: Array<ActionTaken>;
  referrals: Array<ComplaintReferral>;
}
