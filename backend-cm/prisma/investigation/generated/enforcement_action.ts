import { administrative_penalty } from "./administrative_penalty";
import { administrative_sanction } from "./administrative_sanction";
import { court_prosecution } from "./court_prosecution";
import { contravention_party_xref } from "./contravention_party_xref";
import { enforcement_action_code } from "./enforcement_action_code";
import { enforcement_order } from "./enforcement_order";
import { restorative_justice } from "./restorative_justice";
import { ticket } from "./ticket";
import { warning } from "./warning";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class enforcement_action {
  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiProperty({ type: String })
  contravention_party_xref_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_code: string;

  @ApiProperty({ type: Date })
  date_issued: Date;

  @ApiProperty({ type: String })
  geo_organization_unit_code_ref: string;

  @ApiProperty({ type: String })
  app_user_guid_ref: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  comment?: string;

  @ApiPropertyOptional({ type: String })
  issuing_officer_guid_ref?: string;

  @ApiPropertyOptional({ type: Date })
  date_served?: Date;

  @ApiProperty({ isArray: true, type: () => administrative_penalty })
  administrative_penalty: administrative_penalty[];

  @ApiProperty({ isArray: true, type: () => administrative_sanction })
  administrative_sanction: administrative_sanction[];

  @ApiProperty({ isArray: true, type: () => court_prosecution })
  court_prosecution: court_prosecution[];

  @ApiProperty({ type: () => contravention_party_xref })
  contravention_party_xref: contravention_party_xref;

  @ApiProperty({ type: () => enforcement_action_code })
  enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code: enforcement_action_code;

  @ApiProperty({ isArray: true, type: () => enforcement_order })
  enforcement_order: enforcement_order[];

  @ApiProperty({ isArray: true, type: () => restorative_justice })
  restorative_justice: restorative_justice[];

  @ApiProperty({ isArray: true, type: () => ticket })
  ticket: ticket[];

  @ApiProperty({ isArray: true, type: () => warning })
  warning: warning[];
}
