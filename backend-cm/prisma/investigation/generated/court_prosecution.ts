import { court_prosecution_status_code } from "./court_prosecution_status_code";
import { enforcement_action } from "./enforcement_action";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class court_prosecution {
  @ApiProperty({ type: String })
  court_prosecution_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiPropertyOptional({ type: Boolean })
  approval_ind?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  remediation_required_ind?: boolean;

  @ApiProperty({ type: String })
  court_prosecution_status_code: string;

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

  @ApiProperty({ type: () => court_prosecution_status_code })
  court_prosecution_status_code_court_prosecution_court_prosecution_status_codeTocourt_prosecution_status_code: court_prosecution_status_code;

  @ApiProperty({ type: () => enforcement_action })
  enforcement_action: enforcement_action;
}
