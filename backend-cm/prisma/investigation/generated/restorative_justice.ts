import { enforcement_action } from "./enforcement_action";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class restorative_justice {
  @ApiProperty({ type: String })
  restorative_justice_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiPropertyOptional({ type: Date })
  hearing_date?: Date;

  @ApiPropertyOptional({ type: Date })
  decision_date?: Date;

  @ApiPropertyOptional({ type: Boolean })
  remediation_required_ind?: boolean;

  @ApiPropertyOptional({ type: String })
  comment?: string;

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

  @ApiProperty({ type: () => enforcement_action })
  enforcement_action: enforcement_action;
}
