import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";

export type ComplaintSearchResults = {
  complaints: HwcrComplaint | AllegationComplaint;
  totalCount: number;
};
