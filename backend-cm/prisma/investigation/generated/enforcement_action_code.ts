import { enforcement_action } from "./enforcement_action";
import { enforcement_action_code_agency_xref } from "./enforcement_action_code_agency_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class enforcement_action_code {
  @ApiProperty({ type: String })
  enforcement_action_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

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

  @ApiProperty({ isArray: true, type: () => enforcement_action })
  enforcement_action_enforcement_action_enforcement_action_codeToenforcement_action_code: enforcement_action[];

  @ApiProperty({ isArray: true, type: () => enforcement_action_code_agency_xref })
  enforcement_action_code_agency_xref_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code: enforcement_action_code_agency_xref[];
}
