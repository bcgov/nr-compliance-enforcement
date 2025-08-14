import { PreventionActionDto } from "./prevention-action";
export interface PreventionDto {
  id: string;
  outcomeAgencyCode: string;
  actions: Array<PreventionActionDto>;
}
