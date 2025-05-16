import { PreventionActionDto } from "./prevention-action";
export interface PreventionDto {
  id: string;
  agencyCode: string;
  actions: Array<PreventionActionDto>;
}
