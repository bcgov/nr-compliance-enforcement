import { PreventionActionInput } from "./prevention-action.input";

export class PreventionInput {
  id?: string;
  actions: [PreventionActionInput];
}
