import { AllegationComplaint } from "@apptypes/complaints/allegation-complaint";
import { HwcrComplaint } from "@apptypes/complaints/hwcr-complaint";

export type ComplaintSearchResults = {
  complaints: HwcrComplaint | AllegationComplaint;
  totalCount: number;
};
