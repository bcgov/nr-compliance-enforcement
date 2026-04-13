import { enforcement_action_code } from "./enforcement_action_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class enforcement_action_code_agency_xref {
  @ApiProperty({ type: String })
  enforcement_action_code_agency_xref_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_code: string;

  @ApiProperty({ type: String })
  agency_code_ref: string;

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

  @ApiProperty({ type: () => enforcement_action_code })
  enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code: enforcement_action_code;
}
