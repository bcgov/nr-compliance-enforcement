import { contravention_party_xref } from "./contravention_party_xref";
import { enforcement_action_code } from "./enforcement_action_code";
import { ticket } from "./ticket";
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

  @ApiProperty({ type: () => contravention_party_xref })
  contravention_party_xref: contravention_party_xref;

  @ApiProperty({ type: () => enforcement_action_code })
  enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code: enforcement_action_code;

  @ApiProperty({ isArray: true, type: () => ticket })
  ticket: ticket[];
}
